/**
 * Como funciona o Mercado — o help/FAQ, como dado.
 *
 * Um arquivo só pros dois sites: o Bancada (`/c/<slug>/mercado/ajuda`) e a
 * vitrine pública da OTech (`/mercado/ajuda/`). Como as edições, ele é cópia
 * IDÊNTICA nos dois repositórios: mudou aqui, copia pra lá. O que só vale num
 * dos sites leva `so`, e cada um filtra o seu.
 *
 * Marcação mínima dentro dos textos: `**negrito**`, `[texto](https://…)` pra
 * fonte, `[texto](#id)` pra outra pergunta e `` `código` ``. Nada de HTML.
 *
 * ⚠️ Este arquivo é PÚBLICO: a cópia dele mora no repositório aberto da OTech,
 * inclusive as perguntas com `so: "bancada"`. Nada de endereço do app, modelo
 * de acesso, servidor do banco ou chave aqui.
 *
 * Regra de escrita: cada resposta descreve o que o CÓDIGO faz hoje
 * (`desfecho.ts`, `precos.ts`, a tela). Mudou a regra, muda a resposta.
 *
 * Arquivo puro: vai pro navegador.
 */

export type Site = "bancada" | "otech";

/**
 * Um parágrafo, uma lista de itens curtos, ou um fluxo: passos em ordem,
 * desenhados como caixas ligadas por seta.
 */
export type Bloco = string | { lista: string[] } | { fluxo: { titulo: string; texto: string }[] };

export type Pergunta = {
  /** Âncora da pergunta: `#entrada` leva direto pra ela. Único no arquivo inteiro. */
  id: string;
  pergunta: string;
  resposta: Bloco[];
  /** Só aparece neste site. Sem `so`, aparece nos dois. */
  so?: Site;
};

export type Secao = {
  id: string;
  titulo: string;
  resumo: string;
  perguntas: Pergunta[];
};

