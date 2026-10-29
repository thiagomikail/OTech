import type { Vela } from './desfecho';
import { aberturaDaBolsa } from './relogio';

/**
 * As respostas do Yahoo e do Stooq, viradas em pregões. Puro — quem busca é
 * `api/precos.ts`, na Vercel; o teste (`tests/mercado/desfecho.test.ts`) passa
 * respostas montadas à mão.
 */

export type RespostaYahoo = {
  chart?: {
    result?: {
      meta?: { gmtoffset?: number };
      timestamp?: number[];
      indicators?: { quote?: { open?: (number | null)[]; high?: (number | null)[]; low?: (number | null)[]; close?: (number | null)[] }[] };
    }[];
  };
};

/**
 * O `timestamp` do Yahoo costuma ser a abertura do pregão; o dia é o da bolsa,
 * pelo `gmtoffset` dela. Em bolsa (offset diferente de zero), o início nunca
 * fica antes das 9h30: se o Yahoo carimbar a meia-noite, uma edição publicada
 * às 6h45 de segunda empurraria a entrada pra terça. Cripto (offset zero) vira
 * o dia à meia-noite UTC, e aí vale o carimbo.
 */
export function velasDoYahoo(json: RespostaYahoo): Vela[] {
  const r = json.chart?.result?.[0];
  const q = r?.indicators?.quote?.[0];
  if (!r?.timestamp || !q) return [];
  const desvio = r.meta?.gmtoffset ?? 0;
  const velas: Vela[] = [];
  r.timestamp.forEach((t, i) => {
    const [abertura, maxima, minima, fechamento] = [q.open?.[i], q.high?.[i], q.low?.[i], q.close?.[i]];
    // Pregão sem negócio (feriado parcial, dado faltando) vem com null: pula.
    if (abertura == null || maxima == null || minima == null || fechamento == null) return;
    const dia = new Date((t + desvio) * 1000).toISOString().slice(0, 10);
    velas.push({
      inicio: desvio === 0 ? t * 1000 : Math.max(t * 1000, aberturaDaBolsa(dia)),
      dia,
      abertura,
      maxima,
      minima,
      fechamento,
    });
  });
  return velas;
}

/** CSV diário do Stooq ('Date,Open,High,Low,Close,Volume'). Não diz a hora: bolsa abre 9h30 de NY, cripto vira em UTC. */
export function velasDoStooq(csv: string, cripto: boolean): Vela[] {
  return csv
    .trim()
    .split('\n')
    .slice(1)
    .map((l) => l.split(','))
    .filter((c) => /^\d{4}-\d{2}-\d{2}$/.test(c[0]) && c.slice(1, 5).every((n) => Number.isFinite(Number(n))))
    .map(([dia, a, h, l, c]) => ({
      inicio: cripto ? Date.parse(`${dia}T00:00:00Z`) : aberturaDaBolsa(dia),
      dia,
      abertura: Number(a),
      maxima: Number(h),
      minima: Number(l),
      fechamento: Number(c),
    }));
}
