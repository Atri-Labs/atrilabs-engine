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
import { getCorePkgInfo, getExposedBlocks, readToolConfig } from "./utils";

function main() {
  // TODO: copy public folder if not already exists
  const params = extractParams();

  const additionalInclude = params.additionalInclude || [];
  additionalInclude.push(
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
      __non_webpack_require__.resolve("@atrilabs/base-layer")
    ),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve("@atrilabs/app-design-layer")
    )
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
    config.resolveLoader = {
      alias: {
        "api-entry-loader": path.resolve(
          __dirname,
          "..",
          "src",
          "scripts",
          "dev-editor",
          "loaders",
          "api-entry-loader.js"
        ),
        "browser-forest-manager-entry-loader": path.resolve(
          __dirname,
          "..",
          "src",
          "scripts",
          "dev-editor",
          "loaders",
          "browser-forest-manager-entry-loader.js"
        ),
        "manifest-registry-entry-loader": path.resolve(
          __dirname,
          "..",
          "src",
          "scripts",
          "dev-editor",
          "loaders",
          "manifest-registry-entry-loader.js"
        ),
        "block-registry-entry-loader": path.resolve(
          __dirname,
          "..",
          "src",
          "scripts",
          "dev-editor",
          "loaders",
          "block-registry-entry-loader.js"
        ),
      },
    };
  };

  const middlewares = params.middlewares;
  const wrapMiddlewares: Middlewares = (app, compiler, config) => {
    // TODO: insert the necessary logic for hot reload
    if (middlewares) {
      middlewares(app, compiler, config);
    }
  };

  const corePkgInfo = getCorePkgInfo();
  const toolConfig = readToolConfig();
  const customLoaders: RuleSetRule[] = [
    {
      test: corePkgInfo.apiFile,
      use: {
        loader: "api-entry-loader",
        options: {
          eventClientModulePath: toolConfig.clients.eventClient.modulePath,
        },
      },
    },
    {
      test: corePkgInfo.browserForestManagerFile,
      use: {
        loader: "browser-forest-manager-entry-loader",
        options: {
          forests: toolConfig.forests,
        },
      },
    },
    {
      test: corePkgInfo.manifestRegistryFile,
      use: {
        loader: "manifest-registry-entry-loader",
        options: {
          manifestSchema: toolConfig.manifestSchema,
        },
      },
    },
    {
      test: corePkgInfo.blockRegistryFile,
      use: {
        loader: "block-registry-entry-loader",
        options: {
          exposedBlocks: getExposedBlocks(toolConfig),
        },
      },
    },
  ];

  startDevServer({
    ...params,
    prepareConfig: wrapPrepareConfig,
    middlewares: wrapMiddlewares,
    outputFilename: "editor/js/pages/[name].js",
    customLoaders,
    generateIndexHtml: true,
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
}

main();
