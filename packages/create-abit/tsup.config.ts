import type { Format } from 'tsup';
import { defineConfig } from 'tsup';

const outExtensionFn = ({ format }: { format: Format }) => {
  if (format === 'esm') return { js: `.mjs` };
  if (format === 'iife') return { js: `.${format}.js` };
  return { js: `.cjs` };
};

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/cli.ts'],
    platform: 'node',
    clean: true,
    dts: true,
    format: ['cjs', 'esm'],
    external: ['vite', '@abitjs/vite', 'chokidar'],
    outExtension: outExtensionFn,
  },
]);
