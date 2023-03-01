#!/usr/bin/env node

import { extractParams, PrepareConfig } from "@atrilabs/commands-builder";
import { computeManifestIRsForDirs } from "../../commons/computeManifestIRs";
import { processManifestDirsString } from "../../commons/processManifestDirsString";
import path from "path";
import { createEntry } from "./createEntry";
import {
  getCorePkgInfo,
  getExposedBlocks,
  readToolConfig,
} from "../dev-editor/utils";
import { RuleSetRule } from "webpack";
import { runBuild } from "./runBuild";

async function main() {
  const toolConfig = readToolConfig();
  const params = extractParams();
  const manifestDirs = processManifestDirsString([
    ...params.manifestDirs,
    ...toolConfig.manifestDirs.map(({ pkg }) => `#${pkg}`),
  ]);
  const irs = await computeManifestIRsForDirs(manifestDirs);

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
    ...toolConfig.layers.map(({ pkg }) => {
      return path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve(pkg)
      );
    }),
    ...toolConfig.shared.map(({ pkg }) => {
      return path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve(pkg)
      );
    }),
    ...toolConfig.runtimes.map(({ pkg }) => {
      return path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve(pkg)
      );
    }),
    ...manifestDirs,
    ...toolConfig.manifestSchema.map(({ pkg }) => {
      return path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve(pkg)
      );
    })
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
    config.entry = createEntry(irs);
    config.externals = {
      ...externals,
      "@atrilabs/manifest-registry": "__atri_manifest_registry__",
    };
    config.optimization = {
      ...config.optimization,
      runtimeChunk: "single",
      splitChunks: { chunks: "all" },
    };
    config.resolveLoader = {
      alias: {
        "browser-forest-manager-entry-loader": path.resolve(
          __dirname,
          "..",
          "src",
          "scripts",
          "dev-editor",
          "loaders",
          "browser-forest-manager-entry-loader.js"
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
        "register-components-loader": path.resolve(
          __dirname,
          "..",
          "src",
          "scripts",
          "dev-editor",
          "loaders",
          "register-components-loader.js"
        ),
      },
    };
  };

  const corePkgInfo = getCorePkgInfo();
  const customLoaders: RuleSetRule[] = [
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
      test: corePkgInfo.blockRegistryFile,
      use: {
        loader: "block-registry-entry-loader",
        options: {
          exposedBlocks: getExposedBlocks(toolConfig),
        },
      },
    },
  ];

  params.isEnvDevelopment = false;
  params.isEnvProduction = true;
  params.isEnvProductionProfile = false;
  params.isEnvTest = false;

  runBuild({
    ...params,
    prepareConfig: wrapPrepareConfig,
    outputFilename: "editor/js/[name].js",
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
