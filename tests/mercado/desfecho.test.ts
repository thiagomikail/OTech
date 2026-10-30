/**
 * O desfecho das ideias do mercado, sem rede e sem banco.
 *
 *   npm run test:mercado
 *
 * Cobre as regras que impedem a taxa de acerto de mentir (entrada depois da
 * publicação, stop antes do alvo no mesmo dia, saída na abertura quando o
 * preço pula a linha) e confere TODAS as edições de `src/mercado/edicoes`:
 * é o que pega uma edição de segunda mal escrita antes do deploy.
 */
import {
  desfecho,
  desfechoDeOpcao,
  desfechoDePreco,
  desfechoDePrevisao,
  resumo,
  retornoDaReserva,
  retornoNoPeriodo,
  type Vela,
} from "../../src/mercado/desfecho";
import { AJUDA, GLOSSARIO, ajudaDe } from "../../src/mercado/ajuda";
import { EDICOES } from "../../src/mercado/edicoes";
import { velasDoYahoo } from "../../src/mercado/yahoo";
import { TAMANHO_MAXIMO, type IdeiaOpcao, type IdeiaPreco, type IdeiaPrevisao } from "../../src/mercado/tipos";

let falhas = 0;
const ok = (c: boolean, m: string) => {
  console.log(`${c ? "✓" : "✗"} ${m}`);
  if (!c) falhas++;
};
const perto = (a: number | null | undefined, b: number) => typeof a === "number" && Math.abs(a - b) < 1e-9;

/** Pregão de novembro: abre 9h30 de Nova York = 14h30 UTC. */
const vela = (dia: string, abertura: number, maxima: number, minima: number, fechamento: number): Vela => ({
  inicio: Date.parse(`${dia}T14:30:00Z`),
  dia,
  abertura,
  maxima,
  minima,
  fechamento,
});

const edicao = { semana: "2026-11-02", publicadaEm: "2026-10-29T04:30:00Z" };
const base = {
  id: "t",
  titulo: "t",
  tese: "t",
  bases: [],
  invalida: "t",
  horizonte: "semana" as const,
  vence: "2026-11-06",
  tamanho: 4,
  confianca: 3 as const,
};
const alta: IdeiaPreco = { ...base, instrumento: "etf", ativo: "SMH", nome: "t", direcao: "alta", alvo: 4, stop: 3 };
const baixa: IdeiaPreco = { ...alta, direcao: "baixa" };

// ── a entrada: quinta e sexta não contam, mesmo com a edição já publicada
const semana: Vela[] = [
  vela("2026-10-29", 90, 91, 89, 90),
  vela("2026-10-30", 92, 93, 91, 92),
  vela("2026-11-02", 100, 101, 99, 100.5),
  vela("2026-11-03", 100.5, 102, 99.5, 101),
  vela("2026-11-04", 101, 102.5, 100, 102),
];
const aberta = desfechoDePreco(alta, edicao, semana, "2026-11-04");
ok(aberta.diaEntrada === "2026-11-02" && aberta.entrada === 100, `entra na abertura de segunda, não na quinta (${aberta.diaEntrada} a ${aberta.entrada})`);
ok(aberta.estado === "aberta" && perto(aberta.retorno, 0.02), `sem alvo nem stop, segue aberta marcando o último preço (+${((aberta.retorno ?? 0) * 100).toFixed(1)}%)`);

// ── edição atrasada: publicada segunda às 11h entra na terça
const atrasada = desfechoDePreco(alta, { ...edicao, publicadaEm: "2026-11-02T16:00:00Z" }, semana, "2026-11-04");
ok(atrasada.diaEntrada === "2026-11-03", "publicada depois da abertura de segunda, entra na abertura de terça");

// ── antes da segunda
ok(desfechoDePreco(alta, edicao, semana.slice(0, 2), "2026-10-30").estado === "aguardando", "na sexta anterior, ainda aguardando");

// ── alvo: +4% a partir de 100
const alvo = desfechoDePreco(alta, edicao, [vela("2026-11-02", 100, 101, 99, 100), vela("2026-11-03", 100, 104.5, 99.5, 104)], "2026-11-03");
ok(alvo.estado === "fechada" && alvo.motivo === "alvo" && perto(alvo.saida, 104), `fecha no alvo, a 104 (${alvo.motivo} a ${alvo.saida})`);
ok(perto(alvo.retorno, 0.04), "…e o retorno é exatamente +4%");

