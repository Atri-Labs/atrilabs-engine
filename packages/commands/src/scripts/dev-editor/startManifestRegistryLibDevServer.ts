import {
  extractParams,
  createLibConfig,
  moduleFileExtensions,
} from "@atrilabs/commands-builder";
import { ToolConfig } from "@atrilabs/core";
import path from "path";

import webpack, { Configuration, RuleSetRule } from "webpack";
import { createManifestRegistryLibEntry } from "./createManifestRegistryLibEntry";
import { CorePkgInfo } from "./types";
import { ManifestRegistryLibPlugin } from "./webpack-plugins/ManifestRegistryLibPlugin";

export default function startManifestRegistryLibDevServer(
  params: ReturnType<typeof extractParams> & {
    customLoaders?: RuleSetRule[];
    generateIndexHtml?: boolean;
    babel?: {
      plugins?: [string, any][];
    };
  } & {
    externals: Configuration["externals"];
    toolConfig: ToolConfig;
    corePkgInfo: CorePkgInfo;
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
    additionalInclude,
    additionalNodeModules,
    customLoaders,
    generateIndexHtml,
    babel,
    externals,
    toolConfig,
    corePkgInfo,
  } = params;

  const outputFilename = "manifestRegistry.js";

  const webpackConfig = createLibConfig({
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
    customLoaders: [
      ...(customLoaders || []),
      {
        test: corePkgInfo.manifestRegistryFile,
        use: {
          loader: "manifest-registry-entry-loader",
          options: {
            manifestSchema: toolConfig.manifestSchema,
          },
        },
      },
    ],
    generateIndexHtml,
    babel,
  });

  webpackConfig.entry = createManifestRegistryLibEntry;

  webpackConfig.watch = true;

  webpackConfig.externals = externals;

  webpackConfig.resolveLoader = {
    alias: {
      "manifest-registry-entry-loader": path.resolve(
        __dirname,
        "..",
        "src",
        "scripts",
        "dev-editor",
        "loaders",
        "manifest-registry-entry-loader.js"
      ),
    },
  };

  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    new ManifestRegistryLibPlugin(),
  ];

  webpackConfig.output = {
    filename: outputFilename,
    path: "node_modules/.cache/atri-editor",
  };

  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      console.log(err);
    }
    if (stats?.hasErrors()) {
      console.log(stats.toJson().errors);
    }
  });
}
