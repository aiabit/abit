import consola from 'consola';
import { resolveConfig } from '../config';
// import { ViteDevServer } from 'vite';

export default async function start(root: string, opts: { port?: number }) {
  const config = await resolveConfig({
    root,
    command: 'serve',
    mode: 'production',
  });
  try {
    const createServer = async () => {
      // const { createDevServer } = await import(`./dev.mjs?t=${Date.now()}`);
      // const server: ViteDevServer = await createDevServer(config.root, opts, async () => {
      //   await server.close();
      //   await createServer();
      // });
      // await server.listen();
      // await started({});
      // server.printUrls();
    };
    await createServer();
  } catch (e: any) {
    consola.error(e);
    process.exit(1);
  }
}