// ── no mesmo dia passou pelo stop e pelo alvo: vale o stop
const ambos = desfechoDePreco(alta, edicao, [vela("2026-11-02", 100, 105, 96, 103)], "2026-11-02");
ok(ambos.motivo === "stop" && perto(ambos.retorno, -0.03), "stop e alvo no mesmo dia: na dúvida, a conta perde (stop, −3%)");

// ── abriu abaixo do stop: sai na abertura, não no stop
const gap = desfechoDePreco(alta, edicao, [vela("2026-11-02", 100, 100.5, 99, 100), vela("2026-11-03", 94, 95, 93, 94.5)], "2026-11-03");
ok(gap.motivo === "stop" && gap.saida === 94 && perto(gap.retorno, -0.06), `abriu em 94 com stop em 97: a saída é 94 (${gap.saida}), −6%`);

// ── prazo: venceu sem tocar em nada, sai no fechamento de sexta
const prazo = desfechoDePreco(
  alta,
  edicao,
  [...semana.slice(2), vela("2026-11-05", 102, 103, 101, 102.5), vela("2026-11-06", 102.5, 103.5, 101.5, 101), vela("2026-11-09", 120, 130, 119, 125)],
  "2026-11-09",
);
ok(prazo.motivo === "prazo" && prazo.diaSaida === "2026-11-06" && perto(prazo.retorno, 0.01), `vence na sexta e sai no fechamento dela (+1%), ignorando a segunda seguinte (${prazo.diaSaida})`);
ok(desfechoDePreco(alta, edicao, semana.slice(2), "2026-11-06").estado === "aberta", "no próprio dia do vencimento, ainda aberta");

// ── baixa: o stop fica em cima
const subiu = desfechoDePreco(baixa, edicao, [vela("2026-11-02", 100, 103.5, 99, 103)], "2026-11-02");
ok(subiu.motivo === "stop" && perto(subiu.retorno, -0.03), "aposta de baixa: subir 3% é stop");
const caiu = desfechoDePreco(baixa, edicao, [vela("2026-11-02", 100, 100.5, 95.5, 96)], "2026-11-02");
ok(caiu.motivo === "alvo" && perto(caiu.retorno, 0.04), "aposta de baixa: cair 4% é alvo (+4%)");

// ── sem cotação: antes do prazo espera, depois diz "não sei"
ok(desfecho(alta, edicao, null, "2026-11-04").estado === "aguardando", "sem cotação antes do prazo: aguardando");
ok(desfecho(alta, edicao, null, "2026-11-09").estado === "sem-dado", "sem cotação depois do prazo: sem-dado, nunca um palpite");

// ── opção: trava de alta [0, 4], custo 1,9% do ativo
const trava: IdeiaOpcao = {
  ...base,
  vence: "2026-12-18",
  instrumento: "opcao",
  ativo: "SPY",
  nome: "t",
  direcao: "alta",
  estrutura: "trava",
  strikes: [0, 4],
  custo: 1.9,
  montagem: "t",
};
const travaSubiu = desfechoDeOpcao(trava, edicao, [vela("2026-11-02", 100, 101, 99, 100), vela("2026-12-18", 106, 107, 105, 106)], "2026-12-19");
ok(travaSubiu.estado === "fechada" && perto(travaSubiu.retorno, 4 / 1.9 - 1), `trava: acima do strike vendido vale a largura toda (+${((travaSubiu.retorno ?? 0) * 100).toFixed(0)}%)`);
const travaMeio = desfechoDeOpcao(trava, edicao, [vela("2026-11-02", 100, 101, 99, 100), vela("2026-12-18", 102, 102, 101, 101.9)], "2026-12-19");
ok(perto(travaMeio.retorno, 0), "trava: 1,9% acima no vencimento empata com o custo");
const travaCaiu = desfechoDeOpcao(trava, edicao, [vela("2026-11-02", 100, 101, 99, 100), vela("2026-12-18", 95, 96, 94, 95)], "2026-12-19");
ok(perto(travaCaiu.retorno, -1), "trava: abaixo do strike comprado perde o débito inteiro (−100%), nunca mais");
const travaBaixa: IdeiaOpcao = { ...trava, direcao: "baixa", strikes: [0, -5] };
const putSpread = desfechoDeOpcao(travaBaixa, edicao, [vela("2026-11-02", 100, 101, 99, 100), vela("2026-12-18", 90, 91, 89, 90)], "2026-12-19");
ok(perto(putSpread.retorno, 5 / 1.9 - 1), "trava de baixa: largura de 5% inteira quando cai além");

