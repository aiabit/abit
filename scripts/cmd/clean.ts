import path from 'path';
import rimraf from 'rimraf';
import { eachPkg, getPkgs } from '../utils';

(() => {
  const pkgs = getPkgs();
  eachPkg(pkgs, ({ dir }) => {
    rimraf.sync(path.join(dir, 'dist'));
    rimraf.sync(path.join(dir, '.turbo'));
  });
})();
