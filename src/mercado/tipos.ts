/**
 * O módulo mercado (29 out 2026): a edição semanal de ideias de investimento,
 * escrita toda segunda antes da abertura, e o registro de como cada ideia
 * terminou. No papel por enquanto — decisão do Thiago.
 *
 * A edição é CÓDIGO (`lib/mercado/edicoes/`), como o acervo de vídeos: quem
 * escreve é a sessão de pesquisa de segunda, que commita o arquivo. Edição
 * publicada não se reescreve — senão a taxa de acerto vira ficção. Ela só
 * ganha `resolucao` (previsão que resolveu) e `adendos` (nota datada).
 *
 * Arquivo puro: vai pro navegador.
 */

export type Instrumento = "acao" | "etf" | "opcao" | "cripto" | "previsao";
export type Direcao = "alta" | "baixa";
export type Horizonte = "semana" | "mes";

/** De onde vem a convicção. Cada ideia tem pelo menos duas. */
export type TipoBase =
  | "resultado" // balanço de empresa
  | "dado" // dado econômico (emprego, inflação, juro)
  | "noticia"
  | "previsao" // mercado de previsão (Polymarket, Kalshi)
  | "congresso" // projeto de lei, votação, prazo
  | "historico" // padrão estudado (sazonalidade, drift pós-resultado)
  | "fluxo"; // dinheiro entrando ou saindo (ETF, posicionamento)

export type Fonte = { nome: string; url: string };

export type Base = { tipo: TipoBase; texto: string; fonte?: Fonte };

type Comum = {
  /** "2026-11-02-msft". Único e eterno: é a chave do desfecho e das reservas. */
  id: string;
  titulo: string;
  /** Uma ou duas linhas: a aposta, sem jargão. */
  tese: string;
  bases: Base[];
  /** O que mataria a tese — escrito antes, pra não racionalizar depois. */
  invalida: string;
  horizonte: Horizonte;
  /** Último pregão da ideia, "AAAA-MM-DD". Sem alvo nem stop até lá, sai no fechamento. */
  vence: string;
  /** % da carteira. Perfil moderado: no máximo 5. */
  tamanho: number;
  /**
   * Desde `FORMULA_DA_CONFIANCA`, é conta: 1 + os `CRITERIOS` que a ideia
   * atende (`criteriosDe`), e o teste confere. Antes disso, foi julgamento
   * da edição — e fica como foi publicado.
   */
  confianca: 1 | 2 | 3 | 4 | 5;
  /** O evento com data que deve mexer no preço dentro do prazo: balanço, dado, votação, reunião. */
  catalisador?: { dia: string; oque: string };
  /**
   * O que pesa contra a ideia hoje, escrito na publicação. Lista vazia é
   * "nada relevante contra" — e vale um critério da confiança. Obrigatório
   * desde a fórmula; as edições anteriores não têm.
   */
  contra?: string[];
};

/** Ação, ETF ou cripto: alvo e stop em % a partir da abertura da entrada. */
export type IdeiaPreco = Comum & {
  instrumento: "acao" | "etf" | "cripto";
  /** Símbolo do Yahoo: "MSFT", "SMH", "BTC-USD". */
  ativo: string;
  nome: string;
  direcao: Direcao;
  /** % a favor da direção. 7 = +7% numa alta, −7% numa baixa. */
  alvo: number;
  /** % contra a direção. */
  stop: number;
};

/**
 * Opção de risco definido, levada até o vencimento. Os strikes são relativos
 * ao preço do ativo na entrada (0 = no dinheiro, 4 = 4% acima), porque a
 * edição é escrita antes da abertura e o preço exato ainda não existe.
 */
export type IdeiaOpcao = Comum & {
  instrumento: "opcao";
  ativo: string;
  nome: string;
  direcao: Direcao;
  /** "trava": compra um strike e vende outro. "seca": só a compra. */
  estrutura: "trava" | "seca";
  /** Trava de alta: [compra, venda], venda acima. Trava de baixa: [compra, venda], venda abaixo. */
  strikes: [number] | [number, number];
  /** Débito estimado na publicação, em % do preço do ativo. É o máximo que se perde. */
  custo: number;
  /** Como montar, em português de corretora. */
  montagem: string;
};

/** Contrato de mercado de previsão: paga 1 se o lado escolhido acontecer. */
export type IdeiaPrevisao = Comum & {
  instrumento: "previsao";
  /** A pergunta do mercado, traduzida. */
  mercado: string;
  casa: "Polymarket" | "Kalshi";
  url: string;
  /** O lado comprado: "Sim", "Não muda", "Democratas". */
  lado: string;
  /** Preço pago por contrato, 0–1. */
  preco: number;
  /** Escrito numa edição seguinte, quando o mercado resolve. */
  resolucao?: { ganhou: boolean; em: string; nota?: string };
};

