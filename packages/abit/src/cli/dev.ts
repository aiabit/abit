import type { WatchOptions } from 'chokidar';
import type { ViteDevServer } from 'vite';
import { createServer } from 'vite';
import { resolveConfig } from '../config';
import { started } from './prepare';

export async function createDevServer(
  root = process.cwd(),
  flags: any = {},
  restartServer: () => Promise<void>,
) {
  const config = await resolveConfig({ root, command: 'serve', mode: flags.mode });
  return createServer(config.inlineConfig);
}

export function resolveChokidarOptions(opts?: WatchOptions) {
  const { ignored = [], ...otherOptions } = opts ?? {};
  const resolvedChokidarOptions: WatchOptions = {
    ignored: [
      '**/.git/**',
      '**/node_modules/**',
      '**/test-results/**',
      ...(Array.isArray(ignored) ? ignored : [ignored]),
    ],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ...otherOptions,
  };

  return resolvedChokidarOptions;
}

export default async function dev(root: string, opts: any) {
  const config = await resolveConfig({
    root,
    command: 'serve',
    mode: opts.mode,
  });
  try {
    const createServer = async () => {
      const server: ViteDevServer = await createDevServer(config.root, opts, async () => {
        await server.close();
        await createServer();
      });
      await server.listen();
      await started({});
      server.printUrls();
    };
    await createServer();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
