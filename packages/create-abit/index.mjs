#!/usr/bin/env node

(async () => {
  const { run } = await import('./dist/index.mjs');
  await run(process.argv.slice(2));
})();
