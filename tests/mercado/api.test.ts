/**
 * The /api/precos function, with the network stubbed: it validates its input,
 * only ever calls Yahoo or Stooq, falls back in that order, and says so when
 * neither answers.
 *
 *   npm run test:mercado
 */
import { GET } from '../../api/precos';
import { aberturaDaBolsa } from '../../src/mercado/relogio';

let failures = 0;
const ok = (c: boolean, m: string) => {
  console.log(`${c ? '✓' : '✗'} ${m}`);
  if (!c) failures++;
};

const calls: string[] = [];
let answer: (url: string) => Response = () => new Response('', { status: 500 });
globalThis.fetch = (async (input: string | URL | Request) => {
  const url = String(input);
  calls.push(url);
  return answer(url);
}) as typeof fetch;

const get = (q: string) => GET(new Request(`https://otech.test/api/precos?${q}`));

// ── input
ok((await get('s=MSFT;rm&de=2026-11-02')).status === 400, 'rejects a symbol with odd characters');
ok((await get('s=MSFT&de=2-11-2026')).status === 400, 'rejects a malformed date');
ok((await get('s=https://evil.example&de=2026-11-02')).status === 400, 'is not an open proxy');
ok(calls.length === 0, 'and none of those reached the network');

// ── Yahoo first
answer = (url) => (url.includes('yahoo') ? Response.json({ chart: { result: [{ timestamp: [1] }] } }) : new Response('', { status: 500 }));
let r = await get('s=MSFT&de=2026-10-01&ate=2026-10-20');
let body = await r.json();
ok(r.status === 200 && body.fonte === 'yahoo', 'Yahoo answers: passes its JSON through');
ok(calls.at(-1)!.startsWith('https://query1.finance.yahoo.com/v8/finance/chart/MSFT?'), 'calls the Yahoo chart API');
ok(/s-maxage=900/.test(r.headers.get('cache-control') ?? ''), 'the CDN keeps it 15 minutes');

// ── Stooq when Yahoo refuses
answer = (url) => (url.includes('stooq') ? new Response('Date,Open,High,Low,Close,Volume\n2026-11-02,1,2,0.5,1.5,100\n') : new Response('', { status: 429 }));
r = await get('s=BTC-USD&de=2026-10-01');
body = await r.json();
ok(body.fonte === 'stooq' && body.cripto === true && calls.at(-1)!.includes('s=btcusd'), 'Yahoo refuses: Stooq, with the crypto flag');

// ── neither
answer = () => new Response('', { status: 503 });
ok((await get('s=^VIX&de=2026-10-01')).status === 502, 'no provider: 502, never an invented price');

// ── a window that hasn't started never reaches the network
const antes = calls.length;
ok((await get('s=MSFT&de=2099-01-05')).status === 404 && calls.length === antes, 'a future window answers 404 without calling anyone');

// ── the market clock
ok(aberturaDaBolsa('2026-10-30') === Date.parse('2026-10-30T13:30:00Z'), 'the open is 13:30 UTC in daylight time');
ok(aberturaDaBolsa('2026-11-02') === Date.parse('2026-11-02T14:30:00Z'), '…and 14:30 UTC after the clocks change on 1 Nov');

console.log(failures ? `\n${failures} failure(s).` : '\nThe price function behaves.');
process.exit(failures ? 1 : 0);
