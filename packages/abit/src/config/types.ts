import type { OutgoingHttpHeaders } from 'http';
import type * as vite from 'vite';

export interface ViteUserConfig extends vite.UserConfig {
  ssr?: vite.SSROptions;
}

export interface AbitIntegration {
  name: string;

  hook: {
    setup: () => void | Promise<void>;
  };
}

interface ServerConfig {
  /**
   * @default `3000`
   */
  port?: number;
  /**
   * @default `false`
   */
  host?: string | boolean;
  /**
   * @default `{}`
   */
  headers?: OutgoingHttpHeaders;
}

export interface AbitUserConfig extends vite.UserConfig {
  /**
   * @default `"."`
   */
  root?: string;

  srcDir?: string;

  publicDir?: string;

  /**
   * @default `"./dist"`
   */
  outDir?: string;
  /**
   * @default `"./dist"`
   */
  base?: string;

  /**
   * @default `false`
   */
  adapter?: AbitIntegration;

  /**
   * @name Vite
   */
  vite?: ViteUserConfig;
}

export interface AbitConfig extends AbitUserConfig {
  root: string;
  inspect?: boolean;
}
