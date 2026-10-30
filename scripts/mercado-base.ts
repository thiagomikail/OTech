/**
 * Imprime a base da caixa de perguntas do Mercado (o JSON que vira
 * /mercado/base.json e que api/perguntar.ts lê). Quem chama é o plugin
 * `mercadoBase` do vite.config.ts, a cada build — por um processo à parte,
 * pra o `tsc -b` do vite.config não puxar o src/ pra dentro dele.
 */
import { EDICOES } from '../src/mercado/edicoes';
import { pacoteDaBase } from '../src/mercado/perguntas';

process.stdout.write(JSON.stringify(pacoteDaBase('otech', EDICOES)));
