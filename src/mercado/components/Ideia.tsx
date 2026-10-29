import { ArrowDownRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import { type Desfecho, niveis, valorNoVencimento } from '../desfecho';
import { corDoRetorno, diaComSemana, diaCurto, pct, preco } from '../formato';
import { type Ideia, type IdeiaOpcao, type IdeiaPreco, type IdeiaPrevisao, NOME_BASE, NOME_INSTRUMENTO } from '../tipos';

const MOTIVO = { alvo: 'Bateu o alvo', stop: 'Saiu no stop', prazo: 'Venceu', resolvida: 'Resolveu' } as const;

/** Uma linha que diz em que pé a ideia está — com data, sempre. */
export function Situacao({ ideia, d, spy, semana, carregando }: { ideia: Ideia; d: Desfecho; spy: number | null; semana: string; carregando: boolean }) {
  if (ideia.instrumento === 'previsao') {
    if (d.estado !== 'fechada') return <p className="text-[14px] text-ink-2">Aguardando o mercado resolver ({diaCurto(ideia.vence)}).</p>;
    return (
      <p className="text-[14px]">
        {ideia.resolucao?.ganhou ? 'Ganhou' : 'Perdeu'} em {diaCurto(d.diaSaida!)} ·{' '}
        <span className={`font-mono font-medium ${corDoRetorno(d.retorno)}`}>{pct(d.retorno ?? 0, 0)}</span>
      </p>
    );
  }
  if (carregando) return <p className="text-[14px] text-ink-3">Buscando cotação…</p>;
  switch (d.estado) {
    case 'aguardando':
      return <p className="text-[14px] text-ink-2">Entra na abertura do primeiro pregão a partir de {diaComSemana(semana)}.</p>;
    case 'sem-dado':
      return <p className="text-[14px] text-ink-2">Sem cotação pra dizer como terminou.</p>;
    case 'aberta':
      return (
        <p className="text-[14px]">
          {ideia.instrumento === 'opcao' ? 'Se vencesse hoje' : 'Aberta'} ·{' '}
          <span className={`font-mono font-medium ${corDoRetorno(d.retorno)}`}>{pct(d.retorno ?? 0)}</span>
          <span className="text-ink-3">
            {' '}
            · fechamento de {diaCurto(d.diaSaida!)}
            {ideia.instrumento === 'opcao' ? ' · sem o valor de tempo' : ''}
          </span>
        </p>
      );
    case 'fechada':
      return (
        <p className="text-[14px]">
          {MOTIVO[d.motivo ?? 'prazo']} em {diaCurto(d.diaSaida!)} ·{' '}
          <span className={`font-mono font-medium ${corDoRetorno(d.retorno)}`}>{pct(d.retorno ?? 0)}</span>
          {spy !== null && <span className="text-ink-3"> · SPY {pct(spy)} no período</span>}
          {ideia.instrumento === 'opcao' && <span className="text-ink-3"> · custo estimado</span>}
        </p>
      );
  }
}

/**
 * A régua de uma ideia de preço: stop, entrada e alvo no eixo do preço, e onde
 * o preço está agora (ou onde saiu). Antes da entrada só existem os percentuais.
 */
function Faixa({ ideia, d }: { ideia: IdeiaPreco; d: Desfecho }) {
  const entrada = d.entrada;
  const base = entrada ?? 100;
  const { alvo, stop } = niveis(ideia, base);
  const agora = d.saida;
  const pontos = [alvo, stop, base, ...(agora !== undefined ? [agora] : [])];
  const min = Math.min(...pontos);
  const max = Math.max(...pontos);
  const folga = (max - min) * 0.08;
  const x = (v: number) => ((v - (min - folga)) / (max - min + 2 * folga)) * 100;
  const [esq, dir] = [Math.min(x(stop), x(alvo)), Math.max(x(stop), x(alvo))];
  const xe = x(base);
  const alta = ideia.direcao === 'alta';
  const ganho = agora !== undefined && (alta ? agora >= base : agora <= base);
  const sinal = alta ? 1 : -1;

  const rotulo = (nome: string, v: number, p: number) => (
    <span className="font-mono">
      <span className="text-ink-3">{nome}</span> {entrada ? preco(v) : ''}
      <span className="text-ink-3"> {pct(p / 100, 0)}</span>
    </span>
  );

  return (
    <figure className="mt-4" aria-label={`Stop ${pct((-sinal * ideia.stop) / 100, 0)}, alvo ${pct((sinal * ideia.alvo) / 100, 0)} a partir da entrada`}>
      <div className="relative h-8">
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 bg-red/45"
          style={alta ? { left: `${esq}%`, width: `${xe - esq}%` } : { left: `${xe}%`, width: `${dir - xe}%` }}
        />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 bg-green/45"
          style={alta ? { left: `${xe}%`, width: `${dir - xe}%` } : { left: `${esq}%`, width: `${xe - esq}%` }}
        />
        <div className="absolute top-1 h-6 w-0.5 -translate-x-1/2 bg-ink" style={{ left: `${xe}%` }} />
        {agora !== undefined && (
          <div
            className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface ${ganho ? 'bg-green' : 'bg-red'}`}
            style={{ left: `${x(agora)}%` }}
            title={`Agora: ${preco(agora)}`}
          />
        )}
      </div>
      <figcaption className="mt-1 flex justify-between gap-2 text-[12px]">
        {alta ? rotulo('stop', stop, -ideia.stop) : rotulo('alvo', alvo, -ideia.alvo)}
        <span className="text-center font-mono">{entrada ? preco(entrada) : 'abertura'}</span>
        {alta ? rotulo('alvo', alvo, ideia.alvo) : rotulo('stop', stop, ideia.stop)}
      </figcaption>
    </figure>
  );
}

/** A trava no vencimento: quanto rende pra cada variação do ativo. Perda máxima à esquerda, ganho máximo à direita. */
function Payoff({ ideia, d }: { ideia: IdeiaOpcao; d: Desfecho }) {
  const L = 300;
  const A = 110;
  const lado = ideia.direcao === 'alta' ? 1 : -1;
  const extremo = Math.max(8, ...ideia.strikes.map((k) => Math.abs(k) + 3));
  const xs = Array.from({ length: 61 }, (_, i) => -extremo + (i / 60) * 2 * extremo);
  const ret = (m: number) => valorNoVencimento(ideia, 100, 100 * (1 + m / 100)) / ideia.custo - 1;
  const rs = xs.map(ret);
  const rMax = Math.max(...rs, 0.5);
  const X = (m: number) => ((m + extremo) / (2 * extremo)) * L;
  const Y = (r: number) => 8 + ((rMax - r) / (rMax + 1)) * (A - 24);
  const caminho = xs.map((m, i) => `${i ? 'L' : 'M'}${X(m).toFixed(1)},${Y(rs[i]).toFixed(1)}`).join(' ');
  const empate = ideia.strikes[0] + lado * ideia.custo;
  const movimento = d.entrada && d.saida ? (d.saida / d.entrada - 1) * 100 : null;

  return (
    <figure className="mt-4">
      <svg viewBox={`0 0 ${L} ${A}`} className="w-full max-w-md" role="img" aria-label={`No vencimento: perde no máximo o débito; empata com o ativo ${pct(empate / 100)}; ganho máximo ${pct(rMax, 0)}`}>
        <line x1={0} x2={L} y1={Y(0)} y2={Y(0)} className="stroke-line" strokeWidth={1} />
        <line x1={X(0)} x2={X(0)} y1={14} y2={A - 16} className="stroke-line" strokeDasharray="2 3" />
        <path d={caminho} fill="none" className="stroke-green" strokeWidth={2} strokeLinejoin="round" />
        {movimento !== null && Math.abs(movimento) <= extremo && (
          <circle cx={X(movimento)} cy={Y(ret(movimento))} r={5} className="fill-ink stroke-surface" strokeWidth={2} />
        )}
        <g className="fill-ink-3 font-mono" fontSize={10}>
          <text x={4} y={Y(-1) - 6}>−100%</text>
          <text x={L - 4} y={Y(rMax) + 14} textAnchor="end">{pct(rMax, 0)}</text>
          <text x={X(0) + (lado > 0 ? -4 : 4)} y={10} textAnchor={lado > 0 ? 'end' : 'start'}>entrada</text>
          <text x={X(empate)} y={A - 4} textAnchor="middle">empate {pct(empate / 100)}</text>
        </g>
      </svg>
      <figcaption className="mt-1 text-[12px] text-ink-2">{ideia.montagem}</figcaption>
    </figure>
  );
}

/** Previsão: quanto custa o contrato e quanto paga. */
function Contrato({ ideia }: { ideia: IdeiaPrevisao }) {
  const centavos = Math.round(ideia.preco * 100);
  return (
    <figure className="mt-4">
      <div className="flex h-8 overflow-hidden rounded-sm border border-line">
        <div className="flex items-center bg-green/40 px-2 text-[12px]" style={{ width: `${ideia.preco * 100}%` }}>
          <span className="whitespace-nowrap font-mono">{centavos}¢</span>
        </div>
        <div className="flex flex-1 items-center justify-end px-2 text-[12px] text-ink-3">
          <span className="font-mono">paga US$ 1</span>
        </div>
      </div>
      <figcaption className="mt-1 text-[12px] text-ink-2">
        Compra “{ideia.lado}” no {ideia.casa} a {centavos}¢: se acontecer, cada contrato vale US$ 1 (
        {(1 / ideia.preco).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}× o que custou). Se não, vale zero.
      </figcaption>
    </figure>
  );
}

/** A confiança em cinco quadrados, com o número ao lado. */
function Confianca({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Confiança ${n} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-2 w-2 ${i <= n ? 'bg-accent' : 'bg-fill-strong'}`} />
      ))}
      <span className="ml-1 font-mono text-ink-3">{n}/5</span>
    </span>
  );
}

