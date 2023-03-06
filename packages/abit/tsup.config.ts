import type { Format } from 'tsup';
import { defineConfig } from 'tsup';

const outExtensionFn = ({ format }: { format: Format }) => {
  if (format === 'esm') return { js: `.mjs` };
  if (format === 'iife') return { js: `.${format}.js` };
  return { js: `.cjs` };
};

const config = defineConfig([
  {
    entry: ['src/index.ts'],
    platform: 'node',
    splitting: false,
    clean: true,
    dts: true,
    format: ['cjs', 'esm'],
    external: ['es-module-lexer'],
    outExtension: outExtensionFn,
  },
  {
    entry: {
      cli: './src/cli/index.ts',
    },
    format: ['esm'],
    platform: 'node',
    bundle: true,
    dts: true,
    external: ['vite', 'consola'],
  },
]);

export default config;