export const AJUDA: Secao[] = [
  {
    id: "o-que-e",
    titulo: "O que é o Mercado",
    resumo: "Pra que serve, quem escreve e o que ele não é.",
    perguntas: [
      {
        id: "o-que-e-o-mercado",
        pergunta: "O que é o Mercado?",
        resposta: [
          "Um painel semanal de ideias de investimento. Toda segunda, antes de a bolsa de Nova York abrir, sai uma **edição** com três a seis ideias — ação, ETF, opção, cripto ou mercado de previsão — e o contexto que levou a elas.",
          "Cada ideia diz **o que comprar ou apostar contra, até quando, com quanto do dinheiro, onde sair no lucro (alvo) e onde sair no prejuízo (stop)**, além das bases com fonte e do que mataria a tese.",
          "Embaixo, o **registro de acertos** mede todas as ideias já publicadas pelas mesmas regras e compara cada uma com o S&P 500 no mesmo período. As que deram errado ficam lá.",
        ],
      },
      {
        id: "e-recomendacao",
        pergunta: "Isto é recomendação de investimento?",
        resposta: [
          "**Não é recomendação personalizada.** É pesquisa e opinião, escritas sem conhecer a sua renda, os seus objetivos, o seu prazo ou o quanto você aguenta perder.",
          "Nada aqui executa ordem: o Mercado não fala com corretora. Toda decisão — e todo resultado — é de quem lê. Se for pôr dinheiro de verdade, compare com outras fontes e, se puder, converse com um profissional registrado.",
        ],
      },
      {
        id: "quem-escreve",
        pergunta: "Quem escreve as ideias?",
        resposta: [
          "Uma **sessão de pesquisa automatizada, feita por IA (Claude, da Anthropic)**, agendada pra toda segunda às 6h40 de Nova York. Ela pesquisa notícias, balanços, dados econômicos, chances nos mercados de previsão e o que o Congresso americano vota; escreve a edição seguindo um roteiro fixo; confere a edição com testes automáticos; e publica.",
          "Ninguém reescreve uma edição depois de publicada ([por quê](#reescrever)). A IA pode errar um número ou ler mal uma notícia — por isso toda base vem com o link da fonte: confira antes de agir.",
        ],
      },
      {
        id: "papel",
        pergunta: "O que quer dizer \"no papel\"?",
        resposta: [
          "Que as ideias são acompanhadas como se o dinheiro tivesse sido posto, mas sem ordem de verdade. A ideia é **juntar um histórico honesto antes de arriscar dinheiro real**: um punhado de semanas não diz se as ideias prestam ([amostra pequena](#amostra)).",
        ],
      },
      {
        id: "perfil",
        pergunta: "Pra que tipo de investidor as ideias são pensadas?",
        resposta: [
          "Perfil **moderado**: no máximo 5% da carteira em cada ideia, stop em toda ideia de preço, opção só de risco definido (a perda máxima é conhecida na entrada) e aposta de previsão sempre pequena. A soma de todas as ideias da semana aparece no topo da lista.",
          "Não tem alavancagem, venda de opção a descoberto nem day trade.",
        ],
      },
      {
        id: "portugues",
        pergunta: "Por que é em português?",
        resposta: ["Porque foi feito pra uma casa de brasileiros que moram nos EUA. Os ativos, os horários e os impostos são os americanos."],
      },
      {
        id: "dois-lugares",
        pergunta: "Por que o Mercado aparece em dois lugares?",
        resposta: [
          "Ele nasceu dentro do **Bancada**, o app da casa, onde cada perfil pode reservar ideias. A **vitrine pública** fica no OT Workbench, em `/mercado/`, sem reserva. As duas telas usam a mesma edição e as mesmas regras de conta.",
        ],
      },
    ],
  },
  {
    id: "edicao",
    titulo: "A edição da semana",
    resumo: "Como ler a página de cima pra baixo.",
    perguntas: [
      {
        id: "quando-sai",
        pergunta: "Quando sai uma edição nova?",
        resposta: [
          "Toda **segunda-feira, por volta das 6h40 de Nova York** (o mesmo horário de Atlanta), antes da abertura das 9h30. A página mostra a edição mais nova; o rótulo do topo diz de que semana ela é e quando foi publicada.",
          "Se algo grande acontecer depois da publicação, a edição pode ganhar um **adendo** — uma nota com data, num quadro destacado logo abaixo da leitura. O adendo nunca muda uma ideia já publicada.",
        ],
      },
      {
        id: "manchete",
        pergunta: "O que são a manchete, a leitura e a postura?",
        resposta: [
          "A **manchete** resume a semana numa frase. A **leitura** explica, em três ou quatro linhas, o que está movendo o mercado.",
          "A **postura** diz quanto risco a edição está tomando:",
          {
            lista: [
              "**Defensiva** — pouco dinheiro nas ideias, preferência por proteção.",
              "**Neutra** — exposição moderada, stops curtos.",
              "**Ofensiva** — mais ideias e mais dinheiro, quando o cenário tem vantagem clara.",
            ],
          },
        ],
      },
      {
        id: "termometro",
        pergunta: "O que é o termômetro?",
        resposta: [
          "Os oito números que importam na semana: **S&P 500, Nasdaq, juro de 10 anos, VIX, petróleo WTI, ouro, bitcoin e dólar (DXY)**.",
          "Cada quadro mostra o último preço, a variação do último pregão, uma linha com o último mês e uma frase da edição sobre por que aquele número importa agora. A linha fica verde se o mês subiu e vermelha se caiu.",
          "Quando o provedor de cotação não responde, o quadro mostra o valor que estava na edição, com o aviso **\"na edição · sem cotação agora\"**. A página nunca inventa um número.",
        ],
      },
      {
        id: "agenda",
        pergunta: "Como ler a agenda?",
        resposta: [
          "Os eventos da semana e os próximos que importam — balanços, dados de emprego e inflação, decisões do Fed, eleições, prazos do Congresso — com a hora de Nova York.",
          "Os três traços ao lado de cada evento são o **peso**: três traços mexem com tudo, um traço vale saber. Dias que já passaram ficam apagados; o dia de hoje fica destacado.",
        ],
      },
      {
        id: "apostas",
        pergunta: "O que é \"O que as apostas dizem\"?",
        resposta: [
          "O que os **mercados de previsão** ([Polymarket](https://polymarket.com) e [Kalshi](https://kalshi.com)) estão pagando por perguntas que mexem com o mercado: quem controla o Congresso, se o Fed sobe o juro, se o Estreito de Ormuz reabre.",
          "A barra é a probabilidade implícita no preço; o traço vertical é **onde ela estava antes** (com a data), porque a mudança costuma dizer mais que o nível. O link leva à fonte que citou o preço.",
          "Por que usar: tem dinheiro em jogo e o preço muda rápido com a notícia. Limite: mercado com pouco volume pode errar feio.",
        ],
      },
      {
        id: "congresso",
        pergunta: "Por que tem uma seção do Congresso?",
        resposta: [
          "Porque lei, orçamento e prazo de governo mexem com setores inteiros. A seção diz em que pé cada projeto está, quando ele vota ou vence e **quem ele afeta** (empresas, setores, ativos).",
        ],
      },
      {
        id: "evitar",
        pergunta: "O que é \"O que eu evitaria\"?",
        resposta: [
          "Ativos que estão na boca de todo mundo naquela semana, mas em que a edição **não vê vantagem** — com o porquê. Não fazer nada também é posição, e dizer o que ficou de fora ajuda a entender o raciocínio.",
        ],
      },
      {
        id: "revisao",
        pergunta: "O que é a revisão da semana passada?",
        resposta: [
          "A partir da segunda edição, um texto sobre as ideias anteriores: o que a tese acertou, o que errou e o que muda no método. Com a mesma franqueza das teses — a ideia que deu errado é a que mais ensina.",
        ],
      },
      {
        id: "edicoes-anteriores",
        pergunta: "Como vejo uma edição antiga?",
        resposta: [
          "Quando houver mais de uma edição, aparecem botões com as datas logo abaixo do título. Cada edição antiga continua com as ideias exatamente como foram publicadas — e com o resultado medido até hoje.",
        ],
      },
    ],
  },
  {
    id: "ideias",
    titulo: "As ideias",
    resumo: "O que cada cartão diz e como ler cada parte.",
    perguntas: [
      {
        id: "cartao",
        pergunta: "O que tem em cada cartão de ideia?",
        resposta: [
          {
            lista: [
              "**O ativo** (o código, como MSFT ou SMH) e o nome.",
              "**A direção**: alta (ganha se subir) ou baixa (ganha se cair).",
              "**O instrumento, o horizonte e o vencimento**: semana ou mês, e o último dia da ideia.",
              "**O título e a tese**: a aposta, em uma ou duas linhas.",
              "**O desenho**: a régua de stop, entrada e alvo; o gráfico da trava, numa opção; ou o preço do contrato, numa previsão.",
              "**Tamanho e confiança.**",
              "**A situação**: aguardando, aberta, fechada — sempre com data.",
              "**\"Por quê\"**: as bases, cada uma com o link da fonte, e \"o que mata a ideia\".",
            ],
          },
        ],
      },
      {
        id: "instrumentos",
        pergunta: "Que tipos de investimento aparecem?",
        resposta: [
          {
            lista: [
              "**Ação** — uma empresa só (ex.: Microsoft).",
              "**ETF** — um fundo negociado em bolsa que carrega uma cesta (ex.: SMH, de fabricantes de chip; XLE, de energia; SPY, o S&P 500 inteiro).",
              "**Opção** — só de risco definido: a [trava](#trava) ou a compra simples de call ou put. A perda máxima é o que se paga na entrada.",
              "**Cripto** — bitcoin e ether, ou os ETFs de cripto.",
              "**Previsão** — um contrato do Kalshi ou do Polymarket ([como funciona](#previsao)).",
            ],
          },
          "Nenhum é obrigatório. Sem vantagem clara num deles, a semana vai sem.",
        ],
      },
      {
        id: "baixa",
        pergunta: "Como funciona uma ideia de \"baixa\"?",
        resposta: [
          "Ela ganha se o preço **cair**. No registro, conta como se o ativo tivesse sido vendido na entrada e recomprado na saída: cair 4% é +4%, subir 4% é −4%.",
          "Na vida real, quem quer apostar na queda com risco limitado usa uma put, uma trava de baixa ou um ETF inverso — vender a descoberto tem perda sem teto e não combina com o perfil moderado.",
        ],
      },
      {
        id: "regua",
        pergunta: "Como ler a régua de stop, entrada e alvo?",
        resposta: [
          "A régua é o eixo do preço. O traço do meio é a **entrada**; o lado vermelho vai até o **stop**; o lado verde vai até o **alvo**. Numa ideia de baixa, os lados se invertem: o alvo fica à esquerda (preço menor).",
          "Antes da entrada só existem os percentuais (\"stop −4%\", \"alvo +7%\"), porque o preço de abertura ainda não aconteceu. Depois da entrada aparecem os preços, e uma bolinha mostra onde o preço está agora — ou onde a ideia saiu.",
        ],
      },
      {
        id: "stop-alvo",
        pergunta: "O que são stop e alvo?",
        resposta: [
          "Os dois preços de saída, combinados **antes** de entrar. O **alvo** é onde se embolsa o ganho; o **stop** é onde se aceita o prejuízo pra ele não crescer. Escritos em % a partir da entrada, porque a edição sai antes de a bolsa abrir ([por quê](#porcentagem)).",
        ],
      },
      {
        id: "porcentagem",
        pergunta: "Por que alvo e stop são em % e não em preço?",
        resposta: [
          "Porque a edição é escrita de madrugada, antes da abertura de segunda, e a entrada é o **preço de abertura** — que ainda não existe. Escrever em % faz a regra valer seja qual for a abertura. A sessão de pesquisa também não tem acesso a cotação em tempo real: ela lê notícias, e quem mede o preço é o site.",
        ],
      },
      {
        id: "tamanho",
        pergunta: "O que é o \"tamanho\"?",
        resposta: [
          "A fatia da carteira que a ideia usa. **4% da carteira** numa carteira de US$ 10 mil são US$ 400. No perfil moderado, nenhuma ideia passa de 5%, e o topo da lista mostra quanto a semana usa somada.",
          "O tamanho também pesa no registro: a linha \"Carteira\" soma tamanho × retorno de cada ideia ([como](#registro)).",
        ],
      },
      {
        id: "confianca",
        pergunta: "O que quer dizer a confiança de 1 a 5?",
        resposta: [
          "Quão forte é a evidência, na opinião da edição. **3 já é uma ideia boa**; 2 é uma aposta com base, mas com muita coisa contra; 4 e 5 são raros. Confiança não muda a conta — muda o tamanho que faz sentido pôr.",
        ],
      },
      {
        id: "bases",
        pergunta: "O que são as \"bases\"?",
        resposta: [
          "Os motivos da ideia, cada um com o link da fonte. Toda ideia tem pelo menos duas. Os tipos:",
          {
            lista: [
              "**Balanço** — o resultado trimestral de uma empresa.",
              "**Dado** — emprego, inflação, juro, PIB.",
              "**Notícia** — um fato que mexe no preço.",
              "**Mercado de previsão** — o que o Kalshi ou o Polymarket estão pagando.",
              "**Congresso** — projeto de lei, votação, prazo.",
              "**Histórico** — um padrão estudado (ex.: a bolsa depois de eleições; o \"drift\" depois de balanço).",
              "**Fluxo** — dinheiro entrando ou saindo (ex.: ETFs de bitcoin).",
            ],
          },
        ],
      },
      {
        id: "mata",
        pergunta: "Pra que serve \"o que mata a ideia\"?",
        resposta: [
          "É a condição, escrita antes, que provaria que a tese está errada. Serve pra não racionalizar depois: se acontecer, a ideia morreu, mesmo que o stop ainda não tenha sido tocado.",
        ],
      },
      {
        id: "trava",
        pergunta: "O que é uma trava de opção, e como ler o gráfico?",
        resposta: [
          "Uma **trava de alta** compra uma call (o direito de comprar o ativo a um preço, o strike) e vende outra call com strike mais alto. A venda paga parte da compra: a trava custa menos, mas o ganho tem teto. A **trava de baixa** é o espelho, com puts: ganha quando o ativo cai.",
          "O gráfico mostra quanto a trava rende **no vencimento** pra cada variação do ativo desde a entrada:",
          {
            lista: [
              "À esquerda, a linha reta em **−100%**: o ativo ficou abaixo do strike comprado e a trava não vale nada. A perda é o que se pagou — e nunca mais que isso.",
              "No meio, a subida: a trava passa a valer. O ponto de **empate** é onde ela paga o próprio custo.",
              "À direita, a linha reta de cima: o ativo passou do strike vendido e a trava vale o máximo.",
            ],
          },
          "A bolinha mostra onde o ativo está agora. O custo é uma **estimativa** feita na publicação (em % do preço do ativo); por isso a tela diz \"custo estimado\".",
        ],
      },
      {
        id: "previsao",
        pergunta: "Como funciona uma ideia de mercado de previsão?",
        resposta: [
          "Compra-se um contrato que **paga US$ 1 se a coisa acontecer** e zero se não. O preço é a probabilidade que o mercado dá: a 24¢, o mercado acha 24% de chance.",
          "Se ganhar, o retorno é 1 ÷ preço − 1 (a 24¢, +317%). Se perder, −100%. Por isso essas ideias são sempre pequenas, e só entram quando a edição tem um motivo explícito pra achar o preço errado.",
        ],
      },
    ],
  },
  {
    id: "regras",
    titulo: "Como o resultado é medido",
    resumo: "As regras da conta. Elas foram escritas pra não favorecer a edição.",
    perguntas: [
      {
        id: "entrada",
        pergunta: "Quando uma ideia \"entra\"?",
        resposta: [
          "Na **abertura do primeiro pregão que começa depois da publicação** — e nunca antes da segunda-feira da edição. Uma edição publicada às 6h40 de segunda entra na abertura das 9h30 do mesmo dia.",
          "Se uma edição atrasar e sair depois das 9h30, a entrada vai pra abertura de terça. Ninguém pode escolher um preço que já viu.",
        ],
      },
      {
        id: "saida",
        pergunta: "Quando uma ideia \"sai\"?",
        resposta: [
          "No primeiro destes que acontecer:",
          {
            lista: [
              "**Alvo** — o preço tocou o alvo durante o pregão.",
              "**Stop** — o preço tocou o stop durante o pregão.",
              "**Vencimento** — chegou o último dia sem tocar nenhum dos dois: sai no fechamento desse dia.",
            ],
          },
          "No próprio dia do vencimento a ideia ainda aparece como aberta; ela fecha quando o dia acaba.",
        ],
      },
      {
        id: "mesmo-dia",
        pergunta: "E se no mesmo dia o preço passar pelo stop e pelo alvo?",
        resposta: [
          "**Conta o stop.** A cotação diária diz a máxima e a mínima do dia, mas não qual veio primeiro. Na dúvida, a conta perde.",
        ],
      },
      {
        id: "gap",
        pergunta: "E se o preço já abrir além do stop?",
        resposta: [
          "Sai **no preço de abertura**, não no stop. Se uma notícia de madrugada fez o ativo abrir 6% abaixo, com stop em −3%, a perda registrada é −6% — foi o preço que existia. O mesmo vale a favor: abrir acima do alvo sai na abertura.",
        ],
      },
      {
        id: "opcao-resultado",
        pergunta: "Como uma opção é medida?",
        resposta: [
          "Vai **até o vencimento** e vale o **valor intrínseco** naquele fechamento — quanto ela valeria se fosse exercida. O retorno é esse valor dividido pelo custo estimado na publicação, menos 1.",
          "Enquanto não vence, a tela mostra **\"se vencesse hoje\"**: o valor intrínseco com o preço de agora, sem o valor de tempo (que só a corretora sabe). É uma referência, não o preço de mercado da opção.",
        ],
      },
      {
        id: "previsao-resultado",
        pergunta: "Como uma previsão é medida?",
        resposta: [
          "Pela **resolução** do mercado: quando o Kalshi ou o Polymarket resolve a pergunta, a edição seguinte registra se ganhou ou perdeu, com a data. Até lá, ela aparece como \"aguardando o mercado resolver\" e **não entra** na taxa de acerto.",
        ],
      },
      {
        id: "spy",
        pergunta: "Por que cada ideia é comparada com o SPY?",
        resposta: [
          "Porque ganhar 2% numa semana em que a bolsa subiu 3% é perder pro mais simples dos investimentos. O SPY (o ETF do S&P 500) é medido **no mesmo período** de cada ideia: da abertura do dia da entrada ao fechamento do dia da saída.",
          "Previsão não tem comparação com o SPY: o período e o tipo de risco não se comparam.",
        ],
      },
      {
        id: "registro",
        pergunta: "O que quer dizer cada número do registro de acertos?",
        resposta: [
          {
            lista: [
              "**Acerto** — quantas ideias fechadas terminaram no azul (retorno acima de zero), em % e em \"x de y\".",
              "**Retorno médio** — a média simples do retorno de cada ideia, no dinheiro dela.",
              "**Carteira** — a soma de tamanho × retorno de todas as ideias fechadas: quanto uma carteira que seguisse tudo teria andado. Ao lado, o mesmo dinheiro no SPY.",
              "**Bateu o SPY** — quantas ideias renderam mais que o SPY no mesmo período.",
            ],
          },
          "O gráfico desenha a carteira das ideias (linha verde) contra o mesmo dinheiro no SPY (tracejada), ideia fechada a ideia fechada. Toque ou passe o dedo pra ler cada ponto. A tabela lista cada ideia fechada, da mais recente pra mais antiga.",
        ],
      },
      {
        id: "acerto-engana",
        pergunta: "Por que a taxa de acerto sozinha engana?",
        resposta: [
          "Porque acertar 7 em 10 ganhando 1% e perdendo 8% nas outras 3 é perder dinheiro. Por isso o acerto vem sempre ao lado do retorno médio, da carteira e da comparação com o SPY.",
        ],
      },
      {
        id: "amostra",
        pergunta: "O que quer dizer \"amostra pequena\"?",
        resposta: [
          "Com **menos de 20 ideias fechadas**, a taxa de acerto ainda é ruído: sorte e habilidade não se separam com tão poucos casos. O aviso some quando o registro chega a 20.",
        ],
      },
      {
        id: "custos",
        pergunta: "O resultado desconta corretagem, spread e imposto?",
        resposta: [
          "**Não.** Os retornos são **brutos**: não descontam corretagem, a diferença entre compra e venda (spread), o deslizamento do preço na execução nem imposto. Também são **retornos de preço**: dividendos pagos no período não entram. Na vida real o resultado seria um pouco pior, principalmente em opção.",
        ],
      },
      {
        id: "reescrever",
        pergunta: "Uma edição pode ser corrigida depois de publicada?",
        resposta: [
          "**Não.** Mudar a tese, o alvo ou o stop depois de ver o mercado faria a taxa de acerto mentir. Uma edição publicada só ganha duas coisas: a **resolução** das previsões e **adendos** com data. Cada edição é um arquivo com data no histórico do código, então qualquer mudança ficaria registrada.",
        ],
      },
      {
        id: "gravado",
        pergunta: "O resultado de uma ideia fechada pode mudar?",
        so: "bancada",
        resposta: [
          "Não. No Bancada, o resultado é **gravado uma vez**, quando a ideia fecha, e a conta não se refaz — nem se o provedor de cotação revisar um preço ou sair do ar.",
        ],
      },
      {
        id: "recalculado",
        pergunta: "O resultado de uma ideia fechada pode mudar?",
        so: "otech",
        resposta: [
          "Aqui a conta é refeita a cada visita, com as mesmas regras e os mesmos preços diários — então o resultado de uma ideia fechada fica igual, a não ser que o provedor revise uma cotação antiga. O registro oficial, gravado uma vez quando a ideia fecha, fica no app privado onde as edições nascem.",
        ],
      },
    ],
  },
  {
    id: "cotacoes",
    titulo: "Cotações",
    resumo: "De onde vêm os preços e o que fazer quando eles não aparecem.",
    perguntas: [
      {
        id: "fonte-precos",
        pergunta: "De onde vêm os preços?",
        resposta: [
          "Do **gráfico diário do Yahoo Finance**, com o **Stooq** de reserva quando o Yahoo não responde. São preços com atraso: o provedor já atrasa, e o site guarda cada resposta por até 15 minutos.",
          "As ideias usam o pregão inteiro de cada dia (abertura, máxima, mínima e fechamento); o termômetro usa o último fechamento.",
        ],
      },
      {
        id: "sem-cotacao",
        pergunta: "Por que aparece \"sem cotação agora\"?",
        resposta: [
          "Porque o provedor não respondeu naquele momento. A página mostra o que sabe — o valor da edição, com aviso — e espera a próxima visita. **Ela nunca inventa um preço.** Uma ideia cujo prazo passou sem nenhuma cotação aparece como \"sem cotação pra dizer como terminou\".",
        ],
      },
      {
        id: "horario",
        pergunta: "Que horário vale?",
        resposta: [
          "O da **bolsa de Nova York**: o pregão vai das 9h30 às 16h, e o \"hoje\" das ideias é o dia de Nova York, de onde quer que você abra a página. Cripto negocia o tempo todo; ali o dia vira à meia-noite UTC.",
        ],
      },
      {
        id: "atraso-dia",
        pergunta: "O preço de hoje já conta?",
        resposta: [
          "Conta. Durante o pregão, o dia de hoje aparece com o preço parcial. Se a mínima ou a máxima de hoje já tocou o stop ou o alvo, a ideia fecha — um toque é um toque.",
        ],
      },
    ],
  },
  {
    id: "reservas",
    titulo: "Reservas",
    resumo: "Registrar que você seguiu uma ideia — no papel.",
    perguntas: [
      {
        id: "o-que-e-reserva",
        pergunta: "O que é \"reservar no papel\"?",
        so: "bancada",
        resposta: [
          "É dizer \"segui esta, com tanto\". A reserva não compra nada: ela acompanha a ideia como se o dinheiro estivesse lá, e entra em **\"As suas reservas\"**, no fim do registro, com quantas ficaram no azul e quanto renderiam em dólares.",
        ],
      },
      {
        id: "como-reservar",
        pergunta: "Como reservo uma ideia?",
        so: "bancada",
        resposta: [
          "No cartão da ideia, **\"Reservar no papel\"**. Diga quanto (a sugestão é o tamanho da ideia numa carteira de US$ 10 mil) e, se quiser, o preço que você pegou — vazio, vale a abertura da entrada. Aceita \"1.234,50\" ou \"1234.50\".",
          "Reservar de novo a mesma ideia só troca os números. Ideia que já fechou não aceita reserva.",
        ],
      },
      {
        id: "sair-antes",
        pergunta: "E se eu sair antes do alvo ou do stop?",
        so: "bancada",
        resposta: [
          "**\"Saí antes\"**, com o preço da saída. A reserva fecha ali, com o seu preço, e a ideia segue as regras dela. \"Desfazer a saída\" volta a seguir a ideia; \"Desfazer reserva\" apaga a reserva.",
          "Preço próprio de entrada e de saída só vale em ação, ETF e cripto. Em opção e previsão o preço é o do contrato, que a tela não conhece: a reserva segue o retorno da ideia.",
        ],
      },
      {
        id: "perfis",
        pergunta: "Cada perfil vê as reservas do outro?",
        so: "bancada",
        resposta: [
          "Não. Cada perfil vê só as suas, e não existe comparação entre perfis — a regra da casa vale aqui também. O que se mede são as **ideias**, não as pessoas.",
        ],
      },
      {
        id: "sem-reserva",
        pergunta: "Posso reservar ideias aqui?",
        so: "otech",
        resposta: [
          "Não. Esta é a vitrine pública: mostra a edição e mede as ideias, mas não guarda nada sobre quem visita. As reservas existem só no app da casa.",
        ],
      },
    ],
  },
  {
    id: "riscos",
    titulo: "Riscos e limites",
    resumo: "O que pode dar errado, dito antes.",
    perguntas: [
      {
        id: "perder",
        pergunta: "Dá pra perder dinheiro seguindo as ideias?",
        resposta: [
          "**Dá.** Uma ideia com boas razões pode dar errado, e uma sequência de semanas ruins é normal. Resultado passado não garante resultado futuro. Os riscos de cada instrumento:",
          {
            lista: [
              "**Ação e ETF** — o stop limita a perda, mas um salto de abertura pode passar dele ([gap](#gap)).",
              "**Opção** — pode vencer sem valor nenhum: a perda é o débito inteiro.",
              "**Previsão** — se não acontecer, o contrato vai a zero.",
              "**Cripto** — negocia o tempo todo e oscila muito mais que ação.",
            ],
          },
        ],
      },
      {
        id: "erros-ia",
        pergunta: "A pesquisa pode ter erro?",
        resposta: [
          "Pode. A pesquisa é feita por IA a partir de notícias e páginas públicas; um número pode estar desatualizado ou uma fonte pode ter errado. Por isso toda base vem com link: **confira a fonte** antes de decidir. Quando um erro aparecer, ele entra na revisão da semana seguinte — a edição publicada não é editada.",
        ],
      },
      {
        id: "conflitos",
        pergunta: "Alguém paga pra uma ideia aparecer?",
        resposta: [
          "Não. Não tem patrocínio, link de afiliado nem parceria com corretora, plataforma de previsão ou empresa citada.",
        ],
      },
      {
        id: "dinheiro-real",
        pergunta: "Quando faz sentido usar dinheiro de verdade?",
        resposta: [
          "Depois que o registro tiver amostra suficiente (pelo menos 20 ideias fechadas) e o resultado, **descontados custos e impostos**, bater o SPY de forma consistente — e dentro do que você pode perder. Antes disso, o papel é o lugar certo.",
        ],
      },
    ],
  },
  {
    id: "impostos",
    titulo: "Impostos nos EUA",
    resumo: "O resumo. Quem confirma a sua situação é um contador.",
    perguntas: [
      {
        id: "imposto-papel",
        pergunta: "No papel tem imposto?",
        resposta: ["Não. Sem operação de verdade, não há nada a declarar."],
      },
      {
        id: "curto-longo",
        pergunta: "Como o ganho é tributado?",
        resposta: [
          {
            lista: [
              "**Até 1 ano (curto prazo)** — o ganho entra como renda comum, na faixa federal de quem ganhou (10% a 37%). Quase toda ideia daqui é curto prazo: é o custo escondido de girar toda semana.",
              "**Mais de 1 ano (longo prazo)** — 0%, 15% ou 20% federais, conforme a renda. Acima de US$ 200 mil de renda (US$ 250 mil o casal) soma 3,8% de NIIT.",
              "**Estado** — a maioria dos estados também cobra; na Georgia, alíquota única perto de 5%.",
            ],
          },
        ],
      },
      {
        id: "perdas",
        pergunta: "E as perdas?",
        resposta: [
          "Perda abate ganho. O que sobrar abate até US$ 3 mil por ano da renda comum, e o resto passa pro ano seguinte.",
          "Cuidado com a **wash sale**: vender no prejuízo e recomprar o mesmo ativo (ou um praticamente igual) 30 dias antes ou depois anula a perda naquele ano.",
        ],
      },
      {
        id: "imposto-instrumentos",
        pergunta: "Opção, cripto e previsão têm regra própria?",
        resposta: [
          {
            lista: [
              "**Opção de índice** (SPX, por exemplo) é \"seção 1256\": 60% é tributado como longo prazo, mesmo segurando um dia. Opção de **SPY** (um ETF) não é.",
              "**Cripto** é propriedade pro IRS: mesma regra de curto e longo prazo.",
              "**Mercado de previsão** ainda não tem tratamento pacífico. Guarde todos os extratos.",
            ],
          },
        ],
      },
      {
        id: "ira",
        pergunta: "Existe jeito de não pagar imposto a cada operação?",
        resposta: [
          "Dentro de uma conta de aposentadoria (**IRA ou Roth IRA**) não há imposto a cada operação — é onde girar curto custa menos, com limite anual de aporte. Não é conselho fiscal: um contador (CPA) confirma a sua situação, inclusive se você ainda declara no Brasil.",
        ],
      },
    ],
  },
  {
    id: "arquitetura",
    titulo: "Estrutura e arquitetura de TI",
    resumo: "As peças do sistema, por onde os dados passam e o que protege cada parte.",
    perguntas: [
      {
        id: "pecas",
        pergunta: "Quais são as peças do sistema?",
        resposta: [
          "Seis peças, cada uma com um trabalho só:",
          {
            fluxo: [
              { titulo: "Pesquisa", texto: "Uma sessão de IA (Claude) agendada pra segunda de manhã. Lê notícias e dados na web e escreve a edição." },
              { titulo: "Código", texto: "A edição vira um arquivo no repositório Git, no GitHub. O histórico guarda a data de cada mudança." },
              { titulo: "Publicação", texto: "A Vercel monta o site a partir do repositório e põe no ar em minutos." },
              { titulo: "Site", texto: "As páginas que você vê: a edição, o registro de acertos e esta ajuda." },
              { titulo: "Cotações", texto: "O servidor busca os preços diários no Yahoo Finance (Stooq de reserva) quando alguém abre a página." },
              { titulo: "Conta", texto: "Funções puras aplicam as regras e medem cada ideia contra o SPY." },
            ],
          },
          "A IA que escreve a edição e o código que mede as ideias são separados de propósito: quem escreve a tese não corrige a nota.",
        ],
      },
      {
        id: "fluxo-semana",
        pergunta: "O que acontece numa segunda-feira, passo a passo?",
        resposta: [
          {
            fluxo: [
              { titulo: "6h40", texto: "A sessão de pesquisa começa num computador novo na nuvem e baixa o código." },
              { titulo: "Pesquisa", texto: "Fecha as previsões que resolveram, lê a semana e escreve a revisão e a edição nova." },
              { titulo: "Conferência", texto: "Os testes validam as regras da conta e cada limite da edição. Se algo falha, para aqui." },
              { titulo: "Publicação", texto: "Commit direto na main dos dois repositórios. A Vercel monta e publica sozinha." },
              { titulo: "9h30", texto: "A bolsa abre: esta é a entrada de todas as ideias da semana." },
              { titulo: "Dias seguintes", texto: "Cada visita busca a cotação e mostra em que pé cada ideia está, até ela fechar." },
            ],
          },
        ],
      },
      {
        id: "tecnologias",
        pergunta: "Que tecnologias são usadas?",
        resposta: [
          {
            lista: [
              "**Pesquisa** — Claude (Anthropic), numa sessão agendada na nuvem, com busca na web.",
              "**Código e histórico** — TypeScript, versionado em Git no GitHub.",
              "**Hospedagem** — Vercel: monta o site, serve pela CDN e roda as funções de servidor.",
              "**Cotações** — o gráfico diário do Yahoo Finance, com o Stooq de reserva.",
              "**Caixa de perguntas** — Gemini (Google), com busca na base deste FAQ e das edições ([como funciona](#perguntas-ia)).",
            ],
          },
        ],
      },
      {
        id: "tecnologias-bancada",
        pergunta: "E o app da casa, em que é feito?",
        so: "bancada",
        resposta: [
          {
            lista: [
              "**Site** — Next.js 16 (componentes de servidor e server actions), React 19 e Tailwind 4, instalado como app (PWA) no celular e no iPad.",
              "**Banco** — Postgres gerenciado, acessado pelo Prisma 7. O Mercado usa só duas tabelas ([quais](#banco)).",
              "**Cotação** — buscada pelo servidor do site, com cache de 15 minutos.",
            ],
          },
        ],
      },
      {
        id: "tecnologias-otech",
        pergunta: "E esta página, em que é feita?",
        so: "otech",
        resposta: [
          {
            lista: [
              "**Páginas** — Vite 5, React 18 e Tailwind 4: arquivos estáticos servidos pela CDN da Vercel.",
              "**Funções** — duas Vercel Functions: `/api/precos` (cotação) e `/api/perguntar` (a caixa de perguntas).",
              "**Banco** — nenhum. Esta vitrine não grava nada.",
            ],
          },
        ],
      },
      {
        id: "onde-dados",
        pergunta: "Onde os dados ficam guardados?",
        resposta: [
          {
            lista: [
              "**As edições** — como código, no repositório. Cada edição é um arquivo com a segunda-feira no nome, e o histórico do Git mostra quando ele foi criado e se foi mexido.",
              "**As cotações** — não ficam guardadas. São buscadas na hora e reaproveitadas por até 15 minutos.",
              "**As perguntas da caixa** — não ficam guardadas. Passam pelo servidor e pelo Gemini só pra gerar a resposta.",
            ],
          },
        ],
      },
      {
        id: "banco",
        pergunta: "Que tabelas o Mercado usa no banco?",
        so: "bancada",
        resposta: [
          "Duas, e só com o que nasce do uso — as ideias não estão no banco:",
          {
            lista: [
              "**Desfecho** — o resultado de uma ideia de preço, gravado uma vez quando ela fecha: a ideia, o motivo (alvo, stop ou prazo), entrada e saída com as datas, o retorno e o SPY no mesmo período.",
              "**Reserva** — quem seguiu qual ideia: o perfil, a ideia, quanto, o preço próprio de entrada e de saída (se houver) e se é no papel.",
            ],
          },
          "Sem essas tabelas o Mercado continua funcionando: a conta é feita na hora e a reserva some com um aviso.",
        ],
      },
      {
        id: "modelo-edicao",
        pergunta: "Como uma edição é organizada por dentro?",
        resposta: [
          "Uma edição é um objeto com tipos verificados na hora de montar o site — um campo errado impede a publicação:",
          {
            lista: [
              "**Cabeçalho** — a segunda-feira, o instante da publicação, a manchete, a leitura e a postura.",
              "**Termômetro** — o símbolo de cada indicador, o valor na publicação e a frase do porquê.",
              "**Ideias** — id, instrumento, ativo, direção, horizonte, vencimento, alvo e stop em %, tamanho, confiança, as bases com fonte e o que mata a ideia. A opção tem ainda a estrutura, os strikes e o custo; a previsão, o mercado, o lado, o preço e, quando resolver, a resolução.",
              "**Contexto** — o que evitar, a agenda, as apostas, o Congresso, a revisão e os adendos.",
            ],
          },
        ],
      },
      {
        id: "por-que-codigo",
        pergunta: "Por que a edição é código, e não um cadastro num banco?",
        resposta: [
          {
            lista: [
              "**Prova de data** — o histórico do Git mostra quando cada ideia foi escrita e que ela não mudou depois.",
              "**Conferência antes de publicar** — os testes rodam em cima do próprio arquivo; edição fora das regras não sobe.",
              "**Nada a manter** — não existe painel de administração, login nem cadastro pra cuidar.",
              "**Funciona sem banco** — se o banco cair, a edição continua no ar.",
            ],
          },
        ],
      },
      {
        id: "cotacao-bancada",
        pergunta: "Como a cotação chega à tela?",
        so: "bancada",
        resposta: [
          "Quem busca é o servidor do site, na hora de montar a página: uma chamada por ativo, cobrindo do começo da edição ao último vencimento, mais o SPY pra comparar. Cada busca tem 5 segundos de limite e fica guardada por 15 minutos. Sem o Yahoo, tenta o Stooq; sem os dois, a tela diz que não sabe.",
          "Ideias que já fecharam não buscam cotação de novo: o resultado vem do banco.",
        ],
      },
      {
        id: "cotacao-otech",
        pergunta: "Como a cotação chega à tela?",
        so: "otech",
        resposta: [
          "O navegador não pode chamar o Yahoo direto (o Yahoo bloqueia pedido vindo de outro site). Então ele pede à função `/api/precos`, da Vercel, que confere o símbolo e as datas, busca no Yahoo (ou no Stooq) e devolve a resposta crua. A CDN guarda cada resposta por 15 minutos. O navegador transforma a resposta em pregões e aplica as regras.",
          "A função só aceita símbolo de bolsa e só fala com o Yahoo e o Stooq: ela não serve pra buscar outra coisa na internet.",
        ],
      },
      {
        id: "conta-tecnica",
        pergunta: "Onde a conta do resultado roda?",
        resposta: [
          "Em **funções puras**: recebem a ideia, a edição e os pregões do período e devolvem a situação (aguardando, aberta, fechada) com entrada, saída e retorno. Não leem relógio, rede nem banco — por isso dá pra testar cada regra com pregões montados à mão.",
          "O mesmo arquivo roda nos dois sites: no app da casa, no servidor, que grava o resultado quando a ideia fecha; na vitrine pública, no navegador de quem visita.",
        ],
      },
      {
        id: "espelho",
        pergunta: "Como os dois sites ficam com o mesmo conteúdo?",
        resposta: [
          "Quatro coisas são **cópias idênticas** nos dois repositórios: os tipos, as regras da conta, este FAQ e a pasta de edições. Toda segunda, a sessão de pesquisa escreve a edição no app da casa, copia a pasta pra vitrine, confere que o resto continua idêntico e roda os testes dos dois lados antes de publicar. Se alguma cópia divergir, ela para e avisa.",
        ],
      },
      {
        id: "publicacao",
        pergunta: "Como a edição chega ao site?",
        resposta: [
          "A sessão de pesquisa grava a edição no repositório, na branch principal. A Vercel percebe o commit, monta o site e põe no ar em poucos minutos — é o deploy. Se a montagem falhar (um erro de tipo, por exemplo), a versão anterior continua no ar — o site nunca fica quebrado por uma edição ruim.",
          "Mudança de código passa antes por uma branch separada, que a Vercel monta como prévia; só depois de conferida ela entra na principal.",
        ],
      },
      {
        id: "sessao-pesquisa",
        pergunta: "Como a sessão de pesquisa roda?",
        resposta: [
          "É uma tarefa agendada (toda segunda, 6h40 de Nova York) que abre uma sessão nova numa máquina na nuvem, sem nada da semana anterior além do código. Ela segue um roteiro escrito, guardado no próprio repositório, e tem a rede restrita: busca na web, sim; serviço de cotação, não — por isso alvo e stop são em %.",
          "No fim ela manda um resumo pro dono do projeto. Se um teste falhar, ela não publica e diz o que falhou.",
        ],
      },
      {
        id: "seguranca",
        pergunta: "O que protege o sistema?",
        resposta: [
          {
            lista: [
              "**Chaves só no servidor** — as chaves que o Mercado usa (Gemini e banco) são lidas pelas funções de servidor; nenhuma página do Mercado manda chave pro navegador, e nenhuma está no código.",
              "**Funções fechadas** — a de cotação só aceita símbolo de bolsa e só fala com dois provedores; a de perguntas só aceita perguntas curtas, com limite por visitante.",
              "**Nada pessoal** — o Mercado não guarda saldo, conta, patrimônio nem dado de quem visita. As reservas do app da casa são no papel.",
              "**Código público sem segredo** — a vitrine é de código aberto; nada nela dá acesso ao app da casa, que é privado.",
            ],
          },
        ],
      },
      {
        id: "testes",
        pergunta: "O que os testes conferem?",
        resposta: [
          {
            lista: [
              "Cada regra da conta: entrada depois da publicação, stop antes do alvo no mesmo dia, saída na abertura no gap, vencimento, travas, previsões, reservas.",
              "Toda edição: tamanho até 5%, pelo menos duas bases, \"o que mata a ideia\" escrito, strike do lado certo, semana começando numa segunda.",
              "Este FAQ: nenhuma pergunta repetida, nenhum link interno quebrado.",
              "A caixa de perguntas: pergunta fora do assunto é recusada antes de chamar a IA; a resposta só usa a base.",
              "A tela num navegador de verdade, com cotações de teste: uma ideia no alvo, uma no stop, uma aberta, sem rolagem lateral no celular.",
            ],
          },
        ],
      },
      {
        id: "perguntas-ia",
        pergunta: "Como funciona a caixa de perguntas?",
        resposta: [
          "É uma busca com resposta escrita por IA (o que se chama de RAG):",
          {
            fluxo: [
              { titulo: "Base", texto: "Este FAQ, o glossário e as edições publicadas, recortados em trechos curtos." },
              { titulo: "Busca", texto: "As palavras da pergunta (sem acento) são comparadas com cada trecho; os mais parecidos são escolhidos." },
              { titulo: "Filtro", texto: "Pergunta sem nenhuma palavra do Mercado, ou sem trecho que tenha a ver com ela, é recusada ali mesmo — sem chamar a IA." },
              { titulo: "Resposta", texto: "O Gemini recebe só os trechos escolhidos e a pergunta, com a instrução de responder apenas com eles — e de recusar o que não for sobre o Mercado." },
              { titulo: "Fontes", texto: "A resposta vem com os trechos usados, cada um com link pra pergunta ou pra edição." },
            ],
          },
          "Limites: até 300 caracteres por pergunta e algumas perguntas por minuto por visitante. A pergunta não fica guardada.",
        ],
      },
      {
        id: "limites-ia",
        pergunta: "O que a caixa de perguntas não faz?",
        resposta: [
          {
            lista: [
              "**Não responde fora do assunto** — só o Mercado: as ideias, as regras, os dados e a estrutura do site.",
              "**Não dá conselho pessoal** — \"devo comprar?\" não tem resposta aqui; ela explica o que a edição diz e por quê.",
              "**Não inventa** — se a base não cobre a pergunta, ela diz que não sabe.",
              "**Pode errar** — é IA. Confira nas fontes que ela cita.",
            ],
          },
        ],
      },
      {
        id: "dados-visitante",
        pergunta: "O site guarda alguma coisa sobre mim?",
        resposta: [
          "Não guarda. Não tem conta, cadastro nem formulário. A pergunta que você digita na caixa vai pro Gemini, do Google, só pra gerar a resposta, e não fica salva no site. No app da casa, ficam só as reservas de cada perfil.",
        ],
      },
      {
        id: "sugerir",
        pergunta: "Achei um erro. Como aviso?",
        resposta: [
          "Se o erro é de dado ou de fonte, ele entra na revisão da semana seguinte. Se é da página (um número que não bate com a regra, algo que não abre no celular), quem mantém o site corrige no código — e a regra escrita aqui muda junto.",
        ],
      },
    ],
  },
];

