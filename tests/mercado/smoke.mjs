/**
 * Mercado driven in a real Chrome, against the production build.
 *
 *   npm run test:mercado:e2e
 *
 * `vite preview` has no /api, so the browser's calls to /api/precos are
 * answered here: once with nothing (the page must say "sem cotação" and still
 * show the edition), once with the prices in tests/mercado/precos.json on
 * 20 Nov 2026, when one idea has hit its target, one its stop and one is open.
 * /api/perguntar is answered here too, as the function would.
 *
 * CHROME_PATH points at another Chrome (container, CI); without it, the Mac one.
 * SMOKE_OUT=<dir> also saves a screenshot per case.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

const PORT = 4182;
const BASE = `http://localhost:${PORT}`;
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = process.env.SMOKE_OUT;
if (OUT) mkdirSync(OUT, { recursive: true });
const PRECOS = JSON.parse(readFileSync(new URL('./precos.json', import.meta.url), 'utf8'));

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
process.on('exit', () => server.kill());
for (let i = 0; i < 50; i++) {
  try {
    if ((await fetch(`${BASE}/mercado/`)).ok) break;
  } catch {
    // not up yet
  }
  await new Promise((r) => setTimeout(r, 200));
}

const browser = await chromium.launch({ executablePath: CHROME });
let failures = 0;
const check = (name, ok, extra = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${extra ? ` — ${extra}` : ''}`);
  if (!ok) failures++;
};

/** The fixture as Yahoo would send it, the way api/precos.ts passes it through. */
function yahoo(simbolo) {
  const velas = PRECOS[simbolo];
  if (!velas) return null;
  return {
    fonte: 'yahoo',
    dados: {
      chart: {
        result: [
          {
            meta: { gmtoffset: -18000 },
            timestamp: velas.map((v) => v.inicio / 1000),
            indicators: {
              quote: [
                {
                  open: velas.map((v) => v.abertura),
                  high: velas.map((v) => v.maxima),
                  low: velas.map((v) => v.minima),
                  close: velas.map((v) => v.fechamento),
                },
              ],
            },
          },
        ],
      },
    },
  };
}

