#!/usr/bin/env node

import {
  extractParams,
  Middlewares,
  PrepareConfig,
} from "@atrilabs/commands-builder";
import { createEntry } from "./createEntry";
import path from "path";
import startDevServer from "../dev/startDevServer";
import { RuleSetRule } from "webpack";

function main() {
  // TODO: copy public folder if not already exists

  const params = extractParams();

  const additionalInclude = params.additionalInclude || [];
  additionalInclude.push(
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/atri-app-core")),
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/core"))
  );
  params.additionalInclude = additionalInclude;

  params.paths.appSrc = process.cwd();

  const prepareConfig = params.prepareConfig;
  const wrapPrepareConfig: PrepareConfig = (config) => {
    if (prepareConfig) {
      prepareConfig(config);
    }
    config.entry = createEntry;
    config.externals = {
      react: "React",
      "react-dom": "ReactDOM",
    };
    config.optimization = {
      ...config.optimization,
      runtimeChunk: "single",
      splitChunks: { chunks: "all" },
    };
    config.devServer = {
      ...config.devServer,
      hot: true,
    };
  };

  const middlewares = params.middlewares;
  const wrapMiddlewares: Middlewares = (app, compiler, config) => {
    // TODO: insert the necessary logic for hot reload
    if (middlewares) {
      middlewares(app, compiler, config);
    }
  };

  const customLoaders: RuleSetRule[] = [];

  startDevServer({
    ...params,
    prepareConfig: wrapPrepareConfig,
    middlewares: wrapMiddlewares,
    outputFilename: "editor/js/pages/[name].js",
    customLoaders,
    generateIndexHtml: true,
  });
}

main();
