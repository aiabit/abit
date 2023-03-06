import connect from 'connect';
import consola from 'consola';

interface Server {
  app: connect.Server;
  listen: (port: number) => Promise<void>;
}

interface ServerConfig {
  matchedRoutes(url?: string): boolean;
}

export async function createServer(_config: ServerConfig): Promise<Server> {
  const app = connect();
  consola.log('11111', app);

  const listen = async (port: number) => {
    return new Promise<void>((resolve) => {
      app.listen(port, () => {
        resolve();
      });
    });
  };

  app.use((req, res, next) => {
    consola.log(req.url);
    next();
  });

  const server: Server = {
    app,
    listen,
  };

  return server;
}
