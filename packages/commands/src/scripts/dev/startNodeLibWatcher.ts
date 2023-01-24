import {
  collectWebpackMessages,
  createDevNodeConfig,
  PrepareConfig,
  reportWarningsOrSuccess,
} from "@atrilabs/commands-builder";
import webpack from "webpack";

export default function startNodeLibWatcher(
  params: Parameters<typeof createDevNodeConfig>[0] & {
    prepareConfig?: PrepareConfig;
  }
) {
  const webpackConfig = createDevNodeConfig(params);

  if (typeof params.prepareConfig === "function") {
    params.prepareConfig(webpackConfig);
  }

  return new Promise<void>((resolve) => {
    webpack(webpackConfig, async (err, stats) => {
      const messages = await collectWebpackMessages({
        writeStats: true,
        err,
        stats,
        outputDir: params.paths.outputDir,
      });
      reportWarningsOrSuccess(messages.warnings);
      resolve();
    });
  });
}
