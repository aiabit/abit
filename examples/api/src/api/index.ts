import type { AbitRequestHandler } from '@abitjs/server';

export function GET() {
  return { hello: 'world' };
}

const handler: AbitRequestHandler = (req, res) => {
  console.log('handler', req.url, req.method);
  res.send('Hello from the API!');
};
export default handler;