// ── previsão
const fed: IdeiaPrevisao = { ...base, instrumento: "previsao", mercado: "t", casa: "Kalshi", url: "t", lado: "t", preco: 0.24 };
ok(desfechoDePrevisao(fed).retorno === null, "previsão sem resolução: retorno desconhecido, não zero");
ok(perto(desfechoDePrevisao({ ...fed, resolucao: { ganhou: true, em: "2026-12-09" } }).retorno, 1 / 0.24 - 1), "previsão ganha a 0,24: +317%");
ok(perto(desfechoDePrevisao({ ...fed, resolucao: { ganhou: false, em: "2026-12-09" } }).retorno, -1), "previsão perdida: −100%");

// ── o SPY no mesmo período
const spy = [vela("2026-11-02", 600, 601, 599, 600), vela("2026-11-06", 606, 607, 605, 612)];
ok(perto(retornoNoPeriodo(spy, "2026-11-02", "2026-11-08"), 0.02), "SPY de segunda (abertura) até o último pregão antes da saída (+2%)");
ok(retornoNoPeriodo(spy, undefined, "2026-11-06") === null, "sem entrada, sem comparação");

// ── o resumo
const r = resumo([
  { ideia: { ...alta, tamanho: 4 }, semana: "2026-11-02", desfecho: alvo, spy: 0.01 },
  { ideia: { ...alta, tamanho: 2 }, semana: "2026-11-02", desfecho: gap, spy: -0.01 },
  { ideia: fed, semana: "2026-11-02", desfecho: desfechoDePrevisao(fed), spy: null },
]);
ok(r.fechadas === 2 && r.acertos === 1, `duas fechadas, um acerto; a previsão em aberto não conta (${r.acertos}/${r.fechadas})`);
ok(perto(r.carteira, 0.04 * 0.04 + 0.02 * -0.06), "a carteira soma tamanho × retorno (+0,04%)");
ok(r.bateuSpy === 1 && r.comparaveis === 2, "uma das duas bateu o SPY");
ok(r.curva.length === 2 && r.curva[0].dia <= r.curva[1].dia, "a curva anda na ordem das saídas");

// ── a reserva com preço próprio
ok(perto(retornoDaReserva(alta, alvo, { valor: 1000, entrada: 101, saida: null }), 104 / 101 - 1), "reserva com entrada própria usa o preço dela");
ok(perto(retornoDaReserva(alta, alvo, { valor: 1000, entrada: null, saida: 102 }), 0.02), "reserva que saiu antes usa a saída dela");
ok(perto(retornoDaReserva(trava, travaSubiu, { valor: 1000, entrada: 5, saida: null }), travaSubiu.retorno as number), "opção: a reserva segue o retorno da ideia");

// ── a resposta do Yahoo
// Bolsa americana no horário de inverno: gmtoffset −5h, pregão abre 14h30 UTC.
const yahoo = (timestamps: number[], gmtoffset: number) => ({
  chart: {
    result: [
      {
        meta: { gmtoffset },
        timestamp: timestamps,
        indicators: { quote: [{ open: [100, null, 102], high: [101, 1, 103], low: [99, 1, 101], close: [100.5, 1, 102.5] }] },
      },
    ],
  },
});
const doYahoo = velasDoYahoo(yahoo([Date.parse("2026-11-02T14:30:00Z") / 1000, Date.parse("2026-11-03T14:30:00Z") / 1000, Date.parse("2026-11-04T14:30:00Z") / 1000], -18000));
ok(doYahoo.length === 2 && doYahoo[0].dia === "2026-11-02" && doYahoo[1].dia === "2026-11-04", "Yahoo: dia da bolsa pelo gmtoffset, pregão com null fica de fora");
const meiaNoite = velasDoYahoo(yahoo([Date.parse("2026-11-02T05:00:00Z") / 1000], -18000));
ok(meiaNoite[0].inicio === Date.parse("2026-11-02T14:30:00Z"), "Yahoo carimbando meia-noite: o pregão ainda começa às 9h30");
ok(
  desfechoDePreco(alta, { ...edicao, publicadaEm: "2026-11-02T11:45:00Z" }, meiaNoite, "2026-11-02").diaEntrada === "2026-11-02",
  "…então a edição das 6h45 de segunda entra na segunda, não na terça",
);
const btc = velasDoYahoo(yahoo([Date.parse("2026-11-01T00:00:00Z") / 1000], 0));
ok(btc[0].dia === "2026-11-01" && btc[0].inicio === Date.parse("2026-11-01T00:00:00Z"), "cripto: o dia vira à meia-noite UTC");

