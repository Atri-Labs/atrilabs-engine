#!/usr/bin/env node
import startDevServer from "./startDevServer";
import {
  Middlewares,
  PrepareConfig,
  extractParams,
  moduleFileExtensions,
} from "@atrilabs/commands-builder";
import { createEntry } from "./createEntry";
import path from "path";
import startNodeLibWatcher from "./startNodeLibWatcher";
import { createNodeEntry } from "./createNodeEntry";
import { interpreter } from "./init";
import { NETWORK_REQUEST } from "./serverMachine";
import { AppServerPlugin } from "./webpack-plugins/AppServerPlugin";
import { NodeLibPlugin } from "./webpack-plugins/NodeLibPlugin";
import { computeRouteObjects, setFSWatchers } from "./routeObjects";
import { printRequest } from "./utils";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

function main() {
  interpreter.start();

  setFSWatchers();
  computeRouteObjects();

  const params = extractParams();

  const additionalInclude = params.additionalInclude || [];
  additionalInclude.push(
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/atri-app-core"))
  );
  params.additionalInclude = additionalInclude;

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
          "..",
          "src",
          "scripts",
          "dev",
          "loaders",
          "atri-pages-client-loader.js"
        ),
        "atri-app-loader": path.resolve(
          __dirname,
          "..",
          "src",
          "scripts",
          "dev",
          "loaders",
          "atri-app-loader.js"
        ),
      },
    };
    config.optimization = {
      ...config.optimization,
      runtimeChunk: "single",
    };
    const plugins = config.plugins || [];
    plugins.push(new AppServerPlugin());
    config.plugins = plugins;
  };

  const middlewares = params.middlewares;
  const wrapMiddlewares: Middlewares = (app, compiler, config) => {
    // TODO: insert the necessary logic for hot reload
    if (middlewares) {
      middlewares(app, compiler, config);
    }
    app.use((req, res, next) => {
      printRequest(req);
      interpreter.send({ type: NETWORK_REQUEST, input: { req, res, next } });
    });
  };

  startDevServer({
    ...params,
    prepareConfig: wrapPrepareConfig,
    middlewares: wrapMiddlewares,
  });

  const serverPath = path.join(params.paths.outputDir, "server", "pages");
  const paths = { ...params.paths, outputDir: serverPath };
  const allowlist = params.allowlist || [];
  allowlist.push("@atrilabs/atri-app-core");
  startNodeLibWatcher({
    ...params,
    paths,
    outputFilename: "[name].js",
    moduleFileExtensions,
    entry: createNodeEntry,
    prepareConfig: (config) => {
      const plugins = config.plugins || [];
      plugins.push(new NodeLibPlugin());
      config.plugins = plugins;
    },
    allowlist,
  });
}

main();
