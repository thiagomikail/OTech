/**
 * Como cada ideia terminou — conta pura, sem rede e sem banco. Teste em
 * `scripts/testar-mercado.ts`.
 *
 * As regras são escritas pra não favorecer a edição:
 *
 *  - ENTRADA é a abertura do primeiro pregão que começa depois da publicação
 *    (e não antes da segunda da edição). Não existe "entrei no preço de
 *    sexta" depois de ver a segunda.
 *  - Se no mesmo dia o preço passa pelo stop E pelo alvo, vale o STOP. Vela
 *    diária não diz qual veio primeiro, e na dúvida a conta perde.
 *  - Se o pregão já ABRE além do stop (notícia de madrugada), a saída é a
 *    abertura, não o stop: foi o preço que existia.
 *  - Sem alvo nem stop até o vencimento, sai no fechamento do último pregão.
 *  - Opção vai até o vencimento e vale o intrínseco ali. O custo é a
 *    estimativa da publicação — por isso a tela diz "estimado".
 *
 * Retorno é a fração do dinheiro posto NA IDEIA (0,07 = +7%), não da carteira.
 */
import type { Edicao, Ideia, IdeiaOpcao, IdeiaPreco, IdeiaPrevisao } from "./tipos";

/** Um pregão. `inicio` é o instante da abertura (ms); `dia`, "AAAA-MM-DD" da bolsa. */
export type Vela = {
  inicio: number;
  dia: string;
  abertura: number;
  maxima: number;
  minima: number;
  fechamento: number;
};

export type Motivo = "alvo" | "stop" | "prazo" | "resolvida";

export type Desfecho = {
  /**
   * aguardando — a entrada ainda não aconteceu.
   * aberta     — entrou e não saiu; `saida` é o último preço.
   * fechada    — saiu; `motivo` diz por quê.
   * sem-dado   — o prazo passou e não há cotação pra dizer como foi.
   */
  estado: "aguardando" | "aberta" | "fechada" | "sem-dado";
  motivo?: Motivo;
  entrada?: number;
  diaEntrada?: string;
  saida?: number;
  diaSaida?: string;
  /** null quando não dá pra saber agora (previsão sem resolução). */
  retorno?: number | null;
};

/** Onde a entrada acontece: o primeiro pregão depois da publicação, a partir da segunda. */
export function indiceDaEntrada(velas: Vela[], edicao: Pick<Edicao, "semana" | "publicadaEm">) {
  const publicada = Date.parse(edicao.publicadaEm);
  return velas.findIndex((v) => v.dia >= edicao.semana && v.inicio >= publicada);
}

/** Preço de alvo e stop, dada a entrada. */
export function niveis(ideia: Pick<IdeiaPreco, "direcao" | "alvo" | "stop">, entrada: number) {
  const sinal = ideia.direcao === "alta" ? 1 : -1;
  return {
    alvo: entrada * (1 + (sinal * ideia.alvo) / 100),
    stop: entrada * (1 - (sinal * ideia.stop) / 100),
  };
}

const retornoDe = (direcao: "alta" | "baixa", entrada: number, saida: number) =>
  direcao === "alta" ? saida / entrada - 1 : 1 - saida / entrada;

