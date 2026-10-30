const FERRAMENTAS = [
  { href: '/petri/', nome: 'PetriPLC' },
  { href: '/fmea/', nome: 'FMEA' },
  { href: '/yield/', nome: 'Yield' },
  { href: '/mercado/', nome: 'Mercado' },
];

/** A barra escura do OT Workbench, com o Mercado marcado. Usada pela edição e pela ajuda. */
export default function Topo() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/40 bg-bar text-on-bar">
      <nav className="mx-auto flex h-11 max-w-[1120px] items-center justify-between px-4 sm:px-6" aria-label="Principal">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/workbench-icon.svg" alt="" className="h-6 w-6" />
          <span className="hidden text-[13px] font-bold uppercase tracking-[0.1em] sm:inline">OT Workbench</span>
        </a>
        <div className="flex items-center gap-0.5 text-[12px] font-semibold uppercase tracking-[0.06em]">
          {FERRAMENTAS.map((f) => (
            <a
              key={f.href}
              href={f.href}
              aria-current={f.href === '/mercado/' ? 'page' : undefined}
              className={`rounded-sm px-2 py-1.5 transition-colors hover:bg-bar-raised hover:text-on-bar sm:px-2.5 ${
                f.href === '/mercado/' ? 'bg-bar-raised text-on-bar' : 'text-on-bar-2'
              }`}
            >
              {f.nome}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
