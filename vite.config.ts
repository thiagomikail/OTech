/// <reference lib="es2020" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * A base da caixa de perguntas do Mercado, em /mercado/base.json: é o que
 * api/perguntar.ts lê. Sai de scripts/mercado-base.ts, rodado à parte — se
 * este arquivo importasse o src/, o `tsc -b` compilaria o src/ junto. O
 * child_process vem por import dinâmico porque o projeto não tem @types/node.
 */
const mercadoBase = (): Plugin => ({
  name: 'mercado-base',
  async generateBundle() {
    const { execFileSync } = await import('node:child_process' as string);
    const source: string = execFileSync('node', ['--import', 'tsx', 'scripts/mercado-base.ts'], { encoding: 'utf8' });
    this.emitFile({ type: 'asset', fileName: 'mercado/base.json', source });
  },
});

// https://vitejs.dev/config/
// One page per app: the workbench home at /, the FMEA at /fmea/, PetriPLC at /petri/, Yield at /yield/ and Mercado at /mercado/.
export default defineConfig({
  plugins: [react(), tailwindcss(), mercadoBase()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        fmea: 'fmea/index.html',
        petri: 'petri/index.html',
        yield: 'yield/index.html',
        mercado: 'mercado/index.html',
        mercadoAjuda: 'mercado/ajuda/index.html',
      },
    },
  },
});