export default function CartaoIdeia({ ideia, d, spy, semana, carregando }: { ideia: Ideia; d: Desfecho; spy: number | null; semana: string; carregando: boolean }) {
  const ativo = ideia.instrumento === 'previsao' ? ideia.casa : ideia.ativo;
  const nome = ideia.instrumento === 'previsao' ? ideia.mercado : ideia.nome;
  const direcao = ideia.instrumento === 'previsao' ? null : ideia.direcao;
  const chip = 'rounded-sm border border-line bg-raised px-2 py-0.5';

  return (
    <article className="flex flex-col rounded-sm border border-line bg-surface" data-testid="ideia">
      <div className="flex h-9 items-center gap-2 border-b border-line bg-strip px-3">
        <h3 className="font-mono text-[14px] font-medium">{ativo}</h3>
        <span className="truncate text-[12px] text-ink-2">{nome}</span>
        {direcao && (
          <span
            className={`ml-auto inline-flex shrink-0 items-center gap-1 rounded-sm px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] ${
              direcao === 'alta' ? 'bg-green/15 text-green-ink' : 'bg-red/15 text-red-ink'
            }`}
          >
            {direcao === 'alta' ? <ArrowUpRight size={13} aria-hidden /> : <ArrowDownRight size={13} aria-hidden />}
            {direcao === 'alta' ? 'Alta' : 'Baixa'}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <ul className="flex flex-wrap gap-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-2">
          <li className={chip}>{NOME_INSTRUMENTO[ideia.instrumento]}</li>
          <li className={chip}>{ideia.horizonte === 'semana' ? 'Semana' : 'Mês'}</li>
          <li className={chip}>até {diaCurto(ideia.vence)}</li>
        </ul>

        <p className="mt-3 text-[20px] font-semibold leading-tight">{ideia.titulo}</p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{ideia.tese}</p>

        {ideia.instrumento === 'opcao' ? (
          <Payoff ideia={ideia} d={d} />
        ) : ideia.instrumento === 'previsao' ? (
          <Contrato ideia={ideia} />
        ) : (
          <Faixa ideia={ideia} d={d} />
        )}

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3 text-[12px]">
          <div>
            <dt className="font-semibold uppercase tracking-[0.04em] text-ink-3">Tamanho</dt>
            <dd className="mt-0.5 font-mono text-[14px]">{ideia.tamanho}% da carteira</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-[0.04em] text-ink-3">Confiança</dt>
            <dd className="mt-1">
              <Confianca n={ideia.confianca} />
            </dd>
          </div>
        </dl>

        <div className="mt-3 border-t border-line pt-3" data-testid="situacao">
          <Situacao ideia={ideia} d={d} spy={spy} semana={semana} carregando={carregando} />
        </div>

        <details className="group mt-3 border-t border-line pt-1">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[13px] font-bold uppercase tracking-[0.06em]">
            Por quê · {ideia.bases.length} bases
            <span className="text-ink-3 transition-transform group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <ul className="space-y-3">
            {ideia.bases.map((b, i) => (
              <li key={i} className="text-[14px] leading-relaxed">
                <span className="mr-1.5 font-mono text-[11px] uppercase tracking-[0.04em] text-ink-3">{NOME_BASE[b.tipo]}</span>
                {b.texto}
                {b.fonte && (
                  <a
                    href={b.fonte.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-1.5 inline-flex items-center gap-0.5 text-accent underline decoration-dotted underline-offset-2 hover:text-accent-hover"
                  >
                    {b.fonte.nome}
                    <ExternalLink size={11} aria-hidden />
                  </a>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 border-l-2 border-red bg-red/10 px-3 py-2 text-[14px] leading-relaxed">
            <span className="font-semibold">O que mata a ideia: </span>
            {ideia.invalida}
          </p>
        </details>
      </div>
    </article>
  );
}
