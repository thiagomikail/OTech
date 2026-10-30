import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
// One page per app: the workbench home at /, the FMEA at /fmea/, PetriPLC at /petri/, Yield at /yield/ and Mercado at /mercado/.
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