// ── as edições de verdade
const ids = new Set<string>();
for (const e of EDICOES) {
  const nome = `edição ${e.semana}`;
  ok(new Date(`${e.semana}T12:00:00Z`).getUTCDay() === 1, `${nome}: a semana começa numa segunda`);
  ok(!Number.isNaN(Date.parse(e.publicadaEm)), `${nome}: publicadaEm é um instante`);
  for (const i of e.ideias) {
    const onde = `${nome} · ${i.id}`;
    ok(!ids.has(i.id), `${onde}: id único`);
    ids.add(i.id);
    ok(i.tamanho > 0 && i.tamanho <= TAMANHO_MAXIMO, `${onde}: tamanho ${i.tamanho}% dentro do teto de ${TAMANHO_MAXIMO}%`);
    ok(i.bases.length >= 2, `${onde}: ${i.bases.length} bases (mínimo 2)`);
    ok(i.invalida.length > 0, `${onde}: diz o que invalida`);
    ok(i.vence >= e.semana, `${onde}: vence (${i.vence}) depois do começo da semana`);
    if (i.instrumento === "previsao") ok(i.preco > 0 && i.preco < 1, `${onde}: preço entre 0 e 1`);
    else if (i.instrumento === "opcao") {
      const [k1, k2] = i.strikes;
      ok(i.custo > 0, `${onde}: custo estimado positivo`);
      ok(k2 === undefined || (i.direcao === "alta" ? k2 > k1 : k2 < k1), `${onde}: o strike vendido fica do lado certo`);
    } else ok(i.alvo > 0 && i.stop > 0, `${onde}: alvo e stop positivos`);
  }
}
ok(EDICOES.every((e, n) => n === 0 || EDICOES[n - 1].semana > e.semana), "edições em ordem, da mais nova pra mais antiga, sem semana repetida");

// ── o help/FAQ: âncora quebrada é link que leva a lugar nenhum
const idsAjuda = AJUDA.flatMap((sec) => sec.perguntas.map((p) => p.id));
ok(new Set(idsAjuda).size === idsAjuda.length, `ajuda: ${idsAjuda.length} perguntas, nenhum id repetido`);
const ancoras = [...JSON.stringify(AJUDA).matchAll(/\]\(#([a-z0-9-]+)\)/g)].map((m) => m[1]);
const quebradas = ancoras.filter((a) => !idsAjuda.includes(a));
ok(quebradas.length === 0, `ajuda: as ${ancoras.length} âncoras internas apontam pra pergunta que existe${quebradas.length ? ` (quebradas: ${quebradas.join(", ")})` : ""}`);
for (const site of ["bancada", "otech"] as const) {
  const sobra = ajudaDe(site).flatMap((sec) => sec.perguntas).filter((p) => p.so && p.so !== site);
  ok(sobra.length === 0, `ajuda: o site ${site} não mostra pergunta do outro`);
  // Âncora pra pergunta que o site esconde também leva a lugar nenhum.
  const visiveis = new Set(ajudaDe(site).flatMap((sec) => sec.perguntas.map((p) => p.id)));
  const escondidas = [...JSON.stringify(ajudaDe(site)).matchAll(/\]\(#([a-z0-9-]+)\)/g)].map((m) => m[1]).filter((a) => !visiveis.has(a));
  ok(escondidas.length === 0, `ajuda: no site ${site}, nenhuma âncora pra pergunta escondida${escondidas.length ? ` (${escondidas.join(", ")})` : ""}`);
}
const semNegrito = JSON.stringify([AJUDA, GLOSSARIO]).replace(/\*\*[^*]+\*\*/g, "");
ok(!semNegrito.includes("*"), "ajuda: só **negrito** — asterisco solto aparece cru na tela");
ok(GLOSSARIO.every((g, i) => i === 0 || GLOSSARIO[i - 1].termo.localeCompare(g.termo, "pt-BR") < 0), "ajuda: glossário em ordem alfabética, sem repetição");

console.log(falhas ? `\n${falhas} falha(s).` : "\nO desfecho das ideias está certo.");
process.exit(falhas ? 1 : 0);
