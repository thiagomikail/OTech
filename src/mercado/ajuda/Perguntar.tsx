import { type FormEvent, useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { EDICOES } from '../edicoes';
import { LIMITE_PERGUNTA, RECUSA, type RespostaPergunta, type Trecho, buscar, foraDoAssunto, lerResposta, limparPergunta, montarBusca } from '../perguntas';
import { Texto } from './Ajuda';

const BUSCA = montarBusca('otech', EDICOES);
const TRECHOS = new Map(BUSCA.trechos.map((t) => [t.id, t]));

/** A fonte leva à pergunta do FAQ (nesta página) ou à edição. */
const linkDa = (f: { ancora?: string; semana?: string }) => (f.ancora ? `#${f.ancora}` : f.semana ? `/mercado/?semana=${f.semana}` : null);

/**
 * A caixa de perguntas: RAG sobre o FAQ e as edições (`src/mercado/perguntas.ts`).
 * A pergunta de fora é recusada aqui mesmo, sem rede; a que passa vai pra
 * `/api/perguntar`, que confere de novo e chama o Gemini.
 */
async function perguntar(pergunta: string): Promise<RespostaPergunta> {
  const limpa = limparPergunta(pergunta);
  if (!limpa) return { tipo: 'erro', texto: `Escreva uma pergunta de 3 a ${LIMITE_PERGUNTA} caracteres.` };
  if (foraDoAssunto(BUSCA, limpa, buscar(BUSCA, limpa))) return { tipo: 'recusa', texto: RECUSA };
  try {
    const r = await fetch('/api/perguntar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pergunta: limpa }) });
    const dados = (await r.json()) as { texto?: string; ids?: string[]; recusa?: boolean; erro?: string };
    if (dados.recusa) return { tipo: 'recusa', texto: RECUSA };
    if (!r.ok || !dados.texto) return { tipo: 'erro', texto: dados.erro ?? 'Não deu pra perguntar agora. Tente de novo em um minuto.' };
    const trechos: Trecho[] = (dados.ids ?? []).map((id) => TRECHOS.get(id) ?? { id, titulo: id, texto: '' });
    return lerResposta(dados.texto, trechos);
  } catch {
    return { tipo: 'erro', texto: 'Não deu pra perguntar agora. Tente de novo em um minuto.' };
  }
}

export default function Perguntar() {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState<RespostaPergunta | null>(null);
  const [esperando, setEsperando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (pergunta.trim().length < 3 || esperando) return;
    setEsperando(true);
    setResposta(await perguntar(pergunta));
    setEsperando(false);
  };

  return (
    <section aria-labelledby="t-perguntar" className="mt-6 rounded-sm border border-line bg-surface" data-testid="perguntar">
      <div className="border-b border-line bg-strip px-3 py-2">
        <h2 id="t-perguntar" className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em]">
          <MessageCircleQuestion size={15} aria-hidden className="text-accent" /> Pergunte à base
        </h2>
        <p className="text-[13px] text-ink-2">Sobre as ideias, as regras, os dados ou a estrutura do site. Outro assunto, ela recusa.</p>
      </div>
      <form onSubmit={enviar} className="p-3">
        <label className="sr-only" htmlFor="pergunta">
          Sua pergunta
        </label>
        <textarea
          id="pergunta"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value.slice(0, LIMITE_PERGUNTA))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) void enviar(e);
          }}
          maxLength={LIMITE_PERGUNTA}
          rows={2}
          placeholder="Ex.: o que acontece se abrir abaixo do stop?"
          className="w-full resize-none rounded-sm border border-line bg-field px-3 py-2.5 text-[16px] leading-snug text-ink outline-none focus:border-accent"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="font-mono text-[12px] text-ink-3">
            {pergunta.length}/{LIMITE_PERGUNTA}
          </span>
          <button
            type="submit"
            disabled={esperando || pergunta.trim().length < 3}
            className="h-10 rounded-sm bg-accent px-4 text-[13px] font-semibold uppercase tracking-[0.04em] text-on-accent hover:bg-accent-hover disabled:opacity-40"
          >
            {esperando ? 'Procurando…' : 'Perguntar'}
          </button>
        </div>
      </form>

      {resposta && !esperando && (
        <div className="border-t border-line px-3 py-3" aria-live="polite" data-testid="resposta">
          {resposta.tipo === 'resposta' ? (
            <>
              <div className="whitespace-pre-line text-[15px] leading-relaxed text-ink-2">
                <Texto s={resposta.texto} />
              </div>
              {resposta.fontes.length > 0 && (
                <div className="mt-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">Fontes</p>
                  <ul className="mt-1 space-y-1 text-[14px]">
                    {resposta.fontes.map((f) => {
                      const href = linkDa(f);
                      return (
                        <li key={f.id} className="flex gap-2">
                          <span className="font-mono text-ink-3">[{f.n}]</span>
                          {href ? (
                            <a href={href} className="text-accent underline decoration-dotted underline-offset-2 hover:text-accent-hover">
                              {f.titulo}
                            </a>
                          ) : (
                            <span>{f.titulo}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className={resposta.tipo === 'recusa' ? 'text-[14px] text-ink-2' : 'text-[14px] text-red-ink'}>{resposta.texto}</p>
          )}
        </div>
      )}

      <p className="border-t border-line px-3 py-2 text-[12px] leading-relaxed text-ink-3">
        Quem escreve a resposta é o Gemini, do Google, só com os trechos deste FAQ e das edições. Pode errar: confira nas fontes. A pergunta não fica
        guardada aqui. Até {LIMITE_PERGUNTA} caracteres.
      </p>
    </section>
  );
}
