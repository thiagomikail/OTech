import type { Vela } from './desfecho';
import { type RespostaYahoo, velasDoStooq, velasDoYahoo } from './yahoo';

type Resposta = { fonte: 'yahoo'; dados: RespostaYahoo } | { fonte: 'stooq'; dados: string; cripto: boolean };

/**
 * Pregões de `de` até `ate`, pelo `api/precos.ts` da Vercel (o navegador não
 * pode chamar o Yahoo direto: CORS). FALHA QUIETO: sem a função (no `vite
 * dev`, por exemplo) ou sem provedor, devolve null e a tela diz 'sem cotação
 * agora' — nunca inventa um preço.
 */
export async function velas(simbolo: string, de: string, ate?: string): Promise<Vela[] | null> {
  try {
    const r = await fetch(`/api/precos?s=${encodeURIComponent(simbolo)}&de=${de}${ate ? `&ate=${ate}` : ''}`);
    if (!r.ok || !r.headers.get('content-type')?.includes('json')) return null;
    const j = (await r.json()) as Resposta;
    const todas = j.fonte === 'yahoo' ? velasDoYahoo(j.dados) : velasDoStooq(j.dados, j.cripto);
    const v = todas.filter((x) => x.dia >= de && (!ate || x.dia <= ate));
    return v.length ? v : null;
  } catch {
    return null;
  }
}
