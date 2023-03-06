#!/usr/bin/env node

import assert from 'assert';
import consola from 'consola';
import { sync } from 'cross-spawn';
import fs from 'node:fs';
import path from 'node:path';
import c from 'picocolors';
import { fileURLToPath } from 'url';

const argv = process.argv.slice(2);
const name = argv[0];

const scriptsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), `./cmd/${name}.ts`);

assert(
  fs.existsSync(scriptsPath) && !name.startsWith('.'),
  `Executed script '${c.red(name)}' does not exist`,
);

consola.log(c.cyan(`abit-scripts: ${name}\n`));

const spawn = sync('npx', ['tsx', scriptsPath, ...argv.slice(1)], {
  env: process.env,
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true,
});
if (spawn.status !== 0) {
  consola.log(c.red(`abit-scripts: ${name} execute fail`));
  process.exit(1);
} else {
  consola.log(c.green(`abit-scripts: ${name} execute success`));
}
