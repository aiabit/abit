import type { Format } from 'tsup';
import { defineConfig } from 'tsup';

const outExtensionFn = ({ format }: { format: Format }) => {
  if (format === 'esm') return { js: `.mjs` };
  if (format === 'iife') return { js: `.${format}.js` };
  return { js: `.cjs` };
};

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      vite: 'src/vite/index.ts',
    },
    platform: 'node',
    clean: true,
    dts: true,
    external: ['react', 'react-dom', 'vite'],
    format: ['cjs', 'esm'],
    outExtension: outExtensionFn,
  },
]);
