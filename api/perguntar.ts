/**
 * A caixa de perguntas do /mercado/ajuda/, servida pela Vercel: busca nos
 * trechos do FAQ e das edições, recusa o que não é sobre o Mercado e só então
 * chama o Gemini, com os trechos achados.
 *
 *   POST /api/perguntar   { "pergunta": "o que acontece se abrir abaixo do stop?" }
 *   → { "texto": "…[1]…", "ids": ["ajuda:gap", …] }   ou   { "recusa": true }
 *
 * A base é `/mercado/base.json`, que o build gera de `src/mercado/perguntas.ts`
 * (`pacoteDaBase`). A busca abaixo repete a de lá — esta função não importa
 * nada de `src/` — e `tests/mercado/api.test.ts` confere que as duas acham os
 * mesmos trechos e recusam as mesmas perguntas. O navegador já filtrou; aqui
 * filtra de novo, porque a função é pública.
 *
 * Não é um proxy do Gemini: pergunta fora do assunto não chega nele, a
 * instrução manda recusar o resto, e há teto por visitante e no total.
 * A chave (`GOOGLE_API_KEY`, ou a `VITE_GOOGLE_API_KEY` que já existe) fica
 * no servidor.
 */

export type Base = {
  instrucao: string;
  recusa: string;
  marcador: string;
  paradas: string[];
  temas: string[];
  notaMinima: number;
  trechos: { id: string; titulo: string; texto: string }[];
};

const LIMITE_PERGUNTA = 300;
const MODELOS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
const API = 'https://generativelanguage.googleapis.com/v1beta/models';

// ── a busca (a mesma de src/mercado/perguntas.ts)

const plano = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const raiz = (w: string) => (w.length > 4 && w.endsWith('s') ? w.slice(0, -1) : w);

const palavras = (paradas: Set<string>, t: string) =>
  plano(t)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !paradas.has(w))
    .map(raiz);

export type Indice = { base: Base; paradas: Set<string>; temas: Set<string>; docs: string[][]; df: Map<string, number>; media: number };

export function indexar(base: Base): Indice {
  const paradas = new Set(base.paradas);
  const docs = base.trechos.map((t) => [...palavras(paradas, t.titulo), ...palavras(paradas, t.titulo), ...palavras(paradas, t.texto)]);
  const df = new Map<string, number>();
  for (const d of docs) for (const w of new Set(d)) df.set(w, (df.get(w) ?? 0) + 1);
  return { base, paradas, temas: new Set(base.temas), docs, df, media: docs.reduce((s, d) => s + d.length, 0) / Math.max(docs.length, 1) };
}

/** Os trechos achados, do melhor pro pior — ou null quando a pergunta é de fora. */
export function buscar(ind: Indice, pergunta: string, k = 6): Base['trechos'] | null {
  const termos = palavras(ind.paradas, pergunta);
  if (!termos.some((w) => ind.temas.has(w))) return null;
  const unicos = [...new Set(termos)];
  const N = ind.docs.length;
  const achados = ind.docs
    .map((d, i) => {
      let nota = 0;
      for (const t of unicos) {
        const f = d.reduce((n, w) => n + (w === t ? 1 : 0), 0);
        if (!f) continue;
        const df = ind.df.get(t) ?? 0;
        const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
        nota += (idf * (f * 2.2)) / (f + 1.2 * (0.25 + (0.75 * d.length) / ind.media));
      }
      return { i, nota };
    })
    .filter((a) => a.nota > 0)
    .sort((a, b) => b.nota - a.nota)
    .slice(0, k);
  if (!achados.length || achados[0].nota < ind.base.notaMinima) return null;
  return achados.map((a) => ind.base.trechos[a.i]);
}

export function montarPrompt(pergunta: string, trechos: { titulo: string; texto: string }[]): string {
  const ctx = trechos.map((t, i) => `[${i + 1}] ${t.titulo}\n${t.texto}`).join('\n\n');
  return `Trechos:\n\n${ctx}\n\nPergunta: ${pergunta}`;
}

