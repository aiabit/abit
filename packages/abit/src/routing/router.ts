import chokidar from 'chokidar';
import { dequal } from 'dequal';
import { init, parse } from 'es-module-lexer';
import esbuild from 'esbuild';
import glob from 'fast-glob';
import fs from 'fs';
import { join } from 'path';

const API_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

/**
 * @param {string} id
 * @param removePathlessLayouts
 * @returns
 */
export function toPath(id: string, removePathlessLayouts = true) {
  const idWithoutIndex = id.endsWith('/index') ? id.slice(0, -'index'.length) : id;
  return (
    removePathlessLayouts ? idWithoutIndex.replace(/\/\([^)/]+\)/g, '') : idWithoutIndex
  ).replace(/\[([^\/]+)\]/g, (_, m) => {
    if (m.length > 3 && m.startsWith('...')) {
      return `*${m.slice(3)}`;
    }
    if (m.length > 2 && m.startsWith('[') && m.endsWith(']')) {
      return `:${m.slice(1, -1)}?`;
    }
    return `:${m}`;
  });
}

interface RouteItem {
  componentPath?: string;
  id: string;
  path: string;
  apiPath?: Record<string, any>;
  dataPath?: string;
}

export class Router {
  protected routes: Record<string, RouteItem> = {};
  protected watcher?: chokidar.FSWatcher;
  protected cwd: string;
  protected baseDir: string;
  protected ignore: (string | RegExp)[];
  protected pageExtensions: string[];
  constructor({
    baseDir = 'src/routes',
    pageExtensions = ['jsx', 'tsx', 'js', 'ts'],
    cwd = process.cwd(),
    ignore = [],
  }) {
    this.cwd = cwd;
    this.baseDir = baseDir;
    this.ignore = ignore;
    this.pageExtensions = pageExtensions;
  }

  async init() {
    await init;

    if (this.watcher) {
      await this.watcher.close();
    }

    const routes = glob.sync([`${this.baseDir}/**/*`], {
      cwd: this.cwd,
      dot: true,
    });

    routes.forEach((route) => {
      this.processFile(route);
    });
    console.log(this.routes);
  }

  processFile(path: string) {
    const pageRegex = new RegExp(`\\.(${this.pageExtensions.join('|')})$`);
    if (path.match(pageRegex)) {
      const id = path.slice(this.baseDir.length).replace(pageRegex, '');
      const routeConfig = {} as RouteItem;

      if (path.match(new RegExp(`\\.(${['ts', 'tsx', 'jsx', 'js'].join('|')})$`))) {
        let code = fs.readFileSync(join(this.cwd, path)).toString();
        try {
          const [imports, exports] = parse(
            esbuild.transformSync(code, {
              jsx: 'transform',
              format: 'esm',
              loader: 'tsx',
            }).code,
          );

          if (exports.find(($) => $.n === 'default')) {
            routeConfig.componentPath = path;
          }

          for (const method of API_METHODS) {
            if (exports.find(($) => $.n === method)) {
              if (!routeConfig.apiPath) {
                routeConfig.apiPath = {};
              }

              routeConfig.apiPath[method] = path;
              // this.setAPIRoute(id, method, path);
            }
          }

          if (exports.find(($) => $.n === 'routeData')) {
            routeConfig.dataPath = path + '?data';
            // this.setRouteData(id, path + "?data");
            // dataFn = src.replace("tsx", "data.ts");
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        routeConfig.componentPath = path;
        // this.setRouteComponent(id, path);
        // this.setRouteComponent(id, path);
      }

      if (this.routes[id]) {
        // get old config, we want to compare the oldConfig with the new one to
        // detect changes and restart the vite server
        const { id: oldID, path: oldPath, ...oldConfig } = this.routes[id];
        const newConfig = { ...routeConfig };

        if (oldConfig.dataPath && !oldConfig.dataPath.endsWith('?data') && !newConfig.dataPath) {
          newConfig.dataPath = oldConfig.dataPath;
        }

        if (!dequal(oldConfig, newConfig)) {
          this.routes[id] = Object.assign({ id, path: toPath(id) || '/' }, newConfig);
          this.notify(path);
        }
      } else {
        this.routes[id] = Object.assign({ id, path: toPath(id) || '/' }, routeConfig);
        this.notify(path);
      }
    }
  }

  notify(path: string) {
    console.log(path);
  }
}
