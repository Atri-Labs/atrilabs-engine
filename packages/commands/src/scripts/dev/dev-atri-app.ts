#!/usr/bin/env node
import startDevServer from "../../commons/startDevServer";
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
import express from "express";
import { watchManifestDirs } from "./machine/watchManifestDirs";
import fs from "fs";
import { computeFSAndSend } from "./machine/computeFSAndSend";
import { processManifestDirsString } from "../../commons/processManifestDirsString";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

async function main() {
  interpreter.start();

  const params = extractParams();

  setFSWatchers();
  const manifestDirs = processManifestDirsString(params.manifestDirs);
  if (fs.existsSync("manifests")) {
    manifestDirs.push(path.resolve("manifests"));
  }
  watchManifestDirs(manifestDirs);

  await Promise.all([
    computeRouteObjects(),
    computeFSAndSend(interpreter, manifestDirs),
  ]);

  const additionalInclude = params.additionalInclude || [];
  additionalInclude.push(
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/atri-app-core")),
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/design-system")),
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/canvas-zone")),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve(
        "@atrilabs/react-component-manifest-schema"
      )
    ),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve("@atrilabs/app-design-forest")
    ),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve(
        "@atrilabs/component-icon-manifest-schema"
      )
    ),
    ...manifestDirs
  );
  params.additionalInclude = additionalInclude;

  params.paths.appSrc = process.cwd();

  const externals = {
    react: "React",
    "react-dom": "ReactDOM",
  };

  const prepareConfig = params.prepareConfig;
  const wrapPrepareConfig: PrepareConfig = (config) => {
    if (prepareConfig) {
      prepareConfig(config);
    }
    // TODO: insert the necessary logic for hot reload
    config.entry = createEntry;
    config.externals = {
      ...externals,
      "@atrilabs/manifest-registry": "__atri_manifest_registry__",
    };
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
        "register-components-loader": path.resolve(
          __dirname,
          "..",
          "src",
          "commons",
          "loaders",
          "register-components-loader.js"
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
    app.use((req, res, next) => {
      printRequest(req, interpreter);
      interpreter.send({ type: NETWORK_REQUEST, input: { req, res, next } });
    });
    app.use((req, res, next) => {
      if (
        req.method === "GET" &&
        req.originalUrl.endsWith("/dist/atri-editor/manifestRegistry.js")
      ) {
        // @ts-ignore
        const absManifestRegistryPath = __non_webpack_require__.resolve(
          "@atrilabs/pwa-builder/public/dist/atri-editor/manifestRegistry.js"
        );
        res.sendFile(absManifestRegistryPath);
      } else if (
        req.method === "GET" &&
        req.originalUrl.endsWith("/dist/atri-editor/manifestRegistry.js.map")
      ) {
        // @ts-ignore
        const absManifestRegistryPath = __non_webpack_require__.resolve(
          "@atrilabs/pwa-builder/public/dist/atri-editor/manifestRegistry.js.map"
        );
        res.sendFile(absManifestRegistryPath);
      } else {
        next();
      }
    });
    app.use(express.static(paths.appPublic));
  };

  startDevServer({
    ...params,
    prepareConfig: wrapPrepareConfig,
    middlewares: wrapMiddlewares,
    outputFilename: "atri/js/pages/[name].js",
    babel: {
      plugins: [
        [
          path.resolve(
            __dirname,
            "..",
            "src",
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

  const serverPath = path.join(params.paths.outputDir, "server", "pages");
  const paths = { ...params.paths, outputDir: serverPath };
  const allowlist = params.allowlist || [];
  allowlist.push("@atrilabs/atri-app-core");
  allowlist.push("@atrilabs/atri-app-core/src/editor-components");
  allowlist.push("@atrilabs/design-system");
  allowlist.push("@atrilabs/canvas-zone");
  allowlist.push("@atrilabs/atri-app-core/src/entries/renderPageServerSide");
  allowlist.push("@atrilabs/manifest-registry");
  startNodeLibWatcher({
    ...params,
    additionalInclude: [
      ...params.additionalInclude,
      path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve("@atrilabs/manifest-registry")
      ),
    ],
    paths,
    outputFilename: "[name].js",
    moduleFileExtensions,
    entry: createNodeEntry,
    prepareConfig: (config) => {
      const plugins = config.plugins || [];
      plugins.push(new NodeLibPlugin());
      config.plugins = plugins;
      config.resolveLoader = {
        alias: {
          "atri-pages-server-loader": path.resolve(
            __dirname,
            "..",
            "src",
            "scripts",
            "dev",
            "loaders",
            "atri-pages-server-loader.js"
          ),
        },
      };
    },
    allowlist,
  });
}

main().catch((err) => {
  console.log(err);
});
