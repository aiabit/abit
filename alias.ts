import { resolve } from 'path';

const r = (p: string) => resolve(__dirname, p);

export const alias: Record<string, string> = {
  '@abitjs/cli': r('./packages/cli/src/'),
  '@abitjs/core': r('./packages/core/src/'),
  '@abitjs/create-abit': r('./packages/create-abit/src/'),
  '@abitjs/node': r('./packages/node/src/'),
  '@abitjs/react': r('./packages/react/src/'),
  '@abitjs/server': r('./packages/server/src/'),
  '@abitjs/vite': r('./packages/vite/src/'),
  abit: r('./packages/abit/src/'),
};
