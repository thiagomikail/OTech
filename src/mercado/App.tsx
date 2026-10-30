import { CircleHelp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Painel from './components/Painel';
import CartaoIdeia from './components/Ideia';
import Impostos from './components/Impostos';
import Registro from './components/Registro';
import Termometro, { type AoVivo } from './components/Termometro';
import Topo from './components/Topo';
import { Agenda, Apostas, Congresso, Evitar } from './components/Contexto';
import { desfecho, type Linha, resumo, retornoNoPeriodo, type Vela } from './desfecho';
import { EDICOES } from './edicoes';
import { diaCurto } from './formato';
import { velas } from './precos';
import { diasAtras, hojeNaBolsa } from './relogio';
import type { Ideia } from './tipos';

const POSTURA = { defensiva: 'defensiva', neutra: 'neutra', ofensiva: 'ofensiva' } as const;

type Janela = { de: string; ate: string };

/** Uma busca por ativo, da primeira semana ao último vencimento em que ele aparece (e o SPY, pra comparar). */
function janelas() {
  const mapa = new Map<string, Janela>();
  const somar = (ativo: string, j: Janela) => {
    const a = mapa.get(ativo);
    mapa.set(ativo, a ? { de: j.de < a.de ? j.de : a.de, ate: j.ate > a.ate ? j.ate : a.ate } : j);
  };
  for (const e of EDICOES)
    for (const i of e.ideias) {
      if (i.instrumento === 'previsao') continue;
      somar(i.ativo, { de: e.semana, ate: i.vence });
      somar('SPY', { de: e.semana, ate: i.vence });
    }
  return mapa;
}

/**
 * Mercado: a edição da semana, na ordem em que se lê na segunda de manhã —
 * manchete, termômetro, as ideias, o que evitar, o contexto (agenda,
 * previsões, Congresso) e o registro de todas as ideias já publicadas,
 * medidas pelas mesmas regras (`desfecho.ts`). Edição e regras vêm do Bancada,
 * onde a sessão de segunda escreve; aqui é a vitrine pública, sem reserva.
 */
export default function App() {
  const pedida = new URLSearchParams(window.location.search).get('semana');
  const edicao = EDICOES.find((e) => e.semana === pedida) ?? EDICOES[0];
  const hoje = hojeNaBolsa();

  const [cotacoes, setCotacoes] = useState<Map<string, Vela[] | null> | null>(null);
  const [aoVivo, setAoVivo] = useState<Map<string, AoVivo | null> | null>(null);

  useEffect(() => {
    const pedidos = [...janelas()];
    Promise.all(pedidos.map(async ([ativo, j]) => [ativo, await velas(ativo, j.de, j.ate)] as const)).then((pares) => setCotacoes(new Map(pares)));
  }, []);

  useEffect(() => {
    const de = diasAtras(40);
    Promise.all(
      edicao.termometro.map(async (t) => {
        const s = await velas(t.simbolo, de);
        if (!s || s.length < 2) return [t.simbolo, null] as const;
        const ult = s[s.length - 1];
        return [t.simbolo, { ultimo: ult.fechamento, vespera: s[s.length - 2].fechamento, dia: ult.dia, pontos: s.slice(-22).map((v) => v.fechamento) }] as const;
      }),
    ).then((pares) => setAoVivo(new Map(pares)));
  }, [edicao]);

  const linhas: Linha[] = useMemo(
    () =>
      EDICOES.flatMap((e) =>
        e.ideias.map((ideia: Ideia) => {
          const precos = ideia.instrumento === 'previsao' ? null : (cotacoes?.get(ideia.ativo) ?? null);
          const d = desfecho(ideia, e, precos, hoje);
          const spy = ideia.instrumento === 'previsao' ? null : retornoNoPeriodo(cotacoes?.get('SPY') ?? null, d.diaEntrada, d.diaSaida);
          return { ideia, semana: e.semana, desfecho: d, spy };
        }),
      ),
    [cotacoes, hoje],
  );
  const carregando = cotacoes === null;
  const daEdicao = linhas.filter((l) => l.semana === edicao.semana);
  const proximo = linhas.filter((l) => l.desfecho.estado !== 'fechada').map((l) => l.ideia.vence).sort()[0] ?? null;

  return (
    <>
      <Topo />

      <main className="mx-auto max-w-[1120px] px-4 pb-14 pt-8 sm:px-6">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-orange-ink">Mercado · semana de {diaCurto(edicao.semana)}</p>
        <h1 className="mt-3 max-w-[820px] text-[32px] font-bold leading-[1.05] sm:text-[44px]">{edicao.manchete}</h1>
        <p className="mt-4 max-w-[760px] text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">{edicao.leitura}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-semibold uppercase tracking-[0.04em]">
          <li className="rounded-sm bg-accent px-2 py-0.5 text-on-accent">Postura {POSTURA[edicao.postura]}</li>
          <li className="rounded-sm border border-line bg-raised px-2 py-0.5 text-ink-2">publicada {diaCurto(edicao.publicadaEm.slice(0, 10))}</li>
          <li className="rounded-sm border border-line bg-raised px-2 py-0.5 text-ink-2">no papel</li>
          <li>
            <a href="/mercado/ajuda/" className="inline-flex items-center gap-1 rounded-sm border border-accent-hover bg-raised px-2 py-0.5 text-accent hover:bg-fill">
              <CircleHelp size={12} aria-hidden /> Como funciona
            </a>
          </li>
        </ul>

        {EDICOES.length > 1 && (
          <nav aria-label="Edições" className="mt-5 flex flex-wrap gap-1.5">
            {EDICOES.map((e) => (
              <a
                key={e.semana}
                href={`/mercado/?semana=${e.semana}`}
                aria-current={e.semana === edicao.semana ? 'page' : undefined}
                className={`inline-flex h-9 items-center rounded-sm border px-3 font-mono text-[12px] ${
                  e.semana === edicao.semana ? 'border-accent-hover bg-accent text-on-accent' : 'border-line bg-surface text-ink-2 hover:bg-fill'
                }`}
              >
                {diaCurto(e.semana)}
              </a>
            ))}
          </nav>
        )}

        {edicao.adendos?.map((a) => (
          <p key={a.em} className="mt-5 border-l-2 border-accent bg-accent/10 px-3.5 py-2.5 text-[14px] leading-relaxed">
            <span className="mr-2 font-mono text-[11px] uppercase text-ink-3">adendo · {diaCurto(a.em.slice(0, 10))}</span>
            {a.texto}
          </p>
        ))}

        <Painel titulo="Termômetro" extra="Yahoo Finance, com atraso" className="mt-8" id="t-termometro">
          <Termometro itens={edicao.termometro} aoVivo={aoVivo} />
        </Painel>

        <div className="mb-4 mt-12 flex items-end justify-between border-b border-line pb-2">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-2">As ideias</h2>
          <span className="font-mono text-[12px] text-ink-3">
            {edicao.ideias.length} ideias · {edicao.ideias.reduce((s, i) => s + i.tamanho, 0)}% da carteira
          </span>
        </div>
        <p className="-mt-1 mb-4 text-[14px] text-ink-2">Entrada na abertura do primeiro pregão a partir de {diaCurto(edicao.semana)}. Alvo e stop contam dali.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {daEdicao.map((l) => (
            <CartaoIdeia key={l.ideia.id} ideia={l.ideia} d={l.desfecho} spy={l.spy} semana={l.semana} carregando={carregando} />
          ))}
        </div>

        {edicao.evitar.length > 0 && (
          <Painel titulo="O que eu evitaria" extra={`${edicao.evitar.length} ativos`} className="mt-8" id="t-evitar">
            <Evitar itens={edicao.evitar} />
          </Painel>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Painel titulo="Agenda" extra="hora de Nova York" id="t-agenda">
            <Agenda itens={edicao.agenda} hoje={hoje} />
          </Painel>
          <Painel titulo="O que as apostas dizem" extra="Polymarket · Kalshi" id="t-apostas">
            <Apostas itens={edicao.apostas} />
          </Painel>
        </div>

        <Painel titulo="No Congresso" className="mt-4" id="t-congresso">
          <Congresso itens={edicao.congresso} />
        </Painel>

        {edicao.revisao && (
          <Painel titulo="O que aprendi na semana passada" className="mt-4" id="t-revisao">
            <p className="p-3.5 text-[15px] leading-relaxed">{edicao.revisao}</p>
          </Painel>
        )}

        <Painel titulo="Registro de acertos" extra="todas as edições" className="mt-8" id="t-registro">
          <Registro r={resumo(linhas)} linhas={linhas} semanaAtual={edicao.semana} proximoVencimento={proximo} carregando={carregando} />
        </Painel>

        <div className="mt-4">
          <Impostos />
        </div>

        <p className="mt-8 max-w-[760px] text-[12px] leading-relaxed text-ink-3">
          Pesquisa e opinião, não recomendação personalizada de investimento. Mercado perde dinheiro, inclusive seguindo boas razões. Nada aqui
          executa ordem: toda decisão é de quem lê. Cotações do Yahoo Finance, com atraso.{' '}
          <a href="/mercado/ajuda/" className="text-accent underline decoration-dotted underline-offset-2 hover:text-accent-hover">
            Como funciona o Mercado
          </a>
          .
        </p>
      </main>
    </>
  );
}
