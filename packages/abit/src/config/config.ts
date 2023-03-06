import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
import { InlineConfig, loadConfigFromFile, resolveConfig as resolveViteConfig } from 'vite';
import { AbitUserConfig } from './types';
interface ResolveConfigOptions {
  root: string;
  command: 'build' | 'serve';
  mode: string;
}

function search(root: string) {
  const paths = [
    '.abitrc.ts',
    '.abitrc.js',
    'abit.config.mjs',
    'abit.config.js',
    'abit.config.ts',
    'abit.config.mts',
    'abit.config.cjs',
    'abit.config.cts',
  ].map((p) => path.join(root, p));

  for (const file of paths) {
    if (fs.existsSync(file)) {
      return file;
    }
  }
  throw new Error(`No config file found in ${root}`);
}

export async function resolveUserConfig(
  opts: ResolveConfigOptions,
): Promise<[string, AbitUserConfig, string[]]> {
  const { root, command, mode = 'production' } = opts;
  const configPath = search(root);
  const start = performance.now();
  const result = await loadConfigFromFile({ command, mode: mode }, configPath);
  if (result) {
    const { config, dependencies } = result;
    // consola.log(`${performance.now() - start}`, config);
    // Use vite internal config loader
    return [configPath, config as AbitUserConfig, dependencies];
  } else {
    return [configPath, {} as AbitUserConfig, []];
  }
}

export async function resolveConfig(opts: ResolveConfigOptions) {
  let { root, command, mode } = opts;
  if (!root) {
    root = process.env.ABIT_ROOT || process.cwd();
    process.env.ABIT_ROOT = root;
  }

  const [configPath, userConfig, configDeps] = await resolveUserConfig({
    root,
    command,
    mode,
  });

  const inlineConfig: InlineConfig = {
    root: userConfig.root || root,
    server: {
      ...userConfig.server,
      port: userConfig.server?.port || 3001,
    },
    plugins: [],
  };

  const config = await resolveViteConfig(inlineConfig, opts.command, opts.mode);
  // consola.log(config);
  return config;
}
export { AbitUserConfig };
