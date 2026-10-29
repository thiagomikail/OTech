import { corDoRetorno, diaCurto, juro, numero, pct } from '../formato';
import type { Leitura } from '../tipos';

export type AoVivo = { ultimo: number; vespera: number; dia: string; pontos: number[] };

const valorDe = (t: Leitura, v: number) => {
  const n = juro(t.simbolo, v);
  if (t.unidade === '%') return `${numero(n, 2)}%`;
  if (t.unidade === 'US$') return `US$ ${numero(n, n >= 1000 ? 0 : 2)}`;
  return numero(n, n >= 1000 ? 0 : 2);
};

/** Um mês de fechamentos, num traço. Sem eixo: é o formato, não o número. */
function Linha({ pontos }: { pontos: number[] }) {
  const min = Math.min(...pontos);
  const max = Math.max(...pontos);
  const L = 120;
  const A = 28;
  const y = (v: number) => (max === min ? A / 2 : A - 2 - ((v - min) / (max - min)) * (A - 4));
  const d = pontos.map((v, i) => `${i ? 'L' : 'M'}${((i / (pontos.length - 1)) * L).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const subiu = pontos[pontos.length - 1] >= pontos[0];
  return (
    <svg viewBox={`0 0 ${L} ${A}`} preserveAspectRatio="none" className="mt-2 h-7 w-full" aria-hidden>
      <path d={d} fill="none" strokeWidth={2} vectorEffect="non-scaling-stroke" className={subiu ? 'stroke-green' : 'stroke-red'} strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Os números da semana: a cotação de agora (quando o provedor responde) e a
 * frase da edição sobre por que aquele número importa. Sem cotação, fica o
 * retrato da publicação — e a tela diz que é isso.
 */
export default function Termometro({ itens, aoVivo }: { itens: Leitura[]; aoVivo: Map<string, AoVivo | null> | null }) {
  return (
    <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
      {itens.map((t) => {
        const v = aoVivo?.get(t.simbolo) ?? null;
        const dia = v ? (v.ultimo - v.vespera) / v.vespera : null;
        return (
          <li key={t.simbolo} className="flex flex-col bg-surface p-3.5" data-testid="termometro-item">
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">{t.nome}</p>
            {v ? (
              <>
                <p className="mt-1 font-mono text-[20px] font-medium">{valorDe(t, v.ultimo)}</p>
                <p className={`font-mono text-[12px] ${corDoRetorno(dia)}`}>
                  {pct(dia ?? 0, 2)} <span className="text-ink-3">em {diaCurto(v.dia)}</span>
                </p>
                <Linha pontos={v.pontos} />
              </>
            ) : t.valor !== undefined ? (
              <>
                <p className="mt-1 font-mono text-[20px] font-medium">{valorDe(t, t.valor)}</p>
                <p className="text-[12px] text-ink-3">{aoVivo ? 'na edição · sem cotação agora' : 'na edição · buscando cotação…'}</p>
              </>
            ) : (
              <p className="mt-1 text-[14px] text-ink-3">{aoVivo ? 'sem cotação agora' : 'buscando cotação…'}</p>
            )}
            <p className="mt-2 text-[12px] leading-snug text-ink-2">{t.leitura}</p>
          </li>
        );
      })}
    </ul>
  );
}
