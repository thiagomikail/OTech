/**
 * Cotação diária pro /mercado/, servida pela Vercel. O navegador não pode
 * chamar o Yahoo direto (CORS), então esta função busca e devolve a resposta
 * crua — quem vira em pregões é `src/mercado/yahoo.ts`, no navegador.
 *
 *   GET /api/precos?s=MSFT&de=2026-11-02&ate=2026-11-27
 *
 * Yahoo primeiro, Stooq de reserva. Só esses dois, só símbolo validado: não é
 * um proxy aberto. A CDN da Vercel guarda a resposta 15 minutos.
 */

const SIMBOLO = /^[A-Z0-9^=.-]{1,12}$/;
const DIA = /^\d{4}-\d{2}-\d{2}$/;
const UM_DIA = 86_400_000;
const NAVEGADOR = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Safari/605.1.15';
const CACHE = { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' };

/** Ação e ETF americanos, o S&P e o bitcoin. O resto fica só no Yahoo. */
function simboloStooq(simbolo: string) {
  if (simbolo === 'BTC-USD') return { s: 'btcusd', cripto: true };
  if (simbolo === '^GSPC') return { s: '^spx', cripto: false };
  if (/^[A-Z]{1,5}$/.test(simbolo)) return { s: `${simbolo.toLowerCase()}.us`, cripto: false };
  return null;
}

const diaStooq = (ms: number) => new Date(ms).toISOString().slice(0, 10).replace(/-/g, '');

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const simbolo = q.get('s') ?? '';
  const de = q.get('de') ?? '';
  const ate = q.get('ate');
  if (!SIMBOLO.test(simbolo) || !DIA.test(de) || (ate !== null && !DIA.test(ate))) {
    return Response.json({ erro: 'parâmetros: s=SÍMBOLO&de=AAAA-MM-DD[&ate=AAAA-MM-DD]' }, { status: 400 });
  }

  const inicio = Date.parse(`${de}T00:00:00Z`) - UM_DIA;
  const fim = Math.min(ate ? Date.parse(`${ate}T00:00:00Z`) + 2 * UM_DIA : Infinity, Date.now());
  if (fim <= inicio) return Response.json({ erro: 'janela ainda não começou' }, { status: 404, headers: CACHE });

  try {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(simbolo)}` +
      `?period1=${Math.floor(inicio / 1000)}&period2=${Math.floor(fim / 1000)}&interval=1d&includePrePost=false`;
    const r = await fetch(url, { headers: { 'User-Agent': NAVEGADOR }, signal: AbortSignal.timeout(5000) });
    if (r.ok) return Response.json({ fonte: 'yahoo', dados: await r.json() }, { headers: CACHE });
  } catch {
    // cai pro Stooq
  }

  const alvo = simboloStooq(simbolo);
  if (alvo) {
    try {
      const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(alvo.s)}&d1=${diaStooq(inicio)}&d2=${diaStooq(fim)}&i=d`;
      const r = await fetch(url, { headers: { 'User-Agent': NAVEGADOR }, signal: AbortSignal.timeout(5000) });
      const csv = r.ok ? await r.text() : '';
      if (csv.startsWith('Date,')) return Response.json({ fonte: 'stooq', dados: csv, cripto: alvo.cripto }, { headers: CACHE });
    } catch {
      // sem provedor
    }
  }

  return Response.json({ erro: 'sem cotação agora' }, { status: 502 });
}
