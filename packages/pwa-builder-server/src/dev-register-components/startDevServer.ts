import {
  createConfig,
  extractParams,
  moduleFileExtensions,
} from "@atrilabs/commands-builder";
import path from "path";
import Express from "express";
import webpack from "webpack";
import fs from "fs";
import { createEntry } from "./createEntry";

export function startDevServer(options: {
  app: Express.Application;
  appHtml: string;
}) {
  const { app, appHtml } = options;
  const params = extractParams();
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
    middlewares,
    useTypeScript,
    prepareConfig,
    additionalNodeModules,
  } = params;

  paths.appHtml = appHtml;
  console.log(appHtml);

  const additionalInclude = params.additionalInclude || [];
  additionalInclude.push(
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve("@atrilabs/manifest-registry")
    ),
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/atri-app-core")),
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/core")),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve(
        "@atrilabs/react-component-manifest-schema"
      )
    ),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve(
        "@atrilabs/component-icon-manifest-schema"
      )
    ),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve("@atrilabs/forest")
    ),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve("@atrilabs/utils")
    )
  );

  params.additionalInclude = additionalInclude;

  params.paths.appSrc = path.resolve(process.cwd(), "manifests");

  if (!fs.existsSync(path.resolve(process.cwd(), "manifests"))) {
    fs.mkdirSync(path.resolve(process.cwd(), "manifests"), { recursive: true });
  }

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
    outputFilename: "manifests/js/pages/[name].js",
    generateIndexHtml: true,
    babel: {
      plugins: [
        [
          path.resolve(
            path.dirname(
              // @ts-ignore
              __non_webpack_require__.resolve("@atrilabs/commands")
            ),
            "scripts",
            "dev-editor",
            "babel-plugins",
            "replace-import-with-id.js"
          ),
          {},
        ],
      ],
    },
  });

  if (prepareConfig && typeof prepareConfig === "function") {
    prepareConfig(webpackConfig);
  }

  const externals = {
    react: "React",
    "react-dom": "ReactDOM",
  };

  webpackConfig.entry = createEntry;
  webpackConfig.externals = {
    ...externals,
    "@atrilabs/manifest-registry": "__atri_manifest_registry__",
  };
  webpackConfig.optimization = {
    ...webpackConfig.optimization,
    runtimeChunk: "single",
    splitChunks: { chunks: "all" },
  };
  webpackConfig.devServer = {
    ...webpackConfig.devServer,
    hot: true,
  };
  webpackConfig.resolveLoader = {
    alias: {
      "register-components-loader": path.resolve(
        path.dirname(
          // @ts-ignore
          __non_webpack_require__.resolve("@atrilabs/commands")
        ),
        "scripts",
        "dev-editor",
        "loaders",
        "register-components-loader.js"
      ),
    },
  };

  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    new webpack.HotModuleReplacementPlugin(),
  ];

  const compiler = webpack(webpackConfig);

  function wrapMiddleware(app: Express.Application) {
    if (middlewares) middlewares(app, compiler, webpackConfig);
  }

  wrapMiddleware(app);

  return compiler;
}
