import { ExternalLink } from 'lucide-react';
import { diaComSemana, diaCurto } from '../formato';
import type { Aposta, Compromisso, Edicao, Projeto } from '../tipos';

const link = 'inline-flex items-center gap-0.5 text-accent underline decoration-dotted underline-offset-2 hover:text-accent-hover';

/** Peso em três traços: 3 mexe com tudo, 1 vale saber. */
function Peso({ n }: { n: number }) {
  return (
    <span className="mt-1.5 inline-flex shrink-0 items-end gap-0.5" aria-label={`Peso ${n} de 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`w-1 ${i <= n ? 'bg-orange' : 'bg-fill-strong'}`} style={{ height: 4 + i * 3 }} />
      ))}
    </span>
  );
}

/** A semana em dias. O que já passou fica apagado; hoje ganha a cor de seleção. */
export function Agenda({ itens, hoje }: { itens: Compromisso[]; hoje: string }) {
  const dias = [...new Set(itens.map((c) => c.dia))].sort();
  return (
    <ol className="divide-y divide-line">
      {dias.map((dia) => (
        <li key={dia} className={`grid grid-cols-[4.75rem_1fr] gap-3 p-3.5 ${dia < hoje ? 'opacity-50' : ''}`}>
          <p className={`pt-0.5 font-mono text-[11px] uppercase tracking-[0.04em] ${dia === hoje ? 'font-bold text-accent' : 'text-ink-3'}`}>
            {diaComSemana(dia)}
          </p>
          <ul className="space-y-3">
            {itens
              .filter((c) => c.dia === dia)
              .map((c, i) => (
                <li key={i} className="flex gap-2.5">
                  <Peso n={c.peso} />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold leading-snug">
                      {c.oque}
                      {c.hora && <span className="font-mono font-normal text-ink-3"> · {c.hora}</span>}
                    </p>
                    <p className="text-[14px] leading-snug text-ink-2">{c.porque}</p>
                  </div>
                </li>
              ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/** O que os mercados de previsão dizem: barra com o número escrito e uma marca de onde estava antes. */
export function Apostas({ itens }: { itens: Aposta[] }) {
  return (
    <ul className="divide-y divide-line">
      {itens.map((a) => (
        <li key={a.pergunta} className="p-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[14px] font-semibold leading-snug">{a.pergunta}</p>
            <p className="shrink-0 font-mono text-[18px] font-medium">{Math.round(a.prob * 100)}%</p>
          </div>
          <div
            className="relative mt-2 h-1.5 bg-fill-strong"
            role="img"
            aria-label={`${Math.round(a.prob * 100)}%${a.antes ? `, antes ${Math.round(a.antes.prob * 100)}% (${a.antes.quando})` : ''}`}
          >
            <div className="h-full bg-accent" style={{ width: `${a.prob * 100}%` }} />
            {a.antes && <div className="absolute -top-1 h-3.5 w-0.5 -translate-x-1/2 bg-ink" style={{ left: `${a.antes.prob * 100}%` }} />}
          </div>
          <p className="mt-2 text-[14px] leading-snug text-ink-2">
            {a.antes && (
              <span className="text-ink">
                Antes <span className="font-mono">{Math.round(a.antes.prob * 100)}%</span> ({a.antes.quando}).{' '}
              </span>
            )}
            {a.leitura} <span className="font-mono text-[11px] uppercase text-ink-3">{a.casa}</span>
            {a.fonte.nome !== a.casa && ' via'}{' '}
            <a href={a.fonte.url} target="_blank" rel="noreferrer" className={link}>
              {a.fonte.nome}
              <ExternalLink size={11} aria-hidden />
            </a>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function Congresso({ itens }: { itens: Projeto[] }) {
  return (
    <ul className="divide-y divide-line">
      {itens.map((p) => (
        <li key={p.nome} className="p-3.5">
          <p className="flex flex-wrap items-baseline gap-x-2 text-[14px] font-semibold leading-snug">
            {p.nome}
            {p.quando && <span className="font-mono text-[11px] uppercase text-ink-3">{diaCurto(p.quando)}</span>}
          </p>
          <p className="mt-1 text-[14px] leading-snug">{p.situacao}</p>
          <p className="mt-1 text-[14px] leading-snug text-ink-2">
            <span className="mr-1.5 font-mono text-[11px] uppercase text-ink-3">Mexe com</span>
            {p.afeta}
            {p.fonte && (
              <a href={p.fonte.url} target="_blank" rel="noreferrer" className={`ml-1.5 ${link}`}>
                {p.fonte.nome}
                <ExternalLink size={11} aria-hidden />
              </a>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function Evitar({ itens }: { itens: Edicao['evitar'] }) {
  return (
    <ul className="divide-y divide-line">
      {itens.map((e) => (
        <li key={e.ativo} className="grid grid-cols-[4.75rem_1fr] gap-3 p-3.5">
          <p className="font-mono font-medium text-ink-3 line-through decoration-red decoration-2">{e.ativo}</p>
          <p className="text-[14px] leading-snug">{e.porque}</p>
        </li>
      ))}
    </ul>
  );
}
