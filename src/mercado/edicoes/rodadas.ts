import type { Rodada } from "../tipos";

/**
 * O registro das rodadas de segunda, da mais nova pra mais antiga. Quem
 * escreve é a sessão de segunda, no fim (`COMO-PUBLICAR.md`, passo 9) —
 * também quando falha ou quando não há nada a fazer. Como a edição, rodada
 * registrada não se reescreve: cada rodada é uma entrada nova no topo.
 *
 * Este arquivo vai pra vitrine pública junto com as edições: nada de endereço
 * do app, token ou caminho de máquina nas notas.
 */
export const RODADAS: Rodada[] = [
  {
    semana: "2026-11-02",
    em: "2026-11-02T11:40:51Z",
    resultado: "falhou",
    etapas: [
      {
        etapa: "acesso",
        estado: "falhou",
        nota: "A sessão agendada abriu sem os repositórios e sem permissão de gravar: não leu o roteiro nem gravou nada.",
      },
    ],
    resumo:
      "Não rodou. A edição de 2 nov já estava publicada desde 29 out e nenhuma previsão tinha resolvido, então nada se perdeu. Registro feito depois, no mesmo dia, ao corrigir o acesso.",
  },
];
