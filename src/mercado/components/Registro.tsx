import { useState } from 'react';
import type { Linha, Resumo } from '../desfecho';
import { corDoRetorno, diaCurto, pct } from '../formato';
import { NOME_INSTRUMENTO } from '../tipos';
import { Situacao } from './Ideia';

/** Abaixo disto a taxa de acerto é ruído: sorte e acerto ainda não se separam. */
const AMOSTRA_MINIMA = 20;
const MOTIVO = { alvo: 'alvo', stop: 'stop', prazo: 'venceu', resolvida: 'resolveu' } as const;

function Bloco({ rotulo, valor, nota, cor = '' }: { rotulo: string; valor: string; nota?: string; cor?: string }) {
  return (
    <div className="bg-surface p-3.5">
      <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">{rotulo}</p>
      <p className={`mt-1 font-mono text-[24px] font-medium ${cor}`}>{valor}</p>
      {nota && <p className="mt-0.5 text-[12px] text-ink-2">{nota}</p>}
    </div>
  );
}

/** As ideias contra o mesmo dinheiro no SPY, ideia fechada a ideia fechada. Um eixo só. */
function Curva({ pontos }: { pontos: Resumo['curva'] }) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const serie = [{ dia: '', carteira: 0, spy: 0, ideia: 'início' }, ...pontos];
  const L = 600;
  const A = 200;
  const m = { e: 44, d: 64, c: 12, b: 24 };
  const vals = serie.flatMap((p) => [p.carteira, p.spy]);
  const min = Math.min(0, ...vals);
  const max = Math.max(0, ...vals);
  const folga = (max - min || 0.01) * 0.12;
  const X = (i: number) => m.e + (i / (serie.length - 1)) * (L - m.e - m.d);
  const Y = (v: number) => m.c + ((max + folga - v) / (max - min + 2 * folga)) * (A - m.c - m.b);
  const linha = (k: 'carteira' | 'spy') => serie.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p[k]).toFixed(1)}`).join(' ');
  const ult = serie[serie.length - 1];
  const sel = ativo === null ? null : serie[ativo];

  const mover = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * L;
    setAtivo(Math.max(0, Math.min(serie.length - 1, Math.round(((x - m.e) / (L - m.e - m.d)) * (serie.length - 1)))));
  };

  return (
    <figure className="p-3.5">
      <div className="mb-2 flex flex-wrap gap-4 text-[12px] text-ink-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-green" /> Ideias
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0 w-4 border-t-2 border-dashed border-ink-3" /> Mesmo dinheiro no SPY
        </span>
      </div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${L} ${A}`}
          className="w-full touch-none"
          role="img"
          aria-label={`Ideias ${pct(ult.carteira, 2)}, SPY ${pct(ult.spy, 2)}, em ${pontos.length} ideias fechadas`}
          onPointerMove={mover}
          onPointerDown={mover}
          onPointerLeave={() => setAtivo(null)}
        >
          <line x1={m.e} x2={L - m.d} y1={Y(0)} y2={Y(0)} className="stroke-line" />
          <path d={linha('spy')} fill="none" className="stroke-ink-3" strokeWidth={2} strokeDasharray="5 4" />
          <path d={linha('carteira')} fill="none" className="stroke-green" strokeWidth={2} strokeLinejoin="round" />
          <g className="font-mono" fontSize={11}>
            <text x={m.e - 6} y={Y(0) + 3} textAnchor="end" className="fill-ink-3">0%</text>
            <text x={L - m.d + 6} y={Y(ult.carteira) + 4} className="fill-ink">{pct(ult.carteira, 2)}</text>
            <text x={L - m.d + 6} y={Y(ult.spy) + 4} className="fill-ink-3">{pct(ult.spy, 2)}</text>
          </g>
          {sel && ativo !== null && (
            <>
              <line x1={X(ativo)} x2={X(ativo)} y1={m.c} y2={A - m.b} className="stroke-ink-3" />
              <circle cx={X(ativo)} cy={Y(sel.carteira)} r={5} className="fill-green stroke-surface" strokeWidth={2} />
              <circle cx={X(ativo)} cy={Y(sel.spy)} r={4} className="fill-ink-3 stroke-surface" strokeWidth={2} />
            </>
          )}
        </svg>
        {sel && (
          <div className="pointer-events-none absolute left-2 top-0 rounded-sm border border-line bg-raised px-2.5 py-1.5 text-[12px] shadow-pop">
            <p className="font-semibold">{sel.dia ? `${diaCurto(sel.dia)} · ${sel.ideia}` : 'Início'}</p>
            <p className="font-mono">
              Ideias {pct(sel.carteira, 2)} · SPY {pct(sel.spy, 2)}
            </p>
          </div>
        )}
      </div>
    </figure>
  );
}

