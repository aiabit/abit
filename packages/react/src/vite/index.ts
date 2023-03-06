import type { Plugin } from 'vite';

export type Options = {
  adapter: string | { start(): void; build(): void };
  appRoot: string;
  routesDir: string;
  ssr: boolean;
  islands: boolean;
  islandsRouter: boolean;
  prerenderRoutes: any[];
  inspect: boolean;
  rootEntry: string;
  serverEntry: string;
  clientEntry: string;
};

const plugin: (options?: Partial<Options>) => Plugin[] = (options) => {
  return [];
};

export default plugin;
