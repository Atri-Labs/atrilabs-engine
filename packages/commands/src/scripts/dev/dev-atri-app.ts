#!/usr/bin/env node
import startDevServer from "./startDevServer";
import {
  Middlewares,
  PrepareConfig,
  extractParams,
} from "@atrilabs/commands-builder";
import { createEntry } from "./createEntry";
import path from "path";
import { handleRequest } from "./handleRequest";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

function main() {
  const params = extractParams();

  params.paths.appSrc = process.cwd();

  const prepareConfig = params.prepareConfig;
  const wrapPrepareConfig: PrepareConfig = (config) => {
    if (prepareConfig) {
      prepareConfig(config);
    }
    // TODO: insert the necessary logic for hot reload
    config.entry = createEntry;
    config.resolveLoader = {
      alias: {
        "atri-pages-client-loader": path.resolve(
          __dirname,
          "loaders",
          "atri-pages-client-loader.js"
        ),
        "atri-app-loader": path.resolve(
          __dirname,
          "loaders",
          "atri-app-loader.js"
        ),
      },
    };
    config.optimization = {
      ...config.optimization,
      runtimeChunk: "single",
    };
  };

  const middlewares = params.middlewares;
  const wrapMiddlewares: Middlewares = (app, compiler, config) => {
    // TODO: insert the necessary logic for hot reload
    if (middlewares) {
      middlewares(app, compiler, config);
    }
    handleRequest(app, compiler);
  };

  startDevServer({
    ...params,
    prepareConfig: wrapPrepareConfig,
    middlewares: wrapMiddlewares,
  });
}

main();
