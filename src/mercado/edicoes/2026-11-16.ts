import type { Edicao } from "../tipos";

/**
 * Escrita na manhã de segunda, 16 nov 2026, antes da abertura — depois da
 * inflação quente de outubro, do juro de 10 anos acima de 5% e da saída do
 * Jensen Huang da Nvidia, que divulga o trimestre amanhã. Sem cotação no
 * container: os números do termômetro vêm das reportagens de sexta, 13 nov.
 */
export const edicao: Edicao = {
  semana: "2026-11-16",
  publicadaEm: "2026-11-16T11:45:33Z",
  manchete: "Juro a 5%, a Nvidia sem o Huang e a Anthropic na bolsa",
  leitura:
    "A inflação de outubro veio quente (núcleo +0,3% pelo terceiro mês), o juro de 10 anos passou de 5% e a alta do Fed em 9 dez virou certeza (~91%); já há quem fale em meio ponto. " +
    "Mesmo assim o S&P subiu 2,5% na semana, com o chip fora da Nvidia em alta forte. A Nvidia perdeu ~13% com a saída do Jensen Huang e divulga amanhã, com as opções pagando por um movimento de 7% a 10%. " +
    "Na quarta sai a ata do Fed e, na quinta, a Anthropic estreia na Nasdaq. " +
    "Postura defensiva: juro longo pra quando o Fed parar, um seguro de baixa na Nasdaq e energia de baixa com o excesso de petróleo.",
  postura: "defensiva",

  termometro: [
    { simbolo: "^GSPC", nome: "S&P 500", valor: 7561.67, unidade: "pts", leitura: "+2,5% na semana: quebrou quatro semanas de queda, mesmo com a inflação quente." },
    { simbolo: "^IXIC", nome: "Nasdaq", valor: 25136.27, unidade: "pts", leitura: "+2,3% na semana, puxado por AMD e Broadcom; a Nvidia foi o peso." },
    { simbolo: "^TNX", nome: "Juro de 10 anos", valor: 5.15, unidade: "%", leitura: "Subiu ~30 pontos na semana. A máxima de 52 semanas é 5,31%, de 5 out." },
    { simbolo: "^VIX", nome: "VIX (medo)", valor: 18.7, unidade: "pts", leitura: "Voltou abaixo de 20 depois do susto de 5 nov. Barato pra quem quer seguro antes da Nvidia." },
    { simbolo: "CL=F", nome: "Petróleo WTI", valor: 88.56, unidade: "US$", leitura: "Segunda semana de queda: a IEA vê o mercado voltando ao excesso de oferta." },
    { simbolo: "GC=F", nome: "Ouro", valor: 3920, unidade: "US$", leitura: "Abaixo de US$ 4 mil, a mínima em mais de um ano: juro acima de 5% pesa." },
    { simbolo: "BTC-USD", nome: "Bitcoin", valor: 65000, unidade: "US$", leitura: "−12,7% na semana, abaixo da média de 200 semanas; índice de medo em 10." },
    { simbolo: "DX-Y.NYB", nome: "Dólar (DXY)", valor: 103.19, unidade: "pts", leitura: "Na máxima do ano, empurrado pelo Fed." },
  ],

  ideias: [
    {
      id: "2026-11-16-tlt",
      instrumento: "etf",
      ativo: "TLT",
      nome: "iShares 20+ Year Treasury Bond ETF",
      titulo: "Título longo pra quando o Fed parar",
      tese:
        "Com o 10 anos a 5,15% e a alta de dezembro dada como certa, a notícia ruim já está no preço. Historicamente, o título longo rende bem nos meses depois da última alta do ciclo — a aposta é que dezembro esteja perto dela.",
      direcao: "alta",
      horizonte: "mes",
      vence: "2026-12-11",
      alvo: 6,
      stop: 4,
      tamanho: 3,
      confianca: 4,
      catalisador: { dia: "2026-11-18", oque: "Ata da reunião de outubro do Fed, 14h" },
      bases: [
        {
          tipo: "historico",
          texto: "Nos seis meses depois do pico do juro do Fed, Treasuries de 10 anos ou mais renderam em média +10% (contra +3,7% dos curtos). O J.P. Morgan acha retorno positivo do 10 anos no fim de todo ciclo de alta dos últimos 40 anos.",
          fonte: { nome: "Advisor Perspectives", url: "https://www.advisorperspectives.com/articles/2023/07/17/its-time-to-buy-long-term-bonds-as-peak-rates-near" },
        },
        {
          tipo: "previsao",
          texto: "Kalshi e Polymarket dão ~91% pra alta de 0,25 em 9 dez; manter caiu pra ~3%. O que o Fed vai fazer já está no preço.",
          fonte: { nome: "DeFi Rate", url: "https://defirate.com/prediction-markets/fed-decision-odds/" },
        },
        {
          tipo: "noticia",
          texto: "O 10 anos fechou a sexta (13 nov) em 5,15%, com o de 30 anos em 5,47%. A máxima de 52 semanas é 5,31%, de 5 out.",
          fonte: { nome: "Stockinsky", url: "https://stockinsky.com/rates/us" },
        },
      ],
      contra: [
        "O núcleo da inflação subiu 0,3% pelo terceiro mês seguido, e o atacado (PPI) está em +6,5% no ano: pode não ser a última alta.",
        "O meio ponto em dezembro foi de 5,5% pra ~12% nos mercados de previsão depois do CPI; o Waller disse que o consideraria.",
        "Só se sabe que foi a última alta depois que ela passa — o padrão histórico depende disso.",
        "O dólar na máxima do ano e o governo financiando déficit com título longo pesam na mesma direção.",
      ],
      invalida:
        "O 10 anos fechando acima de 5,31% (a máxima de 52 semanas), ou a ata e o Warsh falando em mais de uma alta. Stop de 4%.",
    },
    {
      id: "2026-11-16-qqq-trava",
      instrumento: "opcao",
      ativo: "QQQ",
      nome: "Invesco QQQ (Nasdaq-100)",
      titulo: "Seguro de baixa na Nasdaq passando pela Nvidia",
      tese:
        "A Nvidia é ~9% da Nasdaq-100, divulga amanhã sem o CEO que a construiu, e o juro de 10 anos acima de 5% encarece toda ação de crescimento. Trava de baixa, pequena: protege a trava de alta do chip (9 nov) se o balanço decepcionar.",
      direcao: "baixa",
      horizonte: "mes",
      vence: "2026-12-18",
      estrutura: "trava",
      strikes: [0, -5],
      custo: 2.2,
      montagem:
        "Comprar a put de QQQ de 18 dez no dinheiro e vender a put de 18 dez ~5% abaixo. Débito estimado ~2,2% do preço do QQQ; ganho máximo ~125%.",
      tamanho: 2,
      confianca: 3,
      catalisador: { dia: "2026-11-17", oque: "Nvidia divulga o trimestre, depois do fechamento" },
      bases: [
        {
          tipo: "noticia",
          texto: "O Jensen Huang renunciou em 12 nov; a Nvidia perdeu ~US$ 573 bi na semana, a maior queda semanal de valor da história, e fechou abaixo de US$ 4 tri.",
          fonte: { nome: "BusinessDay", url: "https://businessday.ng/companies/article/nvidia-loses-1-8tn-in-market-value-as-shares-fall-below-4trn/" },
        },
        {
          tipo: "dado",
          texto: "Inflação de outubro: +0,4% no mês, núcleo +0,3% contra 0,2% esperado — o terceiro mês seguido nesse ritmo.",
          fonte: { nome: "CNBC", url: "https://www.cnbc.com/2026/11/10/cpi-inflation-report-october-2026.html" },
        },
        {
          tipo: "fluxo",
          texto: "As opções da Nvidia pagam por um movimento de ~9% no balanço, o maior antes de um resultado desde agosto de 2024.",
          fonte: { nome: "Benzinga", url: "https://www.benzinga.com/opinion/26/11/63240720/options-traders-expect-nvidia-biggest-earnings-move-since-2024" },
        },
      ],
      contra: [
        "O S&P subiu 2,5% na semana e quebrou quatro semanas de queda: o mercado absorveu a inflação quente.",
        "Fora da Nvidia o chip subiu forte (AMD e Broadcom +18% na semana): a queda dela pode ficar isolada.",
        "A procura de ~6 vezes as ações oferecidas no IPO da Anthropic mostra apetite por IA.",
        "Fica no lado oposto da trava de alta do SMH (9 nov): juntas, são um seguro, não duas apostas.",
      ],
      invalida:
        "Nvidia batendo o guia de US$ 108 bi com um sucessor de peso anunciado, e a Nasdaq-100 subindo na quarta. Não tem stop: o máximo que se perde é o débito (2% da carteira).",
    },
    {
      id: "2026-11-16-xle",
      instrumento: "etf",
      ativo: "XLE",
      nome: "Energy Select Sector SPDR",
      titulo: "Energia de baixa com o petróleo sobrando",
      tese:
        "A IEA vê o mercado de petróleo voltando ao excesso de oferta neste trimestre e um excesso maior em 2027, com o Golfo exportando de novo. O petróleo caiu duas semanas seguidas; as ações de energia ainda não acompanharam.",
      direcao: "baixa",
      horizonte: "mes",
      vence: "2026-12-11",
      alvo: 7,
      stop: 5,
      tamanho: 2,
      confianca: 2,
      catalisador: { dia: "2026-11-18", oque: "Estoques semanais de petróleo (EIA), 10h30" },
      bases: [
        {
          tipo: "dado",
          texto: "Relatório da IEA de 13 nov: excesso de oferta de volta no 4º trimestre e de ~3,8 milhões de barris por dia em 2027, com as exportações do Golfo se recuperando.",
          fonte: { nome: "CP24", url: "https://www.cp24.com/news/money/2026/11/13/world-oil-market-is-returning-to-surplus-as-gulf-exports-recover-iea-says/" },
        },
        {
          tipo: "noticia",
          texto: "Segunda semana de queda do petróleo (WTI a US$ 88,56) com o Trump sinalizando que não quer reiniciar a guerra com o Irã.",
          fonte: { nome: "The National", url: "https://www.thenationalnews.com/business/energy/2026/11/13/oil-on-track-to-post-second-weekly-decline-as-trump-eases-fears-of-renewed-war-with-iran/" },
        },
      ],
      contra: [
        "O setor de energia foi o que mais subiu no S&P na semana (~+5%) mesmo com o petróleo caindo: a tendência é forte, ~+45% no ano.",
        "Os ataques a petroleiros em Ormuz continuam, e um único incidente grave devolve o prêmio de guerra num dia.",
        "A IEA chama o aperto de diesel de 'a preocupação principal': refinaria ganha com isso.",
        "A ideia de energia de alta da estreia (2 nov) bateu no stop do lado oposto: o setor é difícil de ler.",
      ],
      invalida:
        "Petróleo de volta acima de US$ 95, ou um novo ataque dos EUA ao Irã. Stop de 5% acima da entrada.",
    },
  ],

  evitar: [
    {
      ativo: "NVDA",
      porque: "Balanço amanhã sem o CEO, com as opções pagando por 7% a 10% pra qualquer lado. Ação única em evento binário é cara ou coroa; a edição já tem chip comprado (trava do SMH) e vendido (trava do QQQ).",
    },
    {
      ativo: "ANT",
      porque: "IPO da Anthropic (preço na quarta, estreia na quinta): sem histórico de preço e com a procura em ~6 vezes a oferta, a estreia já sai esticada. E esta edição é escrita com o Claude, da Anthropic — conflito de interesse. Fica fora por regra.",
    },
    {
      ativo: "BTC",
      porque: "A ideia de baixa da semana passada já rendeu (−12,7% na semana). Com o índice de medo em 10 e o preço abaixo da média de 200 semanas, o repique de alívio é tão provável quanto mais queda. Sem vantagem.",
    },
    {
      ativo: "GLD",
      porque: "O ouro furou US$ 4 mil com o juro acima de 5% e o dólar na máxima do ano. A ideia da semana passada deve ter batido no stop; voltar exige o juro virar primeiro.",
    },
    {
      ativo: "WMT",
      porque: "Balanço na quinta antes da abertura, com a varejista mais defensiva já no preço de abrigo. Evento binário sem vantagem.",
    },
  ],

  agenda: [
    { dia: "2026-11-16", hora: "12h", oque: "Warsh abre conferência do Fed", porque: "Primeira fala do presidente do Fed depois da inflação quente: diz se meio ponto está na mesa.", peso: 2 },
    { dia: "2026-11-17", hora: "8h30", oque: "Vendas no varejo (out)", porque: "O consumidor antes das festas, com juro subindo.", peso: 2 },
    { dia: "2026-11-17", hora: "depois do fechamento", oque: "Nvidia divulga", porque: "Primeiro balanço sem o Jensen Huang. Decide as duas travas da edição.", peso: 3 },
    { dia: "2026-11-18", hora: "antes da abertura", oque: "Target e Lowe's divulgam", porque: "Consumo e casa com juro de hipoteca alto.", peso: 1 },
    { dia: "2026-11-18", hora: "10h30", oque: "Estoques de petróleo (EIA)", porque: "Confirma ou não o excesso que a IEA vê.", peso: 1 },
    { dia: "2026-11-18", hora: "14h", oque: "Ata da reunião de outubro do Fed", porque: "Quantos já queriam subir em outubro — e se alguém falou em parar depois de dezembro.", peso: 3 },
    { dia: "2026-11-19", hora: "antes da abertura", oque: "Walmart divulga", porque: "O termômetro do consumidor americano.", peso: 2 },
    { dia: "2026-11-19", oque: "Anthropic estreia na Nasdaq (ANT)", porque: "O maior IPO de IA até agora, com preço definido na véspera: mede o apetite por IA depois da Nvidia.", peso: 2 },
    { dia: "2026-12-09", oque: "Decisão do Fed", porque: "Alta de 0,25 em ~91%; meio ponto em ~12%.", peso: 3 },
    { dia: "2026-12-11", oque: "Acaba o orçamento provisório", porque: "Nenhum dos 12 projetos de orçamento virou lei: o caminho é outro provisório.", peso: 2 },
  ],

  apostas: [
    {
      pergunta: "Fed sobe 0,25 em dezembro",
      casa: "Kalshi",
      fonte: { nome: "DeFi Rate", url: "https://defirate.com/prediction-markets/fed-decision-odds/" },
      prob: 0.91,
      antes: { prob: 0.77, quando: "6 nov" },
      leitura: "Virou certeza com a inflação de terça. Manter está em ~3% — a ideia contrária de 2 nov (Fed mantém, a 0,24) está praticamente perdida.",
    },
    {
      pergunta: "Fed sobe 0,50 ou mais em dezembro",
      casa: "Polymarket",
      fonte: { nome: "Prediction Markets Picks", url: "https://predictionmarketspicks.com/articles/october-2026-cpi-fed-half-point-hike-odds-polymarket-us" },
      prob: 0.12,
      antes: { prob: 0.055, quando: "10 nov, antes do CPI" },
      leitura: "Dobrou em uma manhã. É o risco que mais pesa contra a ideia do título longo.",
    },
  ],

  congresso: [
    {
      nome: "Orçamento provisório (até 11 dez)",
      situacao: "Nenhum dos 12 projetos de orçamento de 2027 é lei e o Senado não votou nenhum. O presidente da Comissão de Orçamento da Câmara diz que não dá tempo: outro provisório é o mais provável.",
      quando: "2026-12-11",
      afeta: "Defesa e fornecedores do governo. O risco de paralisação se concentra na última semana.",
      fonte: { nome: "Gov.House", url: "https://gov.house/budget-taxes/december-11-funding-deadline-shutdown/" },
    },
    {
      nome: "Regras pra data center",
      situacao: "Ainda propostas: conta de luz cobrada das big techs e moratória contestada. O Congresso novo assume em janeiro.",
      afeta: "Chip, operadores de data center e geradoras de energia.",
      fonte: { nome: "Fortune", url: "https://fortune.com/2026/11/04/democrats-midterm-election-2026-anti-data-center-governors-texas-georgia-ohio-ai-infrastructure-big-tech-spending-moratorium-regulations/" },
    },
  ],

  revisao:
    "Bitcoin de baixa: o bitcoin caiu ~12,7% na semana, até perto de US$ 62–64 mil no sábado, com os ETFs perdendo mais US$ 1,07 bi — o alvo de 6% foi alcançado bem antes do vencimento de sexta. A tese (saída dos ETFs e Fed subindo) foi exatamente o que aconteceu. " +
    "Ouro: furou US$ 4 mil e fechou perto de US$ 3.920, a mínima em mais de um ano; o GLD deve ter batido o stop de 4%. A invalidação que escrevi — núcleo quente com juro de volta a 5% — foi o que aconteceu: o juro pesou mais que o abrigo. " +
    "Trava do chip (SMH): o chip se dividiu — AMD e Broadcom +18% na semana, Nvidia −13% com a saída do Huang. A trava segue aberta até 18 dez, e o balanço de amanhã decide. " +
    "Das mais antigas: Microsoft segue até 27 nov; a trava do S&P voltou a se aproximar do strike com o índice a 7.562; e a aposta de que o Fed não sobe em dezembro está praticamente perdida (manter a ~3%) — resolve em 9 dez. " +
    "O que muda no método: a tese do ouro era de abrigo contra a bolsa, mas o risco que veio foi juro; ideia de abrigo agora precisa dizer de qual risco protege. E duas ideias de lados opostos no mesmo setor (as travas do SMH e do QQQ) ficam marcadas como seguro, não como convicção.",
};
