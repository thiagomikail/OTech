import type { ReactNode } from 'react';

/** Um painel do tema: contorno de 1 px e a faixa cinza com o título. */
export default function Painel({
  titulo,
  extra,
  children,
  className = '',
  id,
}: {
  titulo: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={`rounded-sm border border-line bg-surface ${className}`} aria-labelledby={id}>
      <div className="flex min-h-9 items-center gap-2 border-b border-line bg-strip px-3 py-1.5">
        <h2 id={id} className="text-[12px] font-bold uppercase tracking-[0.08em]">
          {titulo}
        </h2>
        {extra && <span className="ml-auto font-mono text-[11px] text-ink-3">{extra}</span>}
      </div>
      {children}
    </section>
  );
}
