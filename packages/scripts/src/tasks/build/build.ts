#!/usr/bin/env node
import { webpack, Configuration } from "webpack";
import path from "path";
import {
  extractLayerEntries,
  getToolPkgInfo,
  importToolConfig,
} from "../../shared/utils";
import emitBabelLoader from "../../shared/emitBabelLoader";
import { createGlobalModuleForLayer } from "../../shared/processLayer";

const toolPkgInfo = getToolPkgInfo();

importToolConfig(toolPkgInfo.configFile)
  .then(async (toolConfig) => {
    const layerEntries = await extractLayerEntries(toolConfig, toolPkgInfo);

    // create global module for each layer
    layerEntries.forEach((layerEntry) => {
      createGlobalModuleForLayer(layerEntry);
    });

    // bundle ui
    const webpackConfig: Configuration = {
      target: "web",
      entry: {
        layers: {
          import: require.resolve("@atrilabs/core/lib/layers.js"),
          dependOn: "shared",
        },
        shared: ["react", "react-dom"],
      },
      /**
       * Inlcude source map in the bundle for devtools.
       */
      devtool: "source-map",
      output: {
        path: path.resolve(toolPkgInfo.dir, toolConfig.output),
      },
      module: {
        rules: [
          /**
           * Loads source maps for packages in node_modules.
           * Layers will generally be located in node_modules.
           */
          {
            enforce: "pre",
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            test: /\.(js|mjs|jsx|ts|tsx|css)$/,
            loader: require.resolve("source-map-loader"),
          },
          {
            oneOf: [
              {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                use: emitBabelLoader(layerEntries),
              },
            ],
          },
        ],
      },
    };
    webpack(webpackConfig, (err, stats) => {
      let buildFailed = false;
      if (err) {
        buildFailed = true;
        console.error(err);
      }
      if (stats?.hasErrors()) {
        buildFailed = true;
        console.log(stats?.toJson().errors);
      }
      if (!buildFailed) {
        console.log(`Build completed!`);
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
