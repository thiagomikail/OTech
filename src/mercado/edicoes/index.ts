import type { Edicao } from "../tipos";
import { edicao as e20261102 } from "./2026-11-02";

/**
 * Todas as edições, da mais nova pra mais antiga. Edição nova: um arquivo
 * `AAAA-MM-DD.ts` com a segunda da semana, e uma linha aqui. O passo a passo
 * está em `lib/mercado/COMO-PUBLICAR.md`.
 */
export const EDICOES: Edicao[] = [e20261102].sort((a, b) => b.semana.localeCompare(a.semana));
