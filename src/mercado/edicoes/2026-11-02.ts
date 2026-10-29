import type { Edicao } from "../tipos";

/**
 * Edição de estreia. Escrita na noite de 28 out 2026 (Atlanta), depois do Fed
 * e dos balanços de Microsoft e Alphabet; antes de Amazon (29 out) e Apple
 * (2 nov). Entrada: abertura de segunda, 2 nov.
 */
export const edicao: Edicao = {
  semana: "2026-11-02",
  publicadaEm: "2026-10-29T04:30:00Z",
  manchete: "Eleição, juro a 5% e a IA separando quem fatura de quem só gasta",
  leitura:
    "Bolsa no recorde, juro de 10 anos encostado em 5%, petróleo acima de US$ 100 e um Fed que já fala em subir juro em dezembro. " +
    "A semana tem eleição na terça e relatório de emprego na sexta. Dentro da IA, o mercado começou a escolher: premiou a Microsoft, " +
    "que mostrou o Azure crescendo 48%, e derrubou a Alphabet, que queimou caixa pra construir data center. " +
    "Postura neutra: pouco dinheiro por ideia, stop em todas e trava em vez de índice seco.",
  postura: "neutra",

  termometro: [
    { simbolo: "^GSPC", nome: "S&P 500", valor: 7743.98, unidade: "pts", leitura: "Recorde. +13% no ano: o melhor ano de eleição de meio de mandato desde 2006." },
    { simbolo: "^IXIC", nome: "Nasdaq", valor: 26549.85, unidade: "pts", leitura: "Puxado por chip e nuvem." },
    { simbolo: "^TNX", nome: "Juro de 10 anos", valor: 5.0, unidade: "%", leitura: "Perto do maior nível em quase 20 anos: é o freio do mercado." },
    { simbolo: "^VIX", nome: "VIX (medo)", unidade: "pts", leitura: "Costuma cair depois que a eleição passa." },
    { simbolo: "CL=F", nome: "Petróleo WTI", valor: 102, unidade: "US$", leitura: "Irã e o Estreito de Ormuz. Negociação de 26–27 out terminou sem cessar-fogo." },
    { simbolo: "GC=F", nome: "Ouro", valor: 4050, unidade: "US$", leitura: "Parado perto do topo, mesmo com juro alto." },
    { simbolo: "BTC-USD", nome: "Bitcoin", valor: 81000, unidade: "US$", leitura: "Abaixo do preço médio de quem comprou pelos ETFs (~US$ 81,5 mil)." },
    { simbolo: "DX-Y.NYB", nome: "Dólar (DXY)", valor: 102.3, unidade: "pts", leitura: "Firme, sem drama." },
  ],

  ideias: [
    {
      id: "2026-11-02-smh",
      instrumento: "etf",
      ativo: "SMH",
      nome: "VanEck Semiconductor ETF",
      titulo: "Chips: o gasto da Alphabet é a receita deles",
      tese:
        "O capex que derrubou a Alphabet vira pedido de chip. Microsoft com Azure a +48% e Amazon prometendo US$ 220 bi de investimento no ano sustentam a demanda por mais uma semana.",
      direcao: "alta",
      horizonte: "semana",
      vence: "2026-11-06",
      alvo: 4,
      stop: 3,
      tamanho: 4,
      confianca: 3,
      bases: [
        {
          tipo: "resultado",
          texto: "Alphabet: Google Cloud +103%, mas fluxo de caixa livre negativo em ~US$ 9 bi por causa do investimento em IA. O gasto continua.",
          fonte: { nome: "CNBC", url: "https://www.cnbc.com/2026/10/28/stocks-making-the-biggest-moves-after-hours-googl-msft-cmg-now.html" },
        },
        {
          tipo: "resultado",
          texto: "Microsoft: Azure +48%. Quem vende nuvem de IA ainda está comprando capacidade.",
          fonte: { nome: "Motley Fool", url: "https://www.fool.com/investing/2026/10/28/microsoft-and-alphabet-just-reported-earnings-putting-the-ai-boom-to-the-test/" },
        },
        {
          tipo: "resultado",
          texto: "Amazon elevou o investimento de 2026 para ~US$ 220 bi e divulga o trimestre na quinta (29 out).",
          fonte: { nome: "Pepperstone", url: "https://pepperstone.com/en/insights/market-analysis/equities/amazon-q3-2026-earnings-preview" },
        },
      ],
      invalida:
        "Amazon cortando o investimento na quinta, ou o emprego de sexta forte o bastante pra jogar o juro de 10 anos acima de 5,2%. Chip é o primeiro a cair quando o juro sobe.",
    },
    {
      id: "2026-11-02-msft",
      instrumento: "acao",
      ativo: "MSFT",
      nome: "Microsoft",
      titulo: "Microsoft depois do balanço",
      tese:
        "Bateu receita e lucro, e o Azure acelerou. Ação que surpreende pra cima tende a continuar subindo por semanas depois do balanço — e o mercado está premiando quem já fatura com IA.",
      direcao: "alta",
      horizonte: "mes",
      vence: "2026-11-27",
      alvo: 7,
      stop: 4,
      tamanho: 4,
      confianca: 3,
      bases: [
        {
          tipo: "resultado",
          texto: "Receita de US$ 92,3 bi contra 90,7 esperados; lucro por ação de 4,89 contra 4,73; Azure +48%. Subiu de 2% a 5% no after-hours.",
          fonte: { nome: "CNBC", url: "https://www.cnbc.com/2026/10/28/stocks-making-the-biggest-moves-after-hours-googl-msft-cmg-now.html" },
        },
        {
          tipo: "historico",
          texto: "Drift pós-resultado: surpresa positiva costuma seguir rendendo por 30 a 60 dias (Bernard & Thomas, 1989). É um dos padrões mais estudados do mercado.",
          fonte: { nome: "Wikipedia", url: "https://en.wikipedia.org/wiki/Post%E2%80%93earnings-announcement_drift" },
        },
        {
          tipo: "noticia",
          texto: "No mesmo dia a Alphabet caiu ~10% por gastar sem mostrar retorno: o mercado está separando os dois casos.",
          fonte: { nome: "BigGo Finance", url: "https://finance.biggo.com/news/32a3f9be-3427-4979-89ee-eaac8d6d7784" },
        },
      ],
      invalida:
        "Perder 4% a partir da entrada — o salto do balanço teria sido devolvido. O fluxo de caixa livre caiu 27%: se o mercado passar a cobrar caixa de todo mundo, a Microsoft também apanha.",
    },
    {
      id: "2026-11-02-spy-trava",
      instrumento: "opcao",
      ativo: "SPY",
      nome: "SPDR S&P 500 ETF",
      titulo: "Trava de alta no S&P até 18 dez",
      tese:
        "Depois da eleição de meio de mandato a bolsa americana costuma subir: em 12 meses, quase sempre subiu. A trava limita a perda ao que foi pago, porque juro a 5% e Fed querendo subir podem segurar o índice.",
      direcao: "alta",
      horizonte: "mes",
      vence: "2026-12-18",
      estrutura: "trava",
      strikes: [0, 4],
      custo: 1.9,
      montagem: "Comprar a call de SPY de 18 dez no dinheiro e vender a call de 18 dez ~4% acima. Débito estimado ~1,9% do preço do SPY; ganho máximo ~110%.",
      tamanho: 2,
      confianca: 3,
      bases: [
        {
          tipo: "historico",
          texto: "Média de +12,4% nos 12 meses depois de eleições de meio de mandato (U.S. Bank). Desde 1938, subiu em 95% dos casos (Fidelity).",
          fonte: { nome: "U.S. Bank", url: "https://www.usbank.com/investing/financial-perspectives/market-news/stock-market-performance-after-midterm-elections.html" },
        },
        {
          tipo: "previsao",
          texto: "Polymarket dá 66% pra democratas levarem Câmara e Senado: governo dividido, pouca lei nova — o mercado costuma gostar de impasse.",
          fonte: { nome: "Polymarket", url: "https://polymarket.com/event/balance-of-power-2026-midterms" },
        },
        {
          tipo: "historico",
          texto: "Contra: quando o partido do presidente perde o controle do Congresso, os 6 meses seguintes renderam menos (10,4% contra 16,1%, BlackRock). Ainda positivo — por isso trava, e pequena.",
          fonte: { nome: "BlackRock", url: "https://www.blackrock.com/us/financial-professionals/insights/2026-midterm-elections-and-market-performance" },
        },
      ],
      invalida:
        "Não tem stop: o máximo que se perde é o débito (2% da carteira). A tese morre se o Fed subir juro e o 10 anos passar de 5,3% — aí o índice dificilmente sobe 4% até dezembro.",
    },
    {
      id: "2026-11-02-xle",
      instrumento: "etf",
      ativo: "XLE",
      nome: "Energy Select Sector SPDR",
      titulo: "Energia como seguro do Irã",
      tese:
        "O mercado de previsão dá só 12% pra Ormuz voltar ao normal até o fim do ano, e há relatos de ataque dos EUA ao Irã depois da eleição. Energia é também o contrapeso de uma carteira cheia de tecnologia.",
      direcao: "alta",
      horizonte: "mes",
      vence: "2026-11-27",
      alvo: 8,
      stop: 5,
      tamanho: 3,
      confianca: 2,
      bases: [
        {
          tipo: "previsao",
          texto: "Polymarket: 12% de chance de o tráfego em Ormuz estar normal até 31 dez (28 out).",
          fonte: { nome: "Rio Times", url: "https://www.riotimesonline.com/iran-ceasefire-odds-drop-17-points-in-a-day" },
        },
        {
          tipo: "noticia",
          texto: "Petróleo subiu ~2% em 28 out com relatos de que os EUA podem voltar a atacar o Irã depois da eleição.",
          fonte: { nome: "Schwab", url: "https://www.schwab.com/learn/story/stock-market-update-open" },
        },
      ],
      invalida:
        "Notícia de cessar-fogo ou de Ormuz reabrindo: o petróleo já caiu forte num dia só com diplomacia (20 out). Por isso o stop de 5% e confiança 2.",
    },
    {
      id: "2026-11-02-fed-dez",
      instrumento: "previsao",
      mercado: "Decisão do Fed em dezembro",
      casa: "Kalshi",
      url: "https://kalshi.com/markets/kxfeddecision/fed-meeting/kxfeddecision-26dec",
      lado: "Fed mantém o juro",
      preco: 0.24,
      titulo: "O Fed não sobe em dezembro",
      tese:
        "O mercado dá de 75% a 82% pra alta de juro em 9 dez. Acho exagero: o núcleo da inflação está em 2,6% e o emprego está esfriando rápido. Até lá saem dois relatórios de emprego e uma inflação. Aposta pequena e contrária.",
      horizonte: "mes",
      vence: "2026-12-09",
      tamanho: 1,
      confianca: 2,
      bases: [
        {
          tipo: "dado",
          texto: "Setembro criou só 29 mil vagas (esperavam ~90 mil), desemprego subiu pra 4,2% e julho e agosto foram revisados em −60 mil.",
          fonte: { nome: "BabyPips", url: "https://www.babypips.com/news/headline-us-jobs-report-september-2026-payrolls-miss-fed-hike-odds" },
        },
        {
          tipo: "dado",
          texto: "Inflação de setembro: cheia em 3,7% (gasolina recorde), núcleo em 2,6%. O que assusta é energia, não o resto.",
          fonte: { nome: "InvestingLive", url: "https://investinglive.com/news/us-september-cpi-vs-3-6-expected-0/" },
        },
        {
          tipo: "previsao",
          texto: "Polymarket foi de 77% pra 82% de alta depois da reunião; Kalshi ~75%. Contra a tese: dois votos já pediram alta (Cook e Hammack).",
          fonte: { nome: "Yahoo Finance", url: "https://finance.yahoo.com/economy/policy/articles/fed-holds-rates-two-officials-183144303.html" },
        },
      ],
      invalida:
        "Emprego de outubro (6 nov) forte ou núcleo da inflação (10 nov) acima de 0,4% no mês. Se os dois vierem quentes, a chance de não mudar some — a perda é o 1% da carteira.",
    },
  ],

  evitar: [
    {
      ativo: "GOOGL",
      porque: "Não comprar a queda ainda. Errou receita e busca, e queimou caixa: depois de surpresa ruim, a ação costuma seguir fraca por semanas (o mesmo drift, ao contrário).",
    },
    {
      ativo: "AAPL",
      porque: "Divulga na segunda depois do fechamento — entrar na abertura de segunda é cara ou coroa com custo. Primeira teleconferência do John Ternus como CEO.",
    },
    {
      ativo: "BTC",
      porque: "Os ETFs voltaram a comprar (+US$ 286 mi em dois dias), mas Fed querendo subir juro e a lei cripto travada no Senado tiram a vantagem. Volta à mesa acima de US$ 85 mil.",
    },
    {
      ativo: "TLT",
      porque: "O juro longo pode cair com o emprego fraco, mas petróleo a US$ 100 empurra pro outro lado. Sem vantagem clara — e ia brigar com a ideia de energia.",
    },
    {
      ativo: "IWM",
      porque: "Empresa pequena é a que mais sofre com juro a 5% e alta do Fed. Pode subir no alívio pós-eleição, mas o risco é desproporcional.",
    },
  ],

  agenda: [
    { dia: "2026-10-29", hora: "depois do fechamento", oque: "Amazon divulga o trimestre", porque: "AWS e o investimento de 2026: decide a ideia de chips antes mesmo de ela começar.", peso: 3 },
    { dia: "2026-11-02", hora: "10h", oque: "ISM da indústria (out)", porque: "Primeiro dado do mês sobre a economia real.", peso: 1 },
    { dia: "2026-11-02", hora: "depois do fechamento", oque: "Apple e Palantir divulgam resultado", porque: "Apple: primeira teleconferência do John Ternus como CEO; ~9 dias de iPhone 18 Pro no trimestre.", peso: 3 },
    { dia: "2026-11-03", oque: "Eleição de meio de mandato", porque: "Câmara, um terço do Senado e governadores. Apuração entra pela madrugada.", peso: 3 },
    { dia: "2026-11-04", oque: "O mercado digere a eleição", porque: "Se o Senado virar, Fed e nomeações entram no preço; o VIX costuma cair quando a dúvida acaba.", peso: 2 },
    { dia: "2026-11-06", hora: "8h30", oque: "Relatório de emprego (out)", porque: "Depois de +29 mil em setembro, decide se o Fed sobe em dezembro.", peso: 3 },
    { dia: "2026-11-10", hora: "8h30", oque: "Inflação CPI (out)", porque: "O núcleo é o que importa pra aposta do Fed.", peso: 3 },
    { dia: "2026-12-09", oque: "Decisão do Fed", porque: "Alta precificada entre 75% e 82%.", peso: 3 },
    { dia: "2026-12-11", oque: "Acaba o orçamento provisório", porque: "Sem acordo, paralisação do governo em pleno fim de ano.", peso: 2 },
  ],

  apostas: [
    {
      pergunta: "Democratas levam a Câmara",
      casa: "Polymarket",
      fonte: { nome: "Polymarket", url: "https://polymarket.com/predictions/midterms" },
      prob: 0.92,
      leitura: "Dado como certo: o preço já está na bolsa.",
    },
    {
      pergunta: "Democratas levam o Senado",
      casa: "Polymarket",
      fonte: { nome: "Polymarket", url: "https://polymarket.com/event/balance-of-power-2026-midterms" },
      prob: 0.65,
      antes: { prob: 0.33, quando: "jan" },
      leitura: "Virou em 2026 — e é o que ainda não está no preço. Senado decide nomeações, inclusive do Fed.",
    },
    {
      pergunta: "Fed sobe o juro em dezembro",
      casa: "Polymarket",
      fonte: { nome: "Yahoo Finance", url: "https://finance.yahoo.com/economy/policy/articles/fed-holds-rates-two-officials-183144303.html" },
      prob: 0.82,
      antes: { prob: 0.77, quando: "antes da reunião" },
      leitura: "Subiu com a reunião. No Kalshi está em ~75%. A ideia do Fed aposta contra.",
    },
    {
      pergunta: "Ormuz com tráfego normal até 31 dez",
      casa: "Polymarket",
      fonte: { nome: "Rio Times", url: "https://www.riotimesonline.com/iran-ceasefire-odds-drop-17-points-in-a-day" },
      prob: 0.12,
      leitura: "Ninguém aposta em paz rápida: sustenta o petróleo e a ideia de energia.",
    },
    {
      pergunta: "Lei cripto (CLARITY) sancionada em 2026",
      casa: "Polymarket",
      fonte: { nome: "The Defiant", url: "https://thedefiant.io/news/regulation/senate-blocks-clarity-act-49-50-with-no-democratic-votes-to-proceed" },
      prob: 0.07,
      antes: { prob: 0.31, quando: "14 set" },
      leitura: "Morreu no Senado em 15 set (49–50). Com Senado democrata, piora.",
    },
  ],

  congresso: [
    {
      nome: "Eleição de meio de mandato",
      situacao: "Terça, 3 nov. Toda a Câmara e um terço do Senado.",
      quando: "2026-11-03",
      afeta: "Tudo. Governo dividido costuma travar lei nova — gasto e corte de imposto inclusos.",
      fonte: { nome: "CNBC", url: "https://www.cnbc.com/2026/10/27/2026-midterms-prediction-markets-democrats-congress.html" },
    },
    {
      nome: "Orçamento provisório (H.R. 6500)",
      situacao: "Sancionado em 2 set; financia o governo até 11 dez. O Congresso que sai da eleição decide o resto.",
      quando: "2026-12-11",
      afeta: "Defesa e fornecedores do governo; risco de paralisação no fim do ano. Trump quer mais defesa e mudança na administração eleitoral.",
      fonte: { nome: "Holland & Knight", url: "https://www.hklaw.com/en/insights/publications/2026/10/beyond-the-midterms-congress-faces-converging-year-end-deadlines" },
    },
    {
      nome: "CLARITY Act (H.R. 3633) — regra do mercado cripto",
      situacao: "Barrado no Senado em 15 set (49–50, precisava de 60). Pode voltar à pauta, mas o calendário acabou.",
      afeta: "Coinbase, Robinhood e cripto em geral.",
      fonte: { nome: "The Defiant", url: "https://thedefiant.io/news/regulation/senate-blocks-clarity-act-49-50-with-no-democratic-votes-to-proceed" },
    },
  ],
};
