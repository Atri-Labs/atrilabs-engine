import {
  checkBrowsers,
  isInteractive,
  extractParams,
  createConfig,
  moduleFileExtensions,
} from "@atrilabs/commands-builder";
import webpack, { RuleSetRule } from "webpack";

export function runBuild(
  params: ReturnType<typeof extractParams> & {
    customLoaders?: RuleSetRule[];
    generateIndexHtml?: boolean;
    babel?: {
      plugins?: [string, any][];
    };
  }
) {
  const {
    paths,
    isEnvDevelopment,
    isEnvProduction,
    isEnvTest,
    isEnvProductionProfile,
    clientEnv,
    shouldUseSourceMap,
    publicUrlOrPath,
    entry,
    useTypeScript,
    prepareConfig,
    applyPlugins,
    additionalInclude,
    additionalNodeModules,
    outputFilename,
    customLoaders,
    generateIndexHtml,
    babel,
  } = params;

  checkBrowsers(paths.appPath, isInteractive()).then(() => {
    const webpackConfig = createConfig({
      isEnvDevelopment,
      isEnvProduction,
      isEnvTest,
      isEnvProductionProfile,
      clientEnv,
      shouldUseSourceMap,
      entry,
      paths,
      publicUrlOrPath,
      moduleFileExtensions,
      imageInlineSizeLimit: 10,
      shouldInlineRuntimeChunk: true,
      useTypeScript,
      additionalInclude,
      additionalNodeModules,
      outputFilename,
      customLoaders,
      generateIndexHtml,
      babel,
    });

    if (prepareConfig && typeof prepareConfig === "function") {
      prepareConfig(webpackConfig);
    }

    const compiler = webpack(webpackConfig);

    if (applyPlugins && typeof applyPlugins === "function") {
      applyPlugins(compiler);
    }

    compiler.run((err, stats) => {
      if (err) {
        console.log(err);
      }
      if (stats?.hasErrors()) {
        console.log(stats.toJson().errors);
      }
    });
  });
}