export function desfechoDePreco(
  ideia: IdeiaPreco,
  edicao: Pick<Edicao, "semana" | "publicadaEm">,
  velas: Vela[],
  hoje: string,
): Desfecho {
  const i = indiceDaEntrada(velas, edicao);
  if (i < 0 || velas[i].dia > ideia.vence) return hoje > ideia.vence ? { estado: "sem-dado" } : { estado: "aguardando" };

  const entrada = velas[i].abertura;
  const diaEntrada = velas[i].dia;
  const { alvo, stop } = niveis(ideia, entrada);
  const alta = ideia.direcao === "alta";
  const fechar = (motivo: Motivo, saida: number, diaSaida: string): Desfecho => ({
    estado: "fechada",
    motivo,
    entrada,
    diaEntrada,
    saida,
    diaSaida,
    retorno: retornoDe(ideia.direcao, entrada, saida),
  });

  let ultima = velas[i];
  for (let j = i; j < velas.length && velas[j].dia <= ideia.vence; j++) {
    const v = velas[j];
    ultima = v;
    // Abriu além da linha: sai na abertura. No dia da entrada a abertura É a entrada.
    if (j > i) {
      if (alta ? v.abertura <= stop : v.abertura >= stop) return fechar("stop", v.abertura, v.dia);
      if (alta ? v.abertura >= alvo : v.abertura <= alvo) return fechar("alvo", v.abertura, v.dia);
    }
    const tocouStop = alta ? v.minima <= stop : v.maxima >= stop;
    const tocouAlvo = alta ? v.maxima >= alvo : v.minima <= alvo;
    if (tocouStop) return fechar("stop", stop, v.dia);
    if (tocouAlvo) return fechar("alvo", alvo, v.dia);
  }

  // O último pregão do prazo só fecha depois que o dia acabou.
  if (hoje > ideia.vence) return fechar("prazo", ultima.fechamento, ultima.dia);
  return {
    estado: "aberta",
    entrada,
    diaEntrada,
    saida: ultima.fechamento,
    diaSaida: ultima.dia,
    retorno: retornoDe(ideia.direcao, entrada, ultima.fechamento),
  };
}

/** Valor da opção no vencimento, por unidade do ativo. */
export function valorNoVencimento(ideia: IdeiaOpcao, entrada: number, precoFinal: number) {
  const [k1, k2] = ideia.strikes.map((s) => entrada * (1 + s / 100));
  const dentro = ideia.direcao === "alta" ? precoFinal - k1 : k1 - precoFinal;
  const largura = k2 === undefined ? Infinity : Math.abs(k2 - k1);
  return Math.min(Math.max(dentro, 0), largura);
}

export function desfechoDeOpcao(
  ideia: IdeiaOpcao,
  edicao: Pick<Edicao, "semana" | "publicadaEm">,
  velas: Vela[],
  hoje: string,
): Desfecho {
  const i = indiceDaEntrada(velas, edicao);
  if (i < 0 || velas[i].dia > ideia.vence) return hoje > ideia.vence ? { estado: "sem-dado" } : { estado: "aguardando" };

  const entrada = velas[i].abertura;
  const custo = (entrada * ideia.custo) / 100;
  const ate = velas.filter((v, j) => j >= i && v.dia <= ideia.vence);
  const ultima = ate[ate.length - 1];
  const retorno = valorNoVencimento(ideia, entrada, ultima.fechamento) / custo - 1;

  return {
    estado: hoje > ideia.vence ? "fechada" : "aberta",
    motivo: hoje > ideia.vence ? "prazo" : undefined,
    entrada,
    diaEntrada: velas[i].dia,
    saida: ultima.fechamento,
    diaSaida: ultima.dia,
    // Aberta, é "se vencesse hoje": sem o valor de tempo, que só a corretora sabe.
    retorno,
  };
}

export function desfechoDePrevisao(ideia: IdeiaPrevisao): Desfecho {
  if (!ideia.resolucao) return { estado: "aberta", entrada: ideia.preco, retorno: null };
  const saida = ideia.resolucao.ganhou ? 1 : 0;
  return {
    estado: "fechada",
    motivo: "resolvida",
    entrada: ideia.preco,
    saida,
    diaSaida: ideia.resolucao.em,
    retorno: saida / ideia.preco - 1,
  };
}

export function desfecho(
  ideia: Ideia,
  edicao: Pick<Edicao, "semana" | "publicadaEm">,
  velas: Vela[] | null,
  hoje: string,
): Desfecho {
  if (ideia.instrumento === "previsao") return desfechoDePrevisao(ideia);
  // Sem cotação: antes do prazo é espera; depois, "não sei" — nunca um palpite.
  if (!velas) return hoje > ideia.vence ? { estado: "sem-dado" } : { estado: "aguardando" };
  return ideia.instrumento === "opcao"
    ? desfechoDeOpcao(ideia, edicao, velas, hoje)
    : desfechoDePreco(ideia, edicao, velas, hoje);
}