export type Ideia = IdeiaPreco | IdeiaOpcao | IdeiaPrevisao;

/** Um indicador do termômetro: o símbolo busca a cotação ao vivo; o resto é o retrato da publicação. */
export type Leitura = {
  simbolo: string;
  nome: string;
  /** Valor no fechamento anterior à publicação. */
  valor?: number;
  unidade?: "pts" | "%" | "US$";
  /** Uma linha: por que este número importa esta semana. */
  leitura: string;
};

export type Compromisso = {
  dia: string;
  hora?: string;
  oque: string;
  porque: string;
  /** 3 = mexe com tudo; 1 = vale saber. */
  peso: 1 | 2 | 3;
};

export type Aposta = {
  pergunta: string;
  casa: "Polymarket" | "Kalshi";
  /** A página do mercado, ou a reportagem que citou o preço. */
  fonte: Fonte;
  /** Probabilidade do "sim", 0–1. */
  prob: number;
  /** Onde estava antes — a mudança costuma dizer mais que o nível. `quando`: "jan", "14 set", "antes da reunião". */
  antes?: { prob: number; quando: string };
  leitura: string;
};

export type Projeto = {
  nome: string;
  situacao: string;
  quando?: string;
  afeta: string;
  fonte?: Fonte;
};

export type Edicao = {
  /** A segunda-feira da semana, "AAAA-MM-DD". */
  semana: string;
  /**
   * Instante da publicação, ISO. A entrada de cada ideia é a abertura do
   * primeiro pregão que começa DEPOIS disto (e não antes da segunda): uma
   * edição atrasada não pode escolher preço que já viu.
   */
  publicadaEm: string;
  manchete: string;
  /** O que move a semana, em três ou quatro linhas. */
  leitura: string;
  postura: "defensiva" | "neutra" | "ofensiva";
  termometro: Leitura[];
  ideias: Ideia[];
  /** O que a edição deixaria de fora, e por quê. "Não fazer nada" também é posição. */
  evitar: { ativo: string; porque: string }[];
  agenda: Compromisso[];
  apostas: Aposta[];
  congresso: Projeto[];
  /** O que deu certo e errado nas ideias anteriores — com a mesma franqueza das teses. */
  revisao?: string;
  adendos?: { em: string; texto: string }[];
};

// ── a confiança

/** A partir desta segunda a confiança é a conta abaixo; antes, era julgamento da edição. */
export const FORMULA_DA_CONFIANCA = "2026-11-09";

/** Cada critério atendido soma 1 à confiança, que começa em 1. Quatro critérios: de 1 a 5. */
export const CRITERIOS = {
  variadas: "Três ou mais bases de tipos diferentes",
  historico: "Uma base de padrão histórico, com fonte",
  catalisador: "Um catalisador com data dentro do prazo",
  "nada-contra": "Nada relevante pesando contra",
} as const;
export type Criterio = keyof typeof CRITERIOS;

/** Os critérios que a ideia atende. Null pra edição de antes da fórmula, que não tem como ser medida. */
export function criteriosDe(ideia: Ideia, semana: string): Criterio[] | null {
  if (semana < FORMULA_DA_CONFIANCA) return null;
  const c: Criterio[] = [];
  if (new Set(ideia.bases.map((b) => b.tipo)).size >= 3) c.push("variadas");
  if (ideia.bases.some((b) => b.tipo === "historico" && b.fonte)) c.push("historico");
  const k = ideia.catalisador;
  if (k && k.dia >= semana && k.dia <= ideia.vence) c.push("catalisador");
  if (ideia.contra && ideia.contra.length === 0) c.push("nada-contra");
  return c;
}

/** confiança = 1 + critérios atendidos. */
export const confiancaDe = (criterios: Criterio[]) => 1 + criterios.length;

export const NOME_INSTRUMENTO: Record<Instrumento, string> = {
  acao: "Ação",
  etf: "ETF",
  opcao: "Opção",
  cripto: "Cripto",
  previsao: "Previsão",
};

export const NOME_BASE: Record<TipoBase, string> = {
  resultado: "Balanço",
  dado: "Dado",
  noticia: "Notícia",
  previsao: "Mercado de previsão",
  congresso: "Congresso",
  historico: "Histórico",
  fluxo: "Fluxo",
};

/** Teto do perfil moderado, escolhido pelo Thiago em 29 out 2026. */
export const TAMANHO_MAXIMO = 5;
