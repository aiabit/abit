import type { Plugin } from 'vite';

export interface AbitjsOptions {
  serverEntry?: string;
}

export function abitjs(options: AbitjsOptions): Plugin[] {
  const plugins: Plugin[] = [];
  return plugins;
}
