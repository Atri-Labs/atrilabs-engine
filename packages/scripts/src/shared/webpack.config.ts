import { ToolConfig } from "@atrilabs/core";
import path from "path";
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
import { CorePkgInfo, LayerEntry, ToolEnv, ToolPkgInfo } from "./types";
import emitBabelLoader from "./emitBabelLoader";

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

export default function createWebpackConfig(
  corePkgInfo: CorePkgInfo,
  toolPkgInfo: ToolPkgInfo,
  toolConfig: ToolConfig,
  layerEntries: LayerEntry[],
  toolEnv: ToolEnv,
  env: "production" | "development",
  shouldUseSourceMap: boolean
) {
  const isEnvDevelopment = env === "development";
  const isEnvProduction = env === "production";

  const getStyleLoaders = (cssOptions: any, preProcessor?: string): any => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve("postcss-loader"),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: "postcss",
            config: false,
            plugins: [
              "postcss-flexbugs-fixes",
              [
                "postcss-preset-env",
                {
                  autoprefixer: {
                    flexbox: "no-2009",
                  },
                  stage: 3,
                },
              ],
              // Adds PostCSS Normalize as the reset css with default options,
              // so that it honors browserslist config in package.json
              // which in turn let's users customize the target behavior as per their needs.
              "postcss-normalize",
            ],
          },
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      });
    }
    return loaders;
  };

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
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                modules: {
                  mode: "icss",
                },
              }),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                modules: {
                  mode: "local",
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              }),
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: "icss",
                  },
                },
                "sass-loader"
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
              test: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: "local",
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                "sass-loader"
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
