/**
 * O relógio da bolsa americana. Quem abre a página pode estar em qualquer
 * fuso; o pregão, o vencimento e o 'hoje' das ideias são os de Nova York.
 */
const FUSO = 'America/New_York';

const partes = new Intl.DateTimeFormat('en-US', {
  timeZone: FUSO,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

/** Minutos que Nova York está atrás (−) de UTC naquele instante: −240 no verão, −300 no inverno. */
function deslocamento(instante: Date) {
  const p = partes.formatToParts(instante);
  const n = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return (Date.UTC(n('year'), n('month') - 1, n('day'), n('hour'), n('minute')) - instante.getTime()) / 60_000;
}

/** 9h30 de Nova York naquele dia ('AAAA-MM-DD'), como instante (ms). */
export const aberturaDaBolsa = (dia: string) =>
  Date.parse(`${dia}T09:30:00Z`) - deslocamento(new Date(`${dia}T12:00:00Z`)) * 60_000;

/** O dia de hoje em Nova York, 'AAAA-MM-DD'. */
export const hojeNaBolsa = (agora = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit' }).format(agora);

/** Minutos desde a meia-noite em Nova York (pro prazo da rodada de segunda). */
export function minutoNaBolsa(agora = new Date()) {
  const p = partes.formatToParts(agora);
  const n = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return n('hour') * 60 + n('minute');
}

/** "6h52", no relógio de Nova York. */
export function horaNaBolsa(iso: string) {
  const m = minutoNaBolsa(new Date(iso));
  return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`;
}

/** 'AAAA-MM-DD' de n dias antes de hoje (pra janela do termômetro). */
export const diasAtras = (n: number, agora = new Date()) => hojeNaBolsa(new Date(agora.getTime() - n * 86_400_000));
