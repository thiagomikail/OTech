import type { Edicao } from "../tipos";

/**
 * Escrita na manhã de segunda, 9 nov 2026, antes da abertura — depois da
 * semana em que os democratas levaram o Congresso, o chip teve o pior dia
 * desde 2020 e o petróleo perdeu o prêmio de guerra. Primeira edição com a
 * confiança calculada (`criteriosDe`). Sem cotação no container: os números
 * do termômetro vêm das reportagens do fechamento de sexta, 6 nov.
 */
export const edicao: Edicao = {
  semana: "2026-11-09",
  publicadaEm: "2026-11-09T11:46:57Z",
  manchete: "Depois do tombo do chip: inflação na terça, Nvidia no dia 17",
  leitura:
    "Os democratas levaram Câmara e Senado, e o mercado leu a vitória como freio nos data centers: na quinta (5 nov) a Nasdaq caiu 5,5%, o pior dia em 19 meses, e o SMH perdeu 11% num pregão só. " +
    "Na sexta veio o emprego forte (+165 mil, desemprego em 4,1%) e a chance de alta do Fed em dezembro voltou a ~77%. O petróleo caiu ~13% na semana com o Trump sinalizando paz com o Irã. " +
    "A semana tem a inflação de outubro na terça — a última antes do Fed — e balanços de data center (CoreWeave, Cisco, Applied Materials). " +
    "Postura defensiva: três ideias pequenas, uma delas de baixa, e a aposta no chip só com trava.",
  postura: "defensiva",

  termometro: [
    { simbolo: "^GSPC", nome: "S&P 500", valor: 7376.86, unidade: "pts", leitura: "−2,7% na semana: a pior desde abril de 2025. Uns 5% abaixo do recorde de outubro." },
    { simbolo: "^IXIC", nome: "Nasdaq", valor: 24579.42, unidade: "pts", leitura: "Em correção depois da quinta (−5,5%). Repicou +1,1% na sexta." },
    { simbolo: "^TNX", nome: "Juro de 10 anos", valor: 4.86, unidade: "%", leitura: "Recuou de 5% com a fuga pra Treasury, e voltou a subir com o emprego de sexta." },
    { simbolo: "^VIX", nome: "VIX (medo)", valor: 25.64, unidade: "pts", leitura: "Saltou 70% na quinta, pra 28. Acima de 25 o mercado ainda paga caro por proteção." },
    { simbolo: "CL=F", nome: "Petróleo WTI", valor: 91, unidade: "US$", leitura: "De US$ 102,75 na segunda a US$ 86,65 na quinta: a eleição tirou o prêmio de guerra. Os ataques em Ormuz continuam." },
    { simbolo: "GC=F", nome: "Ouro", valor: 4074.9, unidade: "US$", leitura: "Subiu na semana enquanto a bolsa caía. Ainda ~12% abaixo do topo de agosto." },
    { simbolo: "BTC-USD", nome: "Bitcoin", valor: 75800, unidade: "US$", leitura: "Abaixo de US$ 76 mil, com os ETFs perdendo US$ 1,28 bi na semana." },
    { simbolo: "DX-Y.NYB", nome: "Dólar (DXY)", valor: 102.3, unidade: "pts", leitura: "Firme de novo com o emprego forte e o Fed perto de subir." },
  ],

  ideias: [
    {
      id: "2026-11-09-smh-trava",
      instrumento: "opcao",
      ativo: "SMH",
      nome: "VanEck Semiconductor ETF",
      titulo: "Trava de alta no chip até 18 dez, passando pela Nvidia",
      tese:
        "O chip perdeu ~20% numa semana por medo de lei que ainda não existe: o Congresso novo só toma posse em janeiro, e qualquer lei precisa da sanção do Trump. A Nvidia divulga em 17 nov com guia de US$ 108 bi. Trava, porque o medo pode durar mais que o prazo.",
      direcao: "alta",
      horizonte: "mes",
      vence: "2026-12-18",
      estrutura: "trava",
      strikes: [0, 8],
      custo: 3,
      montagem:
        "Comprar a call de SMH de 18 dez no dinheiro e vender a call de 18 dez ~8% acima. Débito estimado ~3% do preço do SMH (a volatilidade está alta, a trava sai mais cara que a de costume); ganho máximo ~165%.",
      tamanho: 2,
      confianca: 4,
      catalisador: { dia: "2026-11-17", oque: "Nvidia divulga o trimestre, depois do fechamento" },
      bases: [
        {
          tipo: "resultado",
          texto: "A própria Nvidia guiou US$ 108 bi de receita no trimestre (±2%) e margem bruta de 74%. O consenso está em US$ 108,8 bi.",
          fonte: { nome: "MarketBeat", url: "https://www.marketbeat.com/earnings/reports/2026-11-17-nvidia-co-stock/" },
        },
        {
          tipo: "noticia",
          texto: "Nenhuma regra nova foi aprovada: a queda precificou propostas — moratória de data center (contestada até entre democratas) e conta de luz cobrada das big techs.",
          fonte: { nome: "TechCrunch", url: "https://techcrunch.com/2026/11/04/after-the-midterms-a-bigger-clash-over-data-centers-could-be-coming/" },
        },
        {
          tipo: "historico",
          texto: "Desde 1985, um mês depois de um dia de −5% na Nasdaq-100 o índice estava mais alto em pouco mais da metade das vezes. É quase cara ou coroa em 1 mês; melhora em 3 a 6 meses.",
          fonte: { nome: "The Trading Tools", url: "https://thetradingtools.substack.com/p/the-nasdaq-100-is-down-more-than" },
        },
        {
          tipo: "noticia",
          texto: "Na sexta o SMH já repicou ~3,5%, com a TSMC subindo 6% num relato de que pode fabricar memória pra Nvidia.",
          fonte: { nome: "24/7 Wall St.", url: "https://247wallst.com/investing/2026/11/07/tsmc-jumped-6-on-a-report-it-could-make-memory-chips-for-nvidia" },
        },
      ],
      contra: [
        "A própria Microsoft saiu de três projetos de data center da Nscale e desfez um aluguel de capacidade com a Oracle: sinal de que quem compra chip pode estar freando.",
        "Correções da Nasdaq na última década costumaram ter mais um mês de venda antes da recuperação (CNBC).",
        "Inflação quente na terça confirma alta do Fed em dezembro, e chip é o primeiro a sofrer com juro.",
        "A Intel guiou mal na semana: não é só política.",
      ],
      invalida:
        "Nvidia guiando abaixo de US$ 108 bi em 17 nov, ou uma moratória federal de data center ganhando votos dos dois partidos. Não tem stop: o máximo que se perde é o débito (2% da carteira).",
    },
    {
      id: "2026-11-09-gld",
      instrumento: "etf",
      ativo: "GLD",
      nome: "SPDR Gold Shares",
      titulo: "Ouro como contrapeso do chip",
      tese:
        "O ouro subiu na semana em que a bolsa teve a pior queda desde abril de 2025, e os bancos centrais compram no ritmo mais forte desde o fim de 2024. Com o GLD ainda ~12% abaixo do topo de agosto, há espaço — e ele protege a trava do chip.",
      direcao: "alta",
      horizonte: "mes",
      vence: "2026-12-04",
      alvo: 6,
      stop: 4,
      tamanho: 3,
      confianca: 2,
      catalisador: { dia: "2026-11-10", oque: "Inflação CPI de outubro, 8h30" },
      bases: [
        {
          tipo: "fluxo",
          texto: "Terceiro trimestre: ETFs de ouro receberam 211 t (recorde de 4.256 t guardadas) e bancos centrais compraram 321 t, o maior ritmo desde o fim de 2024 (World Gold Council).",
          fonte: { nome: "Seeking Alpha (WGC)", url: "https://seekingalpha.com/article/4962031-gold-demand-trends-q3-2026" },
        },
        {
          tipo: "noticia",
          texto: "O contrato de dezembro fechou a sexta em US$ 4.074,90, depois de subir na semana do tombo da bolsa; caiu ~1% no dia só pelo dólar e o juro do emprego forte.",
          fonte: { nome: "Fortune", url: "https://fortune.com/article/current-price-of-gold-11-06-2026/" },
        },
      ],
      contra: [
        "Alta do Fed em dezembro (~77%) e dólar firme são o pior cenário pro ouro, que não paga juro.",
        "O GLD está −5,4% no ano apesar das entradas: o fluxo não virou preço até agora.",
        "Paz com o Irã tira o prêmio de risco geopolítico, o mesmo que derrubou o petróleo.",
      ],
      invalida:
        "Núcleo da inflação de terça em 0,4% ou mais com o juro de 10 anos voltando a 5%: aí o custo de segurar ouro sobe e a tese de abrigo perde pra renda fixa. Stop de 4%.",
    },
    {
      id: "2026-11-09-btc",
      instrumento: "cripto",
      ativo: "BTC-USD",
      nome: "Bitcoin",
      titulo: "Bitcoin de baixa enquanto os ETFs vendem",
      tese:
        "Os ETFs de bitcoin tiveram a pior semana de saída desde junho, e o ano virou negativo. Com o Fed perto de subir e o suporte de US$ 74,4 mil sendo testado, o caminho de menor resistência na semana é pra baixo. Pequena e curta.",
      direcao: "baixa",
      horizonte: "semana",
      vence: "2026-11-13",
      alvo: 6,
      stop: 4,
      tamanho: 2,
      confianca: 3,
      catalisador: { dia: "2026-11-10", oque: "Inflação CPI de outubro, 8h30" },
      bases: [
        {
          tipo: "fluxo",
          texto: "−US$ 1,28 bi nos ETFs de bitcoin na semana de 2 a 6 nov, a maior saída desde junho; o IBIT respondeu por US$ 1,21 bi. O saldo de 2026 virou negativo (−US$ 914 mi).",
          fonte: { nome: "The Crypto Times", url: "https://www.cryptotimes.io/2026/11/07/bitcoin-etfs-record-1-28b-in-weekly-outflows-ethereum-loses-365m/" },
        },
        {
          tipo: "dado",
          texto: "Emprego de outubro +165 mil (esperavam ~60 mil): a chance de alta do Fed em 9 dez foi a ~77%. Juro subindo é o que mais pesa em cripto.",
          fonte: { nome: "Webull", url: "https://www.webull.com/news/15883683924537344" },
        },
        {
          tipo: "noticia",
          texto: "O preço está testando o suporte de ~US$ 74,4 mil, abaixo do custo médio de quem comprou pelos ETFs.",
          fonte: { nome: "crypto.news", url: "https://crypto.news/bitcoin-price-prediction-is-btc-headed-below-74400-support/" },
        },
      ],
      contra: [
        "Abaixo do custo médio dos ETFs, muita gente já vendeu: repique de alívio é comum nesse nível.",
        "O FBTC, da Fidelity, teve entrada na mesma semana — a saída está concentrada no IBIT.",
        "Inflação fria na terça derruba a chance de alta do Fed e pode virar o jogo num dia.",
      ],
      invalida:
        "Os ETFs voltando a comprar dois dias seguidos, ou bitcoin fechando acima de US$ 79 mil. Stop de 4% acima da entrada.",
    },
  ],

  evitar: [
    {
      ativo: "XLE",
      porque: "A ideia de energia da semana passada bateu no stop. Agora é cara ou coroa: o Trump fala em acordo, mas os ataques em Ormuz seguem em ritmo quase recorde e a Rapidan dá 80% pra luta voltar. Sem vantagem pra nenhum lado.",
    },
    {
      ativo: "TTWO",
      porque: "Divulga hoje depois do fechamento, a 10 dias do GTA VI (19 nov). Entrar na abertura é apostar no balanço, sem vantagem.",
    },
    {
      ativo: "CEG",
      porque: "Constellation divulga hoje antes da abertura, e energia pra data center está no centro das propostas democratas (conta de luz cobrada das big techs). Dois riscos de evento no mesmo dia.",
    },
    {
      ativo: "TLT",
      porque: "O juro longo caiu com a fuga da bolsa, mas emprego forte e Fed querendo subir puxam pro outro lado. A inflação de terça decide — sem vantagem antes dela.",
    },
    {
      ativo: "AMD",
      porque: "Caiu 17% num dia. Comprar a queda de um nome só, no setor do medo, é tamanho errado pro perfil: a exposição ao chip vai pela trava do SMH.",
    },
  ],

  agenda: [
    { dia: "2026-11-09", hora: "antes da abertura", oque: "Constellation Energy, KKR e Barrick divulgam", porque: "Constellation é o termômetro da demanda de energia dos data centers.", peso: 2 },
    { dia: "2026-11-09", hora: "depois do fechamento", oque: "Occidental, Take-Two e Rocket Lab divulgam", porque: "Take-Two a 10 dias do GTA VI; Occidental com o petróleo a US$ 91.", peso: 1 },
    { dia: "2026-11-10", hora: "8h30", oque: "Inflação CPI (out)", porque: "Última antes do Fed. Esperam núcleo de 0,2% a 0,3% no mês; 0,3% ou mais reforça a alta de dezembro. Sem taxa anual oficial desta vez.", peso: 3 },
    { dia: "2026-11-10", hora: "depois do fechamento", oque: "CoreWeave divulga", porque: "Aluguel de capacidade de IA: o primeiro data center a falar depois da eleição.", peso: 2 },
    { dia: "2026-11-11", oque: "Veterans Day", porque: "Mercado de títulos fechado; a bolsa abre normal.", peso: 1 },
    { dia: "2026-11-12", hora: "depois do fechamento", oque: "Cisco e Applied Materials divulgam", porque: "Rede e máquina de fazer chip: dizem se o pedido de data center freou.", peso: 3 },
    { dia: "2026-11-13", hora: "8h30", oque: "Inflação ao produtor PPI (out)", porque: "Completa o quadro da inflação antes do Fed.", peso: 2 },
    { dia: "2026-11-17", hora: "depois do fechamento", oque: "Nvidia divulga", porque: "Guia de US$ 108 bi. Decide a trava do chip.", peso: 3 },
    { dia: "2026-12-09", oque: "Decisão do Fed", porque: "Alta precificada em ~77%.", peso: 3 },
    { dia: "2026-12-11", oque: "Acaba o orçamento provisório", porque: "O Congresso que sai precisa de outro provisório; a briga é o orçamento de defesa.", peso: 2 },
  ],

  apostas: [
    {
      pergunta: "Fed sobe o juro em dezembro",
      casa: "Kalshi",
      fonte: { nome: "DeFi Rate", url: "https://defirate.com/odds/fed-decision/" },
      prob: 0.77,
      antes: { prob: 0.75, quando: "28 out" },
      leitura: "Quase parado na semana, mas agora com o emprego forte por trás. A ideia contrária da semana passada (Fed mantém, a 0,24) depende da inflação de terça.",
    },
    {
      pergunta: "EUA encerram o bloqueio naval ao Irã até 31 dez",
      casa: "Polymarket",
      fonte: { nome: "ScanX", url: "https://scanx.trade/stock-market-news/global/warren-cites-tools-end-iran-war-polymarket-sees-68-odds-march/55739583" },
      prob: 0.36,
      leitura: "Até 31 mar sobe pra 68%. O mercado acredita em fim da guerra, mas não neste ano — o petróleo caiu mais rápido que essa conta.",
    },
    {
      pergunta: "Acordo nuclear EUA–Irã em 2027",
      casa: "Kalshi",
      fonte: { nome: "ScanX", url: "https://scanx.trade/stock-market-news/global/warren-cites-tools-end-iran-war-polymarket-sees-68-odds-march/55739583" },
      prob: 0.39,
      leitura: "Bem abaixo do que se via no começo do ano: paz duradoura ainda é minoria.",
    },
  ],

  congresso: [
    {
      nome: "Sessão de fim de mandato (lame duck)",
      situacao: "Volta hoje. Orçamento provisório até 11 dez, lei de defesa (NDAA), farm bill vencida e a FISA 702 parada desde junho.",
      quando: "2026-12-11",
      afeta: "Defesa: o governo quer US$ 1,5 tri e os democratas do Senado recusam. O mais provável é mais um provisório, até fevereiro ou março.",
      fonte: { nome: "No Labels", url: "https://nolabels.org/the-latest/the-2026-lame-duck-session-what-congress-still-has-to-pass-after-the-midterms/" },
    },
    {
      nome: "Regras pra data center",
      situacao: "Propostas, não lei: conta de luz cobrada das big techs, moratória nacional (contestada até entre democratas), e governadores eleitos no Texas e em Ohio prometendo condições. O Congresso novo assume em janeiro.",
      afeta: "Chip, operadores de data center e geradoras de energia — o setor que mais caiu na semana.",
      fonte: { nome: "Fortune", url: "https://fortune.com/2026/11/04/democrats-midterm-election-2026-anti-data-center-governors-texas-georgia-ohio-ai-infrastructure-big-tech-spending-moratorium-regulations/" },
    },
    {
      nome: "Impeachment do secretário de Defesa (Hegseth)",
      situacao: "A Câmara pode votar esta semana.",
      afeta: "Pouco efeito direto no mercado; pesa na briga do orçamento de defesa.",
      fonte: { nome: "Yahoo News", url: "https://www.yahoo.com/news/politics/live/midterms-2026-live-updates-election-day-voters-head-to-the-polls-as-democrats-look-to-flip-gop-control-of-the-house-and-senate-110000715.html" },
    },
  ],

  revisao:
    "A estreia apanhou da eleição. Chip (SMH): o SMH perdeu ~20% até quinta, e o stop de 3% foi atingido logo — a tese de que o gasto da Alphabet é receita do chip pode até estar certa, mas o \"o que mata\" que escrevi (Amazon cortando investimento, juro acima de 5,2%) não previa o risco político no dia da eleição. " +
    "Energia (XLE): o XLE caiu ~12% em quatro pregões desde 30 out e o stop de 5% foi atingido. Errei o lado da eleição: ela tirou o prêmio de guerra em vez de pôr. A invalidação escrita — diplomacia — foi exatamente o que aconteceu, e o stop funcionou. " +
    "Microsoft: semana de montanha-russa (−2,8% na segunda, recorde de US$ 555,80 na quarta, −3,6% na quinta) e fechou a sexta a US$ 530,61; se a máxima de quarta tocou o alvo de +7%, a tela mostra com o preço de verdade. " +
    "A trava do S&P está abaixo do strike comprado, com o índice a 7.377, e segue até 18 dez; o Fed em dezembro segue aberto, mas o emprego forte enfraqueceu a tese contrária. " +
    "O que muda no método: (1) evento de risco dentro da janela — eleição, balanço, decisão — corta o tamanho do setor mais exposto a ele; (2) três das cinco ideias eram a mesma aposta em IA e bolsa americana, e caíram juntas — agora as ideias se contrapesam (chip na trava, ouro, bitcoin de baixa); (3) a confiança deixou de ser opinião e virou conta.",
};