/**
 * O registro de acertos: TODAS as ideias já publicadas, medidas pelas mesmas
 * regras. A taxa sozinha engana — acertar 70% ganhando pouco e perdendo muito
 * é perder — então ela vem com o retorno médio e o SPY no mesmo período.
 */
export default function Registro({
  r,
  linhas,
  semanaAtual,
  proximoVencimento,
  carregando,
}: {
  r: Resumo;
  linhas: Linha[];
  semanaAtual: string;
  proximoVencimento: string | null;
  carregando: boolean;
}) {
  const fechadas = linhas
    .filter((l) => l.desfecho.estado === 'fechada')
    .sort((a, b) => (b.desfecho.diaSaida ?? '').localeCompare(a.desfecho.diaSaida ?? ''));
  const pendentes = linhas.filter((l) => l.semana !== semanaAtual && l.desfecho.estado !== 'fechada');

  if (carregando) return <p className="p-3.5 text-[14px] text-ink-3">Buscando cotação pra medir as ideias…</p>;

  return (
    <div>
      {r.fechadas === 0 ? (
        <p className="p-3.5 text-[14px] text-ink-2">
          Nenhuma ideia fechou ainda{proximoVencimento ? ` — a primeira vence em ${diaCurto(proximoVencimento)}` : ''}. O registro começa vazio de
          propósito: só entra aqui o que já tem resultado medido.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-px border-b border-line bg-line sm:grid-cols-4">
            <Bloco rotulo="Acerto" valor={`${Math.round((r.acertos / r.fechadas) * 100)}%`} nota={`${r.acertos} de ${r.fechadas} fecharam no azul`} />
            <Bloco rotulo="Retorno médio" valor={pct(r.medio ?? 0)} nota="por ideia, no dinheiro dela" cor={corDoRetorno(r.medio)} />
            <Bloco rotulo="Carteira" valor={pct(r.carteira, 2)} nota={`SPY no mesmo período: ${pct(r.carteiraSpy, 2)}`} cor={corDoRetorno(r.carteira)} />
            <Bloco rotulo="Bateu o SPY" valor={`${r.bateuSpy} de ${r.comparaveis}`} nota="ideias com período comparável" />
          </div>
          {r.fechadas < AMOSTRA_MINIMA && (
            <p className="border-b border-line p-3.5 text-[14px] text-ink-2">
              Amostra pequena: com menos de {AMOSTRA_MINIMA} ideias fechadas, a taxa ainda é ruído. Vale olhar o retorno médio e a comparação com o SPY
              antes de confiar.
            </p>
          )}
          {r.curva.length >= 2 && <Curva pontos={r.curva} />}
          <div className="overflow-x-auto border-t border-line">
            <table className="w-full min-w-[34rem] text-[14px]">
              <thead className="bg-strip text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-2">
                <tr>
                  <th className="px-3 py-1.5">Saída</th>
                  <th className="px-3 py-1.5">Ideia</th>
                  <th className="px-3 py-1.5">Como</th>
                  <th className="px-3 py-1.5 text-right">Retorno</th>
                  <th className="px-3 py-1.5 text-right">SPY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {fechadas.map((l) => (
                  <tr key={l.ideia.id}>
                    <td className="px-3 py-2 font-mono text-ink-3">{diaCurto(l.desfecho.diaSaida!)}</td>
                    <td className="px-3 py-2">
                      <span className="font-mono font-medium">{l.ideia.instrumento === 'previsao' ? l.ideia.casa : l.ideia.ativo}</span>{' '}
                      <span className="text-ink-3">{NOME_INSTRUMENTO[l.ideia.instrumento]}</span>
                    </td>
                    <td className="px-3 py-2 text-ink-2">{MOTIVO[l.desfecho.motivo ?? 'prazo']}</td>
                    <td className={`px-3 py-2 text-right font-mono font-medium ${corDoRetorno(l.desfecho.retorno)}`}>{pct(l.desfecho.retorno ?? 0)}</td>
                    <td className="px-3 py-2 text-right font-mono text-ink-3">{l.spy === null ? '—' : pct(l.spy)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {pendentes.length > 0 && (
        <div className="border-t border-line">
          <p className="bg-strip px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-ink-2">Ainda abertas, de edições anteriores</p>
          <ul className="divide-y divide-line">
            {pendentes.map((l) => (
              <li key={l.ideia.id} className="p-3">
                <p className="text-[14px]">
                  <span className="font-mono font-medium">{l.ideia.instrumento === 'previsao' ? l.ideia.casa : l.ideia.ativo}</span> {l.ideia.titulo}{' '}
                  <span className="text-ink-3">· semana de {diaCurto(l.semana)}</span>
                </p>
                <Situacao ideia={l.ideia} d={l.desfecho} spy={l.spy} semana={l.semana} carregando={false} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
