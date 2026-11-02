import { CircleCheck, CircleMinus, CircleX, Clock } from 'lucide-react';
import { diaComSemana } from '../formato';
import { horaNaBolsa } from '../relogio';
import { ETAPAS, type Rodada, type SinalDaRodada } from '../tipos';

export type Conferencia = { nome: string; estado: 'ok' | 'falhou' | 'buscando'; texto: string };

const ICONE = { ok: CircleCheck, falhou: CircleX, pulou: CircleMinus } as const;
const COR = { ok: 'text-green-ink', falhou: 'text-red-ink', pulou: 'text-ink-3' } as const;

function Manchete({ sinal }: { sinal: SinalDaRodada }) {
  if (sinal.tipo === 'ok')
    return (
      <>
        <CircleCheck size={18} aria-hidden className="shrink-0 text-green-ink" />
        <span>
          <strong>Rodada de {diaComSemana(sinal.rodada.semana)} rodou</strong> às {horaNaBolsa(sinal.rodada.em)} — tudo certo.
        </span>
      </>
    );
  if (sinal.tipo === 'falhou') {
    const falha = sinal.rodada.etapas.find((e) => e.estado === 'falhou');
    return (
      <>
        <CircleX size={18} aria-hidden className="shrink-0 text-red-ink" />
        <span>
          <strong>Rodada de {diaComSemana(sinal.rodada.semana)} falhou</strong> às {horaNaBolsa(sinal.rodada.em)}
          {falha ? ` — ${ETAPAS[falha.etapa].toLowerCase()}.` : '.'}
        </span>
      </>
    );
  }
  if (sinal.tipo === 'esperando')
    return (
      <>
        <Clock size={18} aria-hidden className="shrink-0 text-ink-3" />
        <span>
          <strong>A rodada de hoje começa às 6h40</strong> de Nova York e aparece aqui quando terminar.
        </span>
      </>
    );
  return (
    <>
      <CircleX size={18} aria-hidden className="shrink-0 text-red-ink" />
      <span>
        <strong>A rodada de {diaComSemana(sinal.semana)} não deu sinal.</strong> Era às 6h40 e nada chegou ao site até a abertura da bolsa.
      </span>
    </>
  );
}

/**
 * O que rodou: a rodada de segunda desta semana (`edicoes/rodadas.ts`, escrito
 * pela própria sessão) e as conferências de agora. Símbolo e texto sempre
 * juntos: a cor nunca diz sozinha.
 */
export default function EstadoDaRodada({ sinal, conferencias, historico }: { sinal: SinalDaRodada | null; conferencias: Conferencia[]; historico: Rodada[] }) {
  const alerta = sinal?.tipo === 'falhou' || sinal?.tipo === 'sem-sinal' || conferencias.some((c) => c.estado === 'falhou');
  return (
    <section aria-label="O que rodou" data-testid="rodada" className={`mt-5 rounded-sm border bg-surface ${alerta ? 'border-red-ink/60' : 'border-line'}`}>
      {sinal && (
        <p className="flex items-start gap-2 px-3 pt-3 text-[14px] leading-snug">
          <Manchete sinal={sinal} />
        </p>
      )}
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 px-3 py-3 text-[12px]">
        {conferencias.map((c) => (
          <li key={c.nome} className="inline-flex items-center gap-1.5">
            {c.estado === 'ok' ? (
              <CircleCheck size={14} aria-hidden className="text-green-ink" />
            ) : c.estado === 'falhou' ? (
              <CircleX size={14} aria-hidden className="text-red-ink" />
            ) : (
              <Clock size={14} aria-hidden className="text-ink-3" />
            )}
            <span className="font-semibold">{c.nome}</span>
            <span className="text-ink-3">{c.texto}</span>
          </li>
        ))}
      </ul>
      {(sinal || historico.length > 0) && (
        <details className="group border-t border-line px-3">
          <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between text-[12px] font-semibold uppercase tracking-[0.04em] text-ink-2">
            O que rodou, etapa por etapa
            <span aria-hidden className="font-mono text-[16px] transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="space-y-4 pb-3.5">
            {sinal && (sinal.tipo === 'ok' || sinal.tipo === 'falhou') ? (
              <div>
                <p className="mb-2 text-[14px] leading-relaxed">{sinal.rodada.resumo}</p>
                <ul className="space-y-1.5">
                  {sinal.rodada.etapas.map((e) => {
                    const Icone = ICONE[e.estado];
                    return (
                      <li key={e.etapa} className="flex gap-2 text-[14px]">
                        <Icone size={16} aria-hidden className={`mt-0.5 shrink-0 ${COR[e.estado]}`} />
                        <span>
                          <span className="font-semibold">{ETAPAS[e.etapa]}</span>
                          <span className="sr-only"> — {e.estado}</span>
                          {e.nota && <span className="text-ink-2"> · {e.nota}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : sinal ? (
              <p className="text-[14px] leading-relaxed text-ink-2">
                Nenhum registro da rodada de {diaComSemana(sinal.semana)}. Ou a sessão não rodou, ou não conseguiu gravar, ou o site não publicou — e a
                edição na tela continua a anterior.
              </p>
            ) : null}
            {historico.length > 0 && (
              <div>
                <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">Rodadas anteriores</p>
                <ul className="space-y-1 text-[12px]">
                  {historico.map((r) => (
                    <li key={r.em} className="flex gap-2">
                      {r.resultado === 'ok' ? (
                        <CircleCheck size={14} aria-hidden className="mt-px shrink-0 text-green-ink" />
                      ) : (
                        <CircleX size={14} aria-hidden className="mt-px shrink-0 text-red-ink" />
                      )}
                      <span>
                        <span className="font-mono">
                          {diaComSemana(r.semana)}, {horaNaBolsa(r.em)}
                        </span>{' '}
                        <span className="text-ink-2">— {r.resumo}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>
      )}
    </section>
  );
}