/** As palavras que aparecem na página, em uma linha cada. */
export const GLOSSARIO: { termo: string; definicao: string }[] = [
  { termo: "Ação", definicao: "Um pedaço de uma empresa negociado em bolsa." },
  { termo: "Alvo", definicao: "O preço onde a ideia sai no lucro, combinado antes de entrar." },
  { termo: "Balanço", definicao: "O resultado trimestral que uma empresa divulga: receita, lucro, previsões." },
  { termo: "Call", definicao: "Opção que dá o direito de comprar o ativo a um preço (o strike) até o vencimento." },
  { termo: "CPI", definicao: "O índice de inflação ao consumidor dos EUA, divulgado todo mês." },
  { termo: "Débito", definicao: "O que se paga pra montar uma opção ou trava. Nas de risco definido, é a perda máxima." },
  { termo: "Drift pós-balanço", definicao: "A tendência, muito estudada, de a ação seguir na direção da surpresa do balanço por semanas." },
  { termo: "DXY", definicao: "Índice do dólar contra uma cesta de moedas fortes." },
  { termo: "Empate", definicao: "O preço do ativo em que uma opção, no vencimento, paga exatamente o que custou." },
  { termo: "ETF", definicao: "Fundo negociado em bolsa como uma ação, que carrega uma cesta de ativos." },
  { termo: "Fed", definicao: "O banco central dos EUA, que decide o juro básico." },
  { termo: "Gap", definicao: "Quando o pregão abre bem longe do fechamento anterior, pulando preços no meio." },
  { termo: "Kalshi e Polymarket", definicao: "Mercados de previsão: contratos que pagam US$ 1 se um evento acontecer." },
  { termo: "Payroll", definicao: "O relatório mensal de emprego dos EUA (vagas criadas e taxa de desemprego)." },
  { termo: "Pregão", definicao: "Um dia de negociação na bolsa: em Nova York, das 9h30 às 16h." },
  { termo: "Put", definicao: "Opção que dá o direito de vender o ativo a um preço até o vencimento. Ganha quando o ativo cai." },
  { termo: "S&P 500 e SPY", definicao: "O índice das 500 maiores empresas americanas, e o ETF que o segue." },
  { termo: "Stop", definicao: "O preço onde a ideia sai no prejuízo, combinado antes de entrar, pra a perda não crescer." },
  { termo: "Strike", definicao: "O preço combinado numa opção." },
  { termo: "Trava", definicao: "Comprar uma opção e vender outra do mesmo tipo: custa menos, e o ganho e a perda têm teto." },
  { termo: "Valor intrínseco", definicao: "Quanto uma opção valeria se fosse exercida agora; no vencimento, é tudo o que ela vale." },
  { termo: "Vencimento", definicao: "O último dia da ideia ou da opção." },
  { termo: "VIX", definicao: "O \"índice do medo\": quanto o mercado de opções espera de oscilação no S&P 500." },
  { termo: "WTI", definicao: "O petróleo de referência dos EUA." },
];

/** As seções e perguntas que valem num site, sem as do outro. */
export const ajudaDe = (site: Site): Secao[] =>
  AJUDA.map((s) => ({ ...s, perguntas: s.perguntas.filter((p) => !p.so || p.so === site) })).filter((s) => s.perguntas.length > 0);
