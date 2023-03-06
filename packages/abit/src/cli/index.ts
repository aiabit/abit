import { cac } from 'cac';
import path from 'path';
import { performance } from 'perf_hooks';
import { version } from '../../package.json';
import { prepare } from './prepare';

export interface AbitCliOptions {
  '--'?: string[];
  c?: boolean | string;
  config?: string;
  base?: string;
  // l?: LogLevel;
  // logLevel?: LogLevel;
  clearScreen?: boolean;
  d?: boolean | string;
  debug?: boolean | string;
  f?: string;
  filter?: string;
  m?: string;
  mode?: string;
  inspect?: boolean;
}

/**
 * removing global flags before passing as command specific sub-configs
 */
export function cleanOptions<Options extends AbitCliOptions>(
  options: Options,
): Omit<Options, keyof AbitCliOptions> {
  const ret = { ...options };
  delete ret['--'];
  delete ret.c;
  delete ret.config;
  delete ret.base;
  delete ret.clearScreen;
  delete ret.d;
  delete ret.debug;
  delete ret.f;
  delete ret.filter;
  delete ret.m;
  delete ret.mode;
  return ret;
}

export async function cli(args: string[]) {
  const cli = cac('abit');

  cli
    .command('[root]', 'Start a development server', {
      ignoreOptionDefaultValue: true,
    })
    .alias('dev')
    .alias('serve')
    .option('--config <path>', 'Use a custom config file')
    .option('-i, --inspect', 'Node inspector', { default: false })
    .option('-p, --port <port>', 'Port to start server on', { default: 3000 })
    .option('-o, --open', 'Open a browser tab', { default: false })
    .option('--host [host]', `[string] specify hostname`)
    .option('--https', `[boolean] use TLS + HTTP/2`)
    .option('--cors', `[boolean] enable CORS`)
    .option('--strictPort', `[boolean] exit if specified port is already in use`)
    .option('--force', `[boolean] force the optimizer to ignore the cache and re-bundle`)
    .action(async (root: string, flags: any) => {
      root = path.resolve(root || '.');
      const { default: dev } = await import('./dev');
      await prepare({});
      await dev(root, flags);
    });

  cli
    .command('routes [root]', 'List all routes', {
      ignoreOptionDefaultValue: true,
    })
    .action(async (root: string, flags: any) => {
      root = path.resolve(root || '.');
      const { default: routes } = await import('./routes');
      await prepare({});
      await routes(root, flags);
    });

  cli
    .command('build [root]', 'build for production', {
      ignoreOptionDefaultValue: true,
    })
    .option('--config <path>', 'Use a custom config file')
    .action(async (root: string, flags: any) => {
      root = path.resolve(root || '.');
      const { default: build } = await import('./build');
      await prepare({});
      await build(root, flags);
    });

  cli
    .command('start [root]', 'serve for production', {
      ignoreOptionDefaultValue: true,
    })
    .option('-p, --port <port>', 'Port to start server on', { default: 3000 })
    .option('-o, --open', 'Open a browser tab', { default: false })
    .option('--watch', 'watch for file changes')
    .option('--config <path>', 'Use a custom config file')
    .option('--inspect', 'enable the Node.js inspector')
    .option('-h, --host <host>', 'dev server host', { default: '0.0.0.0' })
    .option('-p, --port <port>', 'dev server port', { default: 3000 })
    .action(async (root: string, flags: any) => {
      root = path.resolve(root || '.');
      const { default: start } = await import('./start');
      await prepare({});
      await start(root, flags);
    });

  // Listen to unknown commands
  cli.on('command:*', () => {
    console.error('Invalid command: %s', cli.args.join(' '));
    process.exit(1);
  });

  cli.help();
  cli.version(version);
  cli.parse(args, { run: false });
  await cli.runMatchedCommand();
}

// @ts-ignore
globalThis.startTime = performance.now();

export function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}