/**
 * O SPY no mesmo período: abertura do dia da entrada até o fechamento do dia
 * da saída. Cripto anda no fim de semana e a bolsa não — vale o pregão mais
 * próximo por dentro.
 */
export function retornoNoPeriodo(velas: Vela[] | null, diaEntrada?: string, diaSaida?: string) {
  if (!velas || !diaEntrada || !diaSaida) return null;
  const de = velas.find((v) => v.dia >= diaEntrada);
  const ateLa = velas.filter((v) => v.dia <= diaSaida);
  const ate = ateLa[ateLa.length - 1];
  if (!de || !ate || ate.dia < de.dia) return null;
  return ate.fechamento / de.abertura - 1;
}

// ── o registro de acertos

export type Linha = {
  ideia: Ideia;
  semana: string;
  desfecho: Desfecho;
  /** O SPY no mesmo período (null pra previsão, que não tem período comparável). */
  spy: number | null;
};

export type Resumo = {
  fechadas: number;
  acertos: number;
  /** Fechadas que renderam mais que o SPY no mesmo período (só as comparáveis). */
  bateuSpy: number;
  comparaveis: number;
  /** Média simples do retorno por ideia. */
  medio: number | null;
  /** Soma de tamanho × retorno: quanto a carteira inteira andou com as ideias, em fração. */
  carteira: number;
  /** O mesmo dinheiro no SPY, mesmo período — só onde dá pra comparar. */
  carteiraSpy: number;
  /** Uma ponta por ideia fechada, na ordem da saída. */
  curva: { dia: string; carteira: number; spy: number; ideia: string }[];
};

export function resumo(linhas: Linha[]): Resumo {
  const fechadas = linhas
    .filter((l) => l.desfecho.estado === "fechada" && typeof l.desfecho.retorno === "number")
    .sort((a, b) => (a.desfecho.diaSaida ?? "").localeCompare(b.desfecho.diaSaida ?? ""));

  let carteira = 0;
  let carteiraSpy = 0;
  const curva: Resumo["curva"] = [];
  for (const l of fechadas) {
    const peso = l.ideia.tamanho / 100;
    carteira += peso * (l.desfecho.retorno as number);
    carteiraSpy += peso * (l.spy ?? 0);
    curva.push({ dia: l.desfecho.diaSaida ?? l.semana, carteira, spy: carteiraSpy, ideia: l.ideia.titulo });
  }

  const comparaveis = fechadas.filter((l) => l.spy !== null);
  return {
    fechadas: fechadas.length,
    acertos: fechadas.filter((l) => (l.desfecho.retorno as number) > 0).length,
    bateuSpy: comparaveis.filter((l) => (l.desfecho.retorno as number) > (l.spy as number)).length,
    comparaveis: comparaveis.length,
    medio: fechadas.length ? fechadas.reduce((s, l) => s + (l.desfecho.retorno as number), 0) / fechadas.length : null,
    carteira,
    carteiraSpy,
    curva,
  };
}

// ── as reservas

export type DadosReserva = {
  /** Dólares postos, no papel. */
  valor: number;
  /** O preço que a pessoa pegou, se não foi a abertura da entrada. */
  entrada: number | null;
  /** Saiu antes, por conta própria. */
  saida: number | null;
};

/**
 * Retorno de quem seguiu a ideia. Em ação, ETF e cripto, o preço próprio de
 * entrada e de saída vale; em opção e previsão o preço é do contrato, que a
 * tela não conhece — aí vale o retorno da ideia.
 */
export function retornoDaReserva(ideia: Ideia, d: Desfecho, r: DadosReserva): number | null {
  if (ideia.instrumento === "opcao" || ideia.instrumento === "previsao") {
    return typeof d.retorno === "number" ? d.retorno : null;
  }
  const entrada = r.entrada ?? d.entrada;
  const saida = r.saida ?? d.saida;
  if (!entrada || !saida) return null;
  return retornoDe(ideia.direcao, entrada, saida);
}

/** A reserva acabou? Saiu por conta própria, ou a ideia fechou. */
export const reservaFechada = (d: Desfecho, r: DadosReserva) => r.saida !== null || d.estado === "fechada";
