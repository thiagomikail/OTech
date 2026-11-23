import type { Edicao } from "../tipos";

/**
 * Escrita na manhã de segunda, 23 nov 2026, antes da abertura — depois da
 * pior semana do S&P desde abril de 2025 (−8,6%), da investigação da SEC na
 * Nvidia e da estreia da Anthropic. Semana curta: bolsa fechada na quinta
 * (Ação de Graças) e pregão até 13h na sexta. Sem cotação no container: os
 * números do termômetro vêm das reportagens de sexta, 20 nov.
 */
export const edicao: Edicao = {
  semana: "2026-11-23",
  publicadaEm: "2026-11-23T11:44:20Z",
  manchete: "Correção na bolsa, medo acima de 35 e a semana do feriado",
  leitura:
    "O S&P caiu 8,6% na semana e entrou em correção (11,6% abaixo do recorde de 6 out); a Nasdaq apagou o ganho do ano. A Nvidia bateu o trimestre e subiu o guia, mas perdeu 23% na semana — a SEC investiga a contabilidade dela. " +
    "O VIX fechou em ~36, o juro de 10 anos caiu pra ~4,93% com a fuga pra Treasury, e nem o ouro serviu de abrigo (−8%). " +
    "A semana é curta e fina: PCE e PIB na quarta, feriado na quinta, meio pregão na sexta. " +
    "Postura defensiva: o seguro de baixa da semana passada pagou; agora, repique só com risco definido ou pequeno, e consumo básico como abrigo.",
  postura: "defensiva",

  termometro: [
    { simbolo: "^GSPC", nome: "S&P 500", valor: 6910.39, unidade: "pts", leitura: "−8,6% na semana, sete quedas diárias seguidas. Em correção pela primeira vez desde março de 2025." },
    { simbolo: "^IXIC", nome: "Nasdaq", unidade: "pts", leitura: "~−10% na semana: apagou o ganho de 2026." },
    { simbolo: "^TNX", nome: "Juro de 10 anos", valor: 4.93, unidade: "%", leitura: "Caiu ~20 pontos na semana com a fuga da bolsa, mesmo com a alta do Fed dada como certa." },
    { simbolo: "^VIX", nome: "VIX (medo)", valor: 35.89, unidade: "pts", leitura: "Acima de 35: o maior nível desde março. Historicamente perto de fundo, mas não marca o dia." },
    { simbolo: "CL=F", nome: "Petróleo WTI", valor: 83.6, unidade: "US$", leitura: "Terceira semana de queda (−6%): a IEA já vê excesso de oferta de ~2 milhões de barris por dia." },
    { simbolo: "GC=F", nome: "Ouro", valor: 3550, unidade: "US$", leitura: "−8% na semana, a maior queda desde março: juro real e dólar forte venceram o medo." },
    { simbolo: "BTC-USD", nome: "Bitcoin", valor: 61000, unidade: "US$", leitura: "Na mínima desde julho, abaixo de US$ 62 mil." },
    { simbolo: "DX-Y.NYB", nome: "Dólar (DXY)", valor: 103.7, unidade: "pts", leitura: "Perto da máxima em 19 meses." },
  ],

  ideias: [
    {
      id: "2026-11-23-spy-trava",
      instrumento: "opcao",
      ativo: "SPY",
      nome: "SPDR S&P 500 ETF",
      titulo: "Trava de alta no S&P depois do pânico",
      tese:
        "Com o VIX entre 30 e 40, o S&P historicamente estava mais alto 12 meses depois em 84% das vezes. A Nvidia mostrou que a demanda por IA segue forte; o que caiu foi o preço, não o lucro. Trava, porque o fundo pode demorar — e a perda fica limitada ao débito.",
      direcao: "alta",
      horizonte: "mes",
      vence: "2026-12-18",
      estrutura: "trava",
      strikes: [0, 5],
      custo: 2.2,
      montagem:
        "Comprar a call de SPY de 18 dez no dinheiro e vender a call de 18 dez ~5% acima. Débito estimado ~2,2% do preço do SPY (o VIX alto encarece); ganho máximo ~125%.",
      tamanho: 2,
      confianca: 4,
      catalisador: { dia: "2026-11-25", oque: "Inflação PCE (out) e PIB do 3º trimestre, 8h30" },
      bases: [
        {
          tipo: "historico",
          texto: "De 1990 a 2026, com o VIX fechando entre 30 e 40, o S&P subiu em média 18% nos 12 meses seguintes, e estava mais alto em 84% das vezes.",
          fonte: { nome: "ChartingLens", url: "https://chartinglens.com/blog/vix-levels-stock-market-returns" },
        },
        {
          tipo: "resultado",
          texto: "Nvidia: receita de US$ 115,8 bi (+103% no ano) contra ~US$ 108,9 bi esperados, e guia de 2027 elevado pra +75% de receita.",
          fonte: { nome: "Motley Fool", url: "https://www.fool.com/coverage/stock-market-today/2026/11/18/stock-market-today-nov-18-nvidia-slips-on-strong-results-as-succession-and-china-business-risks-weigh/" },
        },
        {
          tipo: "noticia",
          texto: "O S&P fechou 11,6% abaixo do recorde de 6 out, a primeira correção desde março de 2025, com o VIX em 35,89.",
          fonte: { nome: "CNBC", url: "https://www.cnbc.com/2026/11/19/stock-market-today-live-updates.html" },
        },
      ],
      contra: [
        "O padrão histórico é de 12 meses; a trava vence em 4 semanas. Em 2008 o VIX passou de 40 no outono e o fundo só veio em março de 2009.",
        "A investigação da SEC na Nvidia não tem escopo conhecido: uma notícia ruim de contabilidade derruba o índice inteiro.",
        "O Fed sobe em 9 dez com ~96% de chance, antes do vencimento.",
        "Soma com a trava de alta do S&P de 2 nov, ainda aberta e bem abaixo do strike: é a segunda aposta no mesmo lado.",
      ],
      invalida:
        "S&P fechando abaixo de 6.600 (~−15% do recorde) ou a SEC formalizando acusação contra a Nvidia. Não tem stop: o máximo que se perde é o débito (2% da carteira).",
    },
    {
      id: "2026-11-23-xlp",
      instrumento: "etf",
      ativo: "XLP",
      nome: "Consumer Staples Select Sector SPDR",
      titulo: "Consumo básico como abrigo que funcionou",
      tese:
        "Na semana do tombo o XLP caiu só ~2% contra −8,6% do S&P, e foi o único setor no azul na sexta. Ouro e bitcoin não protegeram; consumo básico protegeu. Enquanto o medo durar, é onde o dinheiro se esconde.",
      direcao: "alta",
      horizonte: "mes",
      vence: "2026-12-18",
      alvo: 4,
      stop: 3,
      tamanho: 3,
      confianca: 3,
      catalisador: { dia: "2026-11-27", oque: "Black Friday: começa a temporada de compras de fim de ano" },
      bases: [
        {
          tipo: "noticia",
          texto: "XLP −2,05% na semana contra −8,61% do S&P; consumo básico foi o único setor em alta na sexta (20 nov).",
          fonte: { nome: "TradingView (Seeking Alpha)", url: "https://www.tradingview.com/news/seekingalpha:d0e36ef8a094b:0-tech-stocks-lead-wall-street-bloodbath-as-s-p-500-posts-massive-weekly-loss/" },
        },
        {
          tipo: "historico",
          texto: "De out 2007 a mar 2009 o setor caiu ~15–25% contra ~55% do S&P; em 2022, ~−3 a −5% contra ~−18%.",
          fonte: { nome: "Pomegra", url: "https://pomegra.io/learn/library/track-f-lifecycle/sector-investing/chapter-05-consumer-staples/consumer-staples-historical-performance" },
        },
      ],
      contra: [
        "Quando a bolsa repica forte, consumo básico fica pra trás — e a trava do SPY aposta justamente no repique.",
        "A semana encerrou seis semanas seguidas de alta do XLP: parte do abrigo já está no preço.",
        "Juro mais alto (Fed em 9 dez) pesa em ação de dividendo.",
      ],
      invalida:
        "O S&P recuperando metade da queda (acima de ~7.250) com o XLP parado: aí o dinheiro saiu do abrigo. Stop de 3%.",
    },
    {
      id: "2026-11-23-qqq",
      instrumento: "etf",
      ativo: "QQQ",
      nome: "Invesco QQQ (Nasdaq-100)",
      titulo: "Repique curto na Nasdaq, na semana do feriado",
      tese:
        "Nas quatro vezes desde 1990 em que o VIX subiu 16,5 pontos ou mais numa semana, o S&P subiu na semana seguinte (média +3,3%). O VIX subiu ~17 pontos. Aposta de uma semana, pequena, no setor que mais caiu.",
      direcao: "alta",
      horizonte: "semana",
      vence: "2026-11-27",
      alvo: 5,
      stop: 4,
      tamanho: 2,
      confianca: 4,
      catalisador: { dia: "2026-11-25", oque: "Inflação PCE (out) e PIB do 3º trimestre, 8h30" },
      bases: [
        {
          tipo: "historico",
          texto: "Desde 1990, depois de semanas em que o VIX subiu 16,5 pontos ou mais, o S&P subiu em média 3,3% na semana seguinte — positivo nos quatro casos.",
          fonte: { nome: "Paul O'Connor", url: "https://poc123.substack.com/p/what-happens-after-the-vix-spikes" },
        },
        {
          tipo: "noticia",
          texto: "A Nasdaq-100 caiu ~10% na semana e apagou o ganho de 2026: o pior da queda ficou na tecnologia.",
          fonte: { nome: "TradingKey", url: "https://www.tradingkey.com/analysis/stocks/stocks-weekly/262317153-wall-street-weekly-tradingkey" },
        },
        {
          tipo: "resultado",
          texto: "Nvidia subiu o guia de receita de 2027 pra +75%: a demanda que sustenta a Nasdaq não quebrou.",
          fonte: { nome: "Yahoo Finance", url: "https://finance.yahoo.com/markets/stocks/articles/stock-market-today-nov-18-221135469.html" },
        },
      ],
      contra: [
        "Quatro casos é amostra minúscula.",
        "Semana de feriado tem pouco volume: o preço anda mais do que deveria pros dois lados.",
        "A investigação da SEC na Nvidia pode ter notícia nova a qualquer dia.",
        "A trava de baixa do QQQ (16 nov) segue aberta do outro lado: esta é a aposta curta no repique, não a troca do seguro.",
      ],
      invalida:
        "O VIX voltando acima de 40, ou a Nasdaq-100 fechando abaixo da mínima de sexta. Stop de 4%.",
    },
  ],

  evitar: [
    {
      ativo: "NVDA",
      porque: "Resultado forte, mas a SEC investiga a contabilidade sem escopo conhecido, o CEO saiu e o Congresso quer ouvir os dois. Não se aposta pra nenhum lado com uma investigação aberta.",
    },
    {
      ativo: "ANT",
      porque: "Estreou a US$ 97 (preço de US$ 83) e caiu 9% no dia seguinte. Sem histórico de preço — e esta edição é escrita com o Claude, da Anthropic: conflito de interesse, fica fora por regra.",
    },
    {
      ativo: "GLD",
      porque: "−8% na semana do pânico: com juro real alto e dólar no topo, o ouro não está servindo de abrigo. Volta à mesa quando o Fed parar.",
    },
    {
      ativo: "BTC",
      porque: "Na mínima desde julho e caindo junto com a tecnologia: hoje se comporta como ação de risco, não como abrigo. Sem vantagem.",
    },
    {
      ativo: "XLE",
      porque: "A ideia de baixa de 16 nov já está perto do alvo (XLE −6,9% na semana). Não dobrar a aposta.",
    },
  ],

  agenda: [
    { dia: "2026-11-24", hora: "10h", oque: "Confiança do consumidor (Conference Board)", porque: "Primeiro dado depois da correção.", peso: 1 },
    { dia: "2026-11-25", hora: "8h30", oque: "Inflação PCE (out) e PIB do 3º trimestre", porque: "A inflação preferida do Fed: esperam núcleo em 3,2% no ano. Decide se o Fed fala em mais de uma alta.", peso: 3 },
    { dia: "2026-11-26", oque: "Ação de Graças", porque: "Bolsa fechada.", peso: 1 },
    { dia: "2026-11-27", hora: "até 13h", oque: "Black Friday — pregão curto", porque: "Pouco volume; começa a temporada de compras.", peso: 2 },
    { dia: "2026-12-09", oque: "Decisão do Fed", porque: "Alta de 0,25 em ~96%.", peso: 3 },
    { dia: "2026-12-11", oque: "Acaba o orçamento provisório", porque: "Outro provisório é o mais provável.", peso: 2 },
    { dia: "2026-12-18", oque: "Vencimento das opções de dezembro", porque: "Fecham as quatro travas abertas (S&P, chip, Nasdaq e a nova do S&P).", peso: 2 },
  ],

  apostas: [
    {
      pergunta: "Fed sobe o juro em dezembro",
      casa: "Kalshi",
      fonte: { nome: "24/7 Wall St.", url: "https://247wallst.com/investing/2026/11/18/traders-now-see-a-95-chance-the-fed-hikes-rates-in-december/" },
      prob: 0.96,
      antes: { prob: 0.91, quando: "13 nov" },
      leitura: "A ata de outubro mostrou quase todos falando em mais aperto. A ideia contrária de 2 nov (Fed mantém, a 0,24) caminha pra perda em 9 dez.",
    },
  ],

  congresso: [
    {
      nome: "Nvidia no Congresso",
      situacao: "O Congresso quer ouvir o Jensen Huang e a CEO interina, Colette Kress; a SEC investiga a contabilidade e o Departamento de Justiça revê a compra da Hugging Face.",
      afeta: "Nvidia e todo o índice de tecnologia.",
      fonte: { nome: "Reuters (Investing.com)", url: "https://www.investing.com/news/economy-news/exclusiveus-secs-nvidia-probe-is-examining-potential-accounting-issues-sources-say-5042460" },
    },
    {
      nome: "Orçamento provisório (até 11 dez)",
      situacao: "Nenhum projeto de orçamento de 2027 virou lei; outro provisório é o mais provável.",
      quando: "2026-12-11",
      afeta: "Defesa e fornecedores do governo; risco de paralisação na última semana.",
      fonte: { nome: "Gov.House", url: "https://gov.house/budget-taxes/december-11-funding-deadline-shutdown/" },
    },
  ],

  revisao:
    "O seguro pagou. Trava de baixa do QQQ: a Nasdaq-100 caiu ~10% na semana, além do strike vendido (−5%); se ficar assim até 18 dez, paga a largura toda (~+125% sobre o débito). " +
    "Energia de baixa (XLE): −6,9% na semana com o petróleo na terceira queda; o alvo de 7% ficou perto — a tela diz se tocou. " +
    "Título longo (TLT): o 10 anos caiu de 5,15% pra ~4,93%, a favor da ideia, mas pela fuga da bolsa, não pelo Fed parar — a tese ainda não foi testada. " +
    "Das mais antigas: a trava do chip (9 nov) sofreu com a Nvidia (−23% na semana) e deve estar abaixo do strike comprado; a trava do S&P de 2 nov está longe, com o índice a 6.910; a Microsoft vence sexta e a tela mostra como saiu; e a aposta de que o Fed não sobe caminha pra perda. " +
    "O que muda no método: manter um seguro de baixa aberto enquanto o VIX estiver acima de 25, e entrar em repique só com trava ou tamanho de 2% e prazo curto. A semana mostrou também que ouro e bitcoin não protegeram — abrigo é o que caiu menos no último susto, não o que o manual diz.",
};
