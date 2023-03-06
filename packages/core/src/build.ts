import c from 'picocolors';
import { InlineConfig, resolveConfig, ResolvedConfig } from 'vite';

interface BuildOptions {
  onStart?: () => void | Promise<void>;
  onMissingConfigFile?(
    resolvedConfig: ResolvedConfig,
  ): InlineConfig | undefined | Promise<InlineConfig | undefined>;

  onInitialConfigResolved?(resolvedConfig: ResolvedConfig): void | Promise<void>;
}

export async function build(config: InlineConfig = {}, options: BuildOptions) {
  console.log('ccc', c.red('ccc'));

  let initialConfig = await resolveConfig(
    {
      ...config,
      mode: 'builder',
    },
    'build',
  ).catch((error) => {
    console.error(c.red(`error resolving config:\n${error.stack}`), {
      error,
    });
    process.exit(1);
  });

  if (!initialConfig.configFile && options.onMissingConfigFile) {
    const maybeInlineConfig = await options.onMissingConfigFile(initialConfig);
    if (maybeInlineConfig) {
      initialConfig = await resolveConfig(
        {
          ...maybeInlineConfig,
          mode: 'builder',
        },
        'build',
      ).catch((error) => {
        console.error(c.red(`error resolving config:\n${error.stack}`), {
          error,
        });
        process.exit(1);
      });
    }
  }
  await options?.onInitialConfigResolved?.(initialConfig);

  const tasks = [{ name: 'default' }];
  for (const [i, task] of tasks.entries()) {
    let resolvedStepConfig: ResolvedConfig;

    const buildPlugin = {
      name: '@abitjs/build',
    };
  }
}
