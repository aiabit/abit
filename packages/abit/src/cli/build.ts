import { build as viteBuild } from 'vite';
import { resolveConfig } from '../config';

export default async function build(root: string, opts: any) {
  const config = await resolveConfig({
    root,
    command: 'build',
    mode: opts.mode,
  });

  await viteBuild(config.inlineConfig);
}