async function page({ viewport, scheme = 'light', now, prices }) {
  const ctx = await browser.newContext({ viewport, colorScheme: scheme, timezoneId: 'America/New_York' });
  if (now) await ctx.clock.setFixedTime(new Date(now));
  await ctx.route('**/api/precos*', (route) => {
    const s = new URL(route.request().url()).searchParams.get('s');
    const body = prices ? yahoo(s) : null;
    return body ? route.fulfill({ json: body }) : route.fulfill({ status: 502, json: { erro: 'sem cotação agora' } });
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => m.type() === 'error' && !m.text().includes('502') && errors.push(`[console] ${m.text()}`));
  return { ctx, p, errors };
}

const text = async (p, sel = 'body') => (await p.innerText(sel)).replace(/\s+/g, ' ');
const card = (p, ativo) => p.locator('[data-testid="ideia"]').filter({ has: p.locator('h3', { hasText: new RegExp(`^${ativo.replace('^', '\\^')}$`) }) });

// ── the home page links to it
{
  const { ctx, p } = await page({ viewport: { width: 1366, height: 900 } });
  await p.goto(`${BASE}/`);
  check('home: Mercado in the top bar', (await p.locator('header a[href="/mercado/"]').count()) === 1);
  check('home: Mercado card with its button', (await p.locator('[data-testid="home-mercado"]').count()) === 1);
  check('home: four apps', (await text(p, '#apps')).includes('4 apps'));
  if (OUT) await p.screenshot({ path: `${OUT}/home.png`, fullPage: true });
  await ctx.close();
}

// ── no prices: the edition still reads, and the page says what it doesn't know
{
  const { ctx, p, errors } = await page({ viewport: { width: 1366, height: 900 }, scheme: 'dark', now: '2026-10-29T15:00:00Z' });
  await p.goto(`${BASE}/mercado/`);
  await p.waitForFunction(() => !document.body.innerText.includes('Buscando cotação'), null, { timeout: 15000 });
  check('no prices: five ideas', (await p.locator('[data-testid="ideia"]').count()) === 5);
  const body = await text(p);
  check('no prices: the gauge says so', body.includes('sem cotação agora'));
  check('no prices: the ideas wait for Monday', body.includes('Entra na abertura do primeiro pregão a partir de seg 2 nov'));
  check('no prices: the record starts empty, on purpose', body.includes('Nenhuma ideia fechou ainda'));
  check('no prices: no errors', errors.length === 0, errors.join(' | '));
  if (OUT) await p.screenshot({ path: `${OUT}/sem-cotacao-dark.png`, fullPage: true });
  await ctx.close();
}

// ── 20 Nov 2026, with prices
for (const viewport of [
  { width: 1366, height: 900 },
  { width: 393, height: 852 },
]) {
  const tag = `${viewport.width}px`;
  const { ctx, p, errors } = await page({ viewport, now: '2026-11-20T21:30:00Z', prices: true });
  await p.goto(`${BASE}/mercado/`);
  await p.waitForFunction(() => !document.body.innerText.includes('Buscando cotação'), null, { timeout: 15000 });
  check(`${tag}: SMH hit its target on 4 Nov`, /Bateu o alvo em 4 nov · \+4,0%/.test(await text(p, '[data-testid="ideia"]:has(h3:text-is("SMH"))')));
  check(`${tag}: XLE stopped out on 9 Nov`, /Saiu no stop em 9 nov · −5,0%/.test(await text(p, '[data-testid="ideia"]:has(h3:text-is("XLE"))')));
  check(`${tag}: MSFT still open`, /Aberta · .*fechamento de 20 nov/.test(await text(p, '[data-testid="ideia"]:has(h3:text-is("MSFT"))')));
  check(`${tag}: the Fed bet waits for its resolution`, (await card(p, 'Kalshi').innerText()).includes('Aguardando o mercado resolver'));
  const body = await text(p);
  check(`${tag}: the record counts two closed, one up`, body.includes('1 de 2 fecharam no azul'));
  check(`${tag}: and warns the sample is small`, body.includes('Amostra pequena'));
  const width = await p.evaluate(() => document.documentElement.scrollWidth);
  check(`${tag}: no sideways scroll`, width <= viewport.width, `${width}px`);
  check(`${tag}: no errors`, errors.length === 0, errors.join(' | '));
  if (OUT) await p.screenshot({ path: `${OUT}/20nov-${tag}.png`, fullPage: true });
  await ctx.close();
}

// ── the help page: linked from the edition, searchable, deep-linkable
for (const viewport of [
  { width: 1366, height: 900 },
  { width: 393, height: 852 },
]) {
  const tag = `ajuda ${viewport.width}px`;
  const { ctx, p, errors } = await page({ viewport, now: '2026-10-29T15:00:00Z' });
  await p.goto(`${BASE}/mercado/`);
  await p.locator('main a[href="/mercado/ajuda/"]').first().click();
  await p.getByRole('heading', { name: 'Como funciona o Mercado' }).waitFor({ timeout: 15000 });
  check(`${tag}: the edition links to it`, true);
  check(`${tag}: all the questions`, (await p.locator('details').count()) > 40, String(await p.locator('details').count()));
  check(`${tag}: the public-page answer about bookings`, (await p.locator('#sem-reserva').count()) === 1);
  check(`${tag}: and not the home app's booking how-to`, (await p.locator('#como-reservar').count()) === 0);
  await p.getByPlaceholder(/Procurar/).fill('previsao');
  await p.waitForTimeout(300);
  const open = await p.locator('details[open] summary').allTextContents();
  check(`${tag}: search ignores accents`, open.some((t) => t.includes('mercado de previsão')), `${open.length} open`);
  const perguntas = [];
  await p.route('**/api/perguntar', (route) => {
    perguntas.push(JSON.parse(route.request().postData() ?? '{}').pergunta);
    return route.fulfill({ json: { texto: 'Sai na **abertura**, não no stop [1].', ids: ['ajuda:gap', 'ajuda:entrada'] } });
  });
  const caixa = p.getByTestId('perguntar');
  await caixa.getByLabel('Sua pergunta').fill('qual a capital da França?');
  await caixa.getByRole('button', { name: 'Perguntar' }).click();
  await caixa.getByTestId('resposta').waitFor({ timeout: 5000 });
  check(`${tag}: off-topic refused in the page`, (await caixa.getByTestId('resposta').innerText()).startsWith('Só respondo') && perguntas.length === 0);
  await caixa.getByLabel('Sua pergunta').fill('o que acontece se abrir abaixo do stop?');
  await caixa.getByRole('button', { name: 'Perguntar' }).click();
  await caixa.getByRole('link', { name: /abrir além do stop/ }).waitFor({ timeout: 5000 });
  const dita = await caixa.getByTestId('resposta').innerText();
  check(`${tag}: on-topic goes to the function and comes back with its source`, perguntas.length === 1 && dita.includes('Sai na abertura') && dita.includes('[1]') && !dita.includes('**'));
  check(`${tag}: only the cited excerpt is listed`, (await caixa.getByTestId('resposta').getByRole('link').count()) === 1);
  if (OUT) await caixa.screenshot({ path: `${OUT}/perguntar-${viewport.width}px.png` });
  await caixa.getByRole('link', { name: /abrir além do stop/ }).click();
  await p.waitForTimeout(500);
  check(`${tag}: the source opens its question`, await p.locator('#gap').evaluate((d) => d.open));
  await p.goto(`${BASE}/mercado/ajuda/#mesmo-dia`);
  await p.waitForTimeout(800);
  check(`${tag}: #mesmo-dia opens that question`, await p.locator('#mesmo-dia').evaluate((d) => d.open));
  const width = await p.evaluate(() => document.documentElement.scrollWidth);
  check(`${tag}: no sideways scroll`, width <= viewport.width, `${width}px`);
  check(`${tag}: no errors`, errors.length === 0, errors.join(' | '));
  if (OUT) await p.screenshot({ path: `${OUT}/ajuda-${viewport.width}px.png`, fullPage: viewport.width > 400 });
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} failure(s).` : '\nMercado renders, measures and admits what it does not know.');
process.exit(failures ? 1 : 0);
