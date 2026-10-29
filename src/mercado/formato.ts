/** Número no jeito brasileiro, com casas fixas. */
export const numero = (n: number, casas = 2) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/** Fração → '+4,2%'. O sinal vai sempre: cor nunca é a única pista de ganho ou perda. */
export function pct(fracao: number, casas = 1) {
  const v = fracao * 100;
  const s = numero(Math.abs(v), casas);
  return `${v > 0.0000001 ? '+' : v < -0.0000001 ? '−' : ''}${s}%`;
}

/** Preço de ativo: duas casas até 1.000, nenhuma acima (bitcoin, S&P). */
export const preco = (n: number) => numero(n, Math.abs(n) >= 1000 ? 0 : 2);

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

/** '2 nov', de uma chave 'AAAA-MM-DD'. Datas sempre absolutas. */
export function diaCurto(chave: string) {
  const [, m, d] = chave.split('-').map(Number);
  return `${d} ${MESES[m - 1]}`;
}

/** 'seg 2 nov'. */
export const diaComSemana = (chave: string) => `${DIAS[new Date(`${chave}T12:00:00Z`).getUTCDay()]} ${diaCurto(chave)}`;

/** Ganho em verde, perda em vermelho, zero neutro — as cores de estado do tema. */
export const corDoRetorno = (r: number | null | undefined) =>
  typeof r !== 'number' || Math.abs(r) < 0.0005 ? 'text-ink-2' : r > 0 ? 'text-green-ink' : 'text-red-ink';

/** O Yahoo às vezes dá o juro de 10 anos multiplicado por 10. Acima de 20 não existe juro americano: divide. */
export const juro = (simbolo: string, v: number) => (simbolo === '^TNX' && v > 20 ? v / 10 : v);
