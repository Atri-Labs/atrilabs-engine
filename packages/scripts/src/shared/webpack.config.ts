import { ToolConfig } from "@atrilabs/core";
import path from "path";
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
import { CorePkgInfo, LayerEntry, ToolEnv, ToolPkgInfo } from "./types";
import emitBabelLoader from "./emitBabelLoader";

export default function createWebpackConfig(
  corePkgInfo: CorePkgInfo,
  toolPkgInfo: ToolPkgInfo,
  toolConfig: ToolConfig,
  layerEntries: LayerEntry[],
  toolEnv: ToolEnv
) {
  const webpackConfig: Configuration = {
    target: "web",
    entry: {
      layers: {
        import: corePkgInfo.entryFile,
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
              use: emitBabelLoader(
                layerEntries,
                toolConfig.forests,
                corePkgInfo
              ),
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ inject: true, template: toolPkgInfo.toolHtml }),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, toolEnv),
    ],
  };
  return webpackConfig;
}
