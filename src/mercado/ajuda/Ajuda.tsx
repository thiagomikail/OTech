import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link2, Search } from 'lucide-react';
import { type Bloco, GLOSSARIO, ajudaDe } from '../ajuda';
import Topo from '../components/Topo';
import Perguntar from './Perguntar';

/** `**negrito**`, `[texto](https://…)`, `[texto](#pergunta)` e `` `código` `` — a marcação de `src/mercado/ajuda.ts`. */
export function Texto({ s }: { s: string }) {
  const partes = s.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g);
  return (
    <>
      {partes.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="font-semibold text-ink">{p.slice(2, -2)}</strong>;
        if (p.length > 2 && p.startsWith('`') && p.endsWith('`'))
          return (
            <code key={i} className="rounded-sm bg-fill px-1 py-0.5 font-mono text-[0.88em] text-ink">
              {p.slice(1, -1)}
            </code>
          );
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const fora = !link[2].startsWith('#');
          return (
            <a
              key={i}
              href={link[2]}
              {...(fora ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="text-accent underline decoration-dotted underline-offset-2 hover:text-accent-hover"
            >
              {link[1]}
            </a>
          );
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

/** Passos em ordem, em caixas numeradas: uma coluna no celular, uma grade na tela larga. */
function Fluxo({ passos }: { passos: { titulo: string; texto: string }[] }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {passos.map((p, i) => (
        <li key={i} className="rounded-sm border border-line bg-canvas p-3">
          <p className="flex items-baseline gap-2">
            <span className="font-mono text-[12px] font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
            <span className="font-semibold text-ink">{p.titulo}</span>
          </p>
          <p className="mt-1 text-[14px] leading-snug">
            <Texto s={p.texto} />
          </p>
        </li>
      ))}
    </ol>
  );
}

function Resposta({ blocos }: { blocos: Bloco[] }) {
  return (
    <div className="space-y-3 pb-4 text-[15px] leading-relaxed text-ink-2">
      {blocos.map((b, i) =>
        typeof b === 'string' ? (
          <p key={i}>
            <Texto s={b} />
          </p>
        ) : 'fluxo' in b ? (
          <Fluxo key={i} passos={b.fluxo} />
        ) : (
          <ul key={i} className="ml-1 space-y-1.5">
            {b.lista.map((item, j) => (
              <li key={j} className="flex gap-2">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                <span>
                  <Texto s={item} />
                </span>
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}

/** Sem acento e em minúscula: "previsao" acha "previsão". */
const plano = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const SECOES = ajudaDe('otech');
const textoDe = (blocos: Bloco[]) =>
  blocos.map((b) => (typeof b === 'string' ? b : 'lista' in b ? b.lista.join(' ') : b.fluxo.map((p) => `${p.titulo} ${p.texto}`).join(' '))).join(' ');

/**
 * Como funciona o Mercado: o help/FAQ. O conteúdo é `src/mercado/ajuda.ts`,
 * cópia idêntica do Bancada; aqui entram as perguntas da vitrine (sem
 * reserva). Cada pergunta é um <details> com id: `#entrada` na URL abre e
 * rola até ela, inclusive quando o link vem de dentro de outra resposta.
 */
export default function Ajuda() {
  const secoes = SECOES;
  const [busca, setBusca] = useState('');
  const [abertas, setAbertas] = useState<Set<string>>(new Set());

  useEffect(() => {
    const abrirDoHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      setBusca('');
      setAbertas((a) => new Set(a).add(id));
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    };
    abrirDoHash();
    window.addEventListener('hashchange', abrirDoHash);
    return () => window.removeEventListener('hashchange', abrirDoHash);
  }, []);

  const termo = plano(busca.trim());
  const filtradas = useMemo(
    () =>
      secoes
        .map((s) => ({ ...s, perguntas: termo ? s.perguntas.filter((p) => plano(`${p.pergunta} ${textoDe(p.resposta)}`).includes(termo)) : s.perguntas }))
        .filter((s) => s.perguntas.length > 0),
    [secoes, termo],
  );
  const total = secoes.reduce((n, s) => n + s.perguntas.length, 0);
  const achadas = filtradas.reduce((n, s) => n + s.perguntas.length, 0);
  const todasAbertas = abertas.size >= total;

  const alternar = (id: string, aberta: boolean) =>
    setAbertas((a) => {
      const n = new Set(a);
      if (aberta) n.add(id);
      else n.delete(id);
      return n;
    });

  const chip = 'inline-flex h-9 items-center rounded-sm border border-line bg-surface px-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-ink-2 hover:bg-fill';

  return (
    <>
      <Topo />
      <main className="mx-auto max-w-[880px] px-4 pb-14 pt-8 sm:px-6">
        <a href="/mercado/" className="font-mono text-[12px] uppercase tracking-[0.2em] text-orange-ink hover:underline">
          ← Mercado
        </a>
        <h1 className="mt-3 text-[32px] font-bold leading-[1.05] sm:text-[44px]">Como funciona o Mercado</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">
          Tudo o que a página faz e por quê: de onde vêm as ideias, como ler cada cartão, as regras que medem o acerto, as cotações, os
          riscos e o imposto. As respostas descrevem as regras que o código aplica — se a regra mudar, a resposta muda junto.
        </p>

        <Perguntar />

        <div className="sticky top-11 z-40 -mx-4 mt-6 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <label className="relative block">
            <span className="sr-only">Procurar uma pergunta</span>
            <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Procurar: stop, trava, imposto, previsão…"
              className="h-11 w-full rounded-sm border border-line bg-field pl-9 pr-3 text-[16px] text-ink outline-none focus:border-accent"
            />
          </label>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="font-mono text-[12px] text-ink-3">{termo ? `${achadas} de ${total} perguntas` : `${total} perguntas`}</span>
            <button
              type="button"
              onClick={() => setAbertas(todasAbertas ? new Set() : new Set(secoes.flatMap((s) => s.perguntas.map((p) => p.id))))}
              className="h-8 rounded-sm border border-line bg-surface px-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-ink-2 hover:bg-fill"
            >
              {todasAbertas ? 'Fechar tudo' : 'Abrir tudo'}
            </button>
          </div>
        </div>

        {!termo && (
          <nav aria-label="Seções" className="mt-6 flex flex-wrap gap-1.5">
            {secoes.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={chip}>
                {s.titulo}
              </a>
            ))}
            <a href="#glossario" className={chip}>
              Glossário
            </a>
          </nav>
        )}

        {filtradas.length === 0 && (
          <p className="mt-8 text-[15px] text-ink-2">
            Nenhuma pergunta fala de “{busca.trim()}”. Tente outra palavra, ou veja o{' '}
            <a href="#glossario" onClick={() => setBusca('')} className="text-accent underline">
              glossário
            </a>
            .
          </p>
        )}

        {filtradas.map((s) => (
          <section key={s.id} id={s.id} className="mt-8 scroll-mt-40 rounded-sm border border-line bg-surface" aria-labelledby={`t-${s.id}`}>
            <div className="border-b border-line bg-strip px-3 py-2">
              <h2 id={`t-${s.id}`} className="text-[13px] font-bold uppercase tracking-[0.08em]">
                {s.titulo}
              </h2>
              <p className="text-[13px] text-ink-2">{s.resumo}</p>
            </div>
            <div className="divide-y divide-line">
              {s.perguntas.map((p) => (
                <details
                  key={p.id}
                  id={p.id}
                  open={!!termo || abertas.has(p.id)}
                  onToggle={(e) => !termo && alternar(p.id, (e.currentTarget as HTMLDetailsElement).open)}
                  className="group scroll-mt-40 px-4"
                >
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-[16px] font-semibold leading-snug">
                    <span>{p.pergunta}</span>
                    <span aria-hidden className="shrink-0 font-mono text-[18px] text-ink-3 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <Resposta blocos={p.resposta} />
                  <a href={`#${p.id}`} className="mb-3 inline-flex items-center gap-1 font-mono text-[11px] text-ink-3 hover:text-ink">
                    <Link2 size={12} aria-hidden /> link desta pergunta
                  </a>
                </details>
              ))}
            </div>
          </section>
        ))}

        {!termo && (
          <section id="glossario" className="mt-8 scroll-mt-40 rounded-sm border border-line bg-surface" aria-labelledby="t-glossario">
            <div className="border-b border-line bg-strip px-3 py-2">
              <h2 id="t-glossario" className="text-[13px] font-bold uppercase tracking-[0.08em]">
                Glossário
              </h2>
              <p className="text-[13px] text-ink-2">As palavras que aparecem nas edições, em uma linha cada.</p>
            </div>
            <dl className="divide-y divide-line">
              {GLOSSARIO.map((g) => (
                <div key={g.termo} className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                  <dt className="text-[15px] font-semibold">{g.termo}</dt>
                  <dd className="text-[14px] leading-relaxed text-ink-2">{g.definicao}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <p className="mt-8 text-[12px] leading-relaxed text-ink-3">
          Pesquisa e opinião, não recomendação personalizada. Não é conselho fiscal nem jurídico.
        </p>
      </main>
    </>
  );
}
