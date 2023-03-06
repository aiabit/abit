import { resolveConfig } from '../config';
import { Router } from '../routing';

export default async function router(root: string, opts: any) {
  const config = await resolveConfig({
    root,
    command: 'build',
    mode: opts.mode,
  });

  const router = new Router({
    baseDir: 'src/routes',
    pageExtensions: ['jsx', 'tsx', 'js', 'ts'],
    cwd: config.root,
    ignore: [],
  });
  await router.init();
  // const inlineConfig: InlineConfig = await getAbitViteConfig(config, opts);

  // await viteBuild(inlineConfig);
}
