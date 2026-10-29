/** Imposto nos EUA, no tamanho de uma tela. Fato geral; a faixa de cada um quem sabe é o contador. */
const ITENS: [string, string][] = [
  ['No papel não tem imposto', 'Enquanto as ideias forem seguidas no papel, não há nada a declarar.'],
  [
    'Até 1 ano: curto prazo',
    'O ganho entra como renda comum, na faixa federal de quem ganhou (10% a 37%). Quase toda ideia daqui é curto prazo — é o custo escondido de girar toda semana.',
  ],
  ['Mais de 1 ano: longo prazo', '0%, 15% ou 20% federais, conforme a renda. Acima de US$ 200 mil (US$ 250 mil o casal) soma 3,8% de NIIT.'],
  ['Estado', 'A maioria dos estados cobra imposto de renda sobre o ganho, curto ou longo. Na Georgia, alíquota única perto de 5%.'],
  ['Perda abate ganho', 'O que sobrar de perda abate até US$ 3 mil por ano da renda comum; o resto passa pro ano seguinte.'],
  ['Wash sale', 'Vender no prejuízo e recomprar o mesmo ativo (ou um praticamente igual) 30 dias antes ou depois anula a perda naquele ano.'],
  ['Opção de índice', 'Opção de SPX é “seção 1256”: 60% tributado como longo prazo, mesmo segurando um dia. Opção de SPY (ETF) não é.'],
  ['Cripto', 'O IRS trata como propriedade: mesma regra de curto e longo prazo.'],
  ['Mercado de previsão', 'O tratamento ainda não é pacífico. Guarde todos os extratos do Kalshi ou do Polymarket.'],
  ['IRA e Roth IRA', 'Dentro da conta de aposentadoria não há imposto a cada operação. É onde girar curto custa menos — com limite anual de aporte.'],
];

export default function Impostos() {
  return (
    <details className="group rounded-sm border border-line bg-surface">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between bg-strip px-3 text-[12px] font-bold uppercase tracking-[0.08em]">
        Imposto nos EUA, pro dia de sair do papel
        <span className="text-ink-3 transition-transform group-open:rotate-45" aria-hidden>
          +
        </span>
      </summary>
      <dl className="divide-y divide-line border-t border-line">
        {ITENS.map(([t, d]) => (
          <div key={t} className="grid gap-1 px-3.5 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="text-[14px] font-semibold">{t}</dt>
            <dd className="text-[14px] leading-relaxed text-ink-2">{d}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-line px-3.5 py-3 text-[12px] text-ink-3">Não é conselho fiscal. Um contador (CPA) confirma antes do primeiro dólar de verdade.</p>
    </details>
  );
}
