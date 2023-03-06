import esbuild from 'esbuild';
import glob from 'fast-glob';
import type { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import createFastify from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';

const fastifyRoutesPlugins = async (fastify: FastifyInstance, opts: IOptions, next: any) => {
  getApiRoutes(opts);
  const routes: [string, any][] = await import(opts.output);
  console.log('routes', routes);
  for (const [url, createRequestHandler] of routes) {
    const requestHandler = createRequestHandler;
    const methodKey = 'get';
    fastify[methodKey](url, requestHandler);
  }
  next();
};

export function routeToRegExp(route: string): [regexp: string, restName?: string] {
  // Backslash to slash
  route = route.replace(/\\/g, '/');

  let restParamName: string | undefined;

  const restMatch = route.match(/\/\[\.\.\.([a-zA-Z_][a-zA-Z0-9_]*)\]$/);
  if (restMatch) {
    const [rest, restName] = restMatch;
    route = route.slice(0, -rest.length);
    restParamName = restName;
  }

  return [
    route
      .split('/')
      .filter((x) => x !== 'index' && !x.startsWith('_'))
      .map((x) => {
        const escaped = encodeURIComponent(x);
        // Unescape [ and ]
        return escaped.replace(/%5B/g, '[').replace(/%5D/g, ']');
      })
      .join('/')
      .replace(
        // Escape special characters
        /[\\^$*+?.()|[\]{}]/g,
        (x) => `\\${x}`,
      )
      .replace(/\\\[[a-zA-Z_][a-zA-Z0-9_]*\\]/g, (name) => `(?<${name.slice(2, -2)}>[^/]*)`),
    restParamName,
  ];
}

function getApiRoutes(opts: IOptions) {
  const endpointFiles = glob.sync('**/*.ts', { cwd: join(opts.root), absolute: true });
  mkdirSync(dirname(opts.output), { recursive: true });
  let endpointImporters = '';

  for (const [i, endpointFile] of endpointFiles.entries()) {
    endpointImporters += `import e${i} from ${JSON.stringify(endpointFile)};\n`;
  }

  let exportStatement = `export default [`;

  const routes: RouteOptions[] = [];
  for (const [key, endpointFile] of Object.entries(endpointFiles)) {
    const relName = relative(opts.root, endpointFile);
    console.log(relName);
    const matches = /^(.*)\.(.*)$/.exec(relName);
    const [_, baseName] = matches || [];
    if (baseName) {
      const [re, rest] = routeToRegExp(join('/', opts.prefix, baseName));
      exportStatement += `  [${JSON.stringify(re)}, e${key}]\n`;
    }
  }
  exportStatement += ']';

  const out = [endpointImporters, exportStatement].filter(Boolean).join('\n');
  const { code } = esbuild.transformSync(out);
  writeFileSync(opts.output, code, 'utf8');
  return routes;
}

interface IOptions {
  root: string;
  prefix: string;
  output: string;
}

export async function createRequestHandler(config: any, opts: IOptions) {
  const fastify = createFastify();
  await fastify.register(fastifyPlugin(fastifyRoutesPlugins), {
    root: opts.root,
    prefix: opts.prefix,
    output: opts.output,
  });
  await fastify.ready();

  return async (req: any, res: any, next: any) => {
    if (
      fastify.hasRoute({
        method: req.method,
        url: req.url,
      })
    ) {
      fastify.routing(req, res);
    } else {
      next();
    }
  };
}
export type AbitRequestHandler = (req: FastifyRequest, res: FastifyReply) => void | Promise<void>;