// ── os tetos: em memória, por instância — seguram rajada, não ataque distribuído

const vistos = new Map<string, number[]>();
function cabe(chave: string, porMinuto: number, porDia: number, agora = Date.now()) {
  const lista = (vistos.get(chave) ?? []).filter((t) => agora - t < 86_400_000);
  if (lista.filter((t) => agora - t < 60_000).length >= porMinuto || lista.length >= porDia) {
    vistos.set(chave, lista);
    return false;
  }
  lista.push(agora);
  vistos.set(chave, lista);
  if (vistos.size > 5000) vistos.delete(vistos.keys().next().value as string);
  return true;
}

// ── a base, uma vez por instância

let indice: Promise<Indice> | null = null;
function base(origem: string) {
  indice ??= fetch(`${origem}/mercado/base.json`, { signal: AbortSignal.timeout(5000) })
    .then((r) => {
      if (!r.ok) throw new Error(`base.json: ${r.status}`);
      return r.json() as Promise<Base>;
    })
    .then(indexar)
    .catch((e) => {
      indice = null;
      throw e;
    });
  return indice;
}

// ── o Gemini

async function gemini(chave: string, instrucao: string, prompt: string): Promise<string> {
  let ultimo = '';
  for (const modelo of MODELOS) {
    try {
      const r = await fetch(`${API}/${modelo}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': chave },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instrucao }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
        }),
        signal: AbortSignal.timeout(20_000),
      });
      if (r.status === 429) throw new Error('cota');
      if (!r.ok) {
        ultimo = `${modelo}: ${r.status}`;
        continue;
      }
      const dados = (await r.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
      return (dados.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('');
    } catch (e) {
      if (e instanceof Error && e.message === 'cota') throw e;
      ultimo = `${modelo}: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  throw new Error(ultimo || 'sem modelo');
}

const erro = (texto: string, status: number) => Response.json({ erro: texto }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  const url = new URL(request.url);
  const origem = request.headers.get('origin');
  if (origem && origem !== url.origin) return erro('origem não permitida', 403);

  let pergunta: unknown;
  try {
    const corpo = await request.text();
    if (corpo.length > 2000) return erro('pergunta longa demais', 413);
    pergunta = (JSON.parse(corpo) as { pergunta?: unknown }).pergunta;
  } catch {
    return erro('corpo: { "pergunta": "…" }', 400);
  }
  const limpa = typeof pergunta === 'string' ? pergunta.replace(/\p{Cc}/gu, ' ').replace(/\s+/g, ' ').trim() : '';
  if (limpa.length < 3 || limpa.length > LIMITE_PERGUNTA) return erro(`Escreva uma pergunta de 3 a ${LIMITE_PERGUNTA} caracteres.`, 400);

  let ind: Indice;
  try {
    ind = await base(url.origin);
  } catch {
    return erro('A caixa de perguntas está fora do ar agora.', 503);
  }
  const trechos = buscar(ind, limpa);
  if (!trechos) return Response.json({ recusa: true }, { headers: { 'Cache-Control': 'no-store' } });

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '?';
  if (!cabe(`ip:${ip}`, 4, 40) || !cabe('*', 20, 300)) return erro('Muitas perguntas seguidas. Espere um minuto e tente de novo.', 429);

  const chave = (process.env.GOOGLE_API_KEY ?? process.env.VITE_GOOGLE_API_KEY ?? '').trim();
  if (!chave) return erro('A caixa de perguntas está sem chave agora.', 503);

  try {
    const texto = await gemini(chave, ind.base.instrucao, montarPrompt(limpa, trechos));
    if (!texto.trim() || texto.includes(ind.base.marcador)) return Response.json({ recusa: true }, { headers: { 'Cache-Control': 'no-store' } });
    return Response.json({ texto: texto.trim(), ids: trechos.map((t) => t.id) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return erro('A IA não respondeu agora. Tente de novo em um minuto — ou procure no FAQ abaixo.', 502);
  }
}
