import { ToolConfig } from "@atrilabs/core";
import path from "path";
import { Configuration, DefinePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
import {
  CorePkgInfo,
  LayerEntry,
  ManifestSchemaEntry,
  RuntimeEntry,
  ToolEnv,
  ToolPkgInfo,
} from "./types";
import emitBabelLoader from "./emitBabelLoader";

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const imageInlineSizeLimit = parseInt(
  process.env["IMAGE_INLINE_SIZE_LIMIT"] || "10000"
);

const prepareEnv = (raw: ToolConfig["env"]) => {
  const stringified = {
    "process.env": Object.keys(raw).reduce((env: any, key) => {
      env["ATRI_TOOL_" + key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };
  return stringified;
};

export default function createWebpackConfig(
  corePkgInfo: CorePkgInfo,
  toolPkgInfo: ToolPkgInfo,
  toolConfig: ToolConfig,
  layerEntries: LayerEntry[],
  runtimeEntries: RuntimeEntry[],
  manifestSchemaEntries: ManifestSchemaEntry[],
  toolEnv: ToolEnv,
  mode: "production" | "development",
  shouldUseSourceMap: boolean
) {
  const isEnvDevelopment = mode === "development";
  const isEnvProduction = mode === "production";

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
    mode: mode,
    entry: {
      layers: {
        import: corePkgInfo.entryFile,
        dependOn: "shared",
      },
      manifestClient: {
        import: toolConfig.manifestClient.path,
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
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/[name].bundle.js",
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js",
      assetModuleFilename: "static/media/[name].[hash][ext]",
    },
    module: {
      rules: [
        /**
         * Loads source maps for packages in node_modules.
         * Layers will generally be located in node_modules.
         */
        {
          enforce: "pre",
          exclude: /node_modules/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve("source-map-loader"),
        },
        {
          oneOf: [
            {
              test: [/\.avif$/],
              type: "asset",
              mimetype: "image/avif",
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: "asset",
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: require.resolve("@svgr/webpack"),
                  options: {
                    prettier: false,
                    svgo: false,
                    svgoConfig: {
                      plugins: [{ removeViewBox: false }],
                    },
                    titleProp: true,
                    ref: true,
                  },
                },
                {
                  loader: require.resolve("file-loader"),
                  options: {
                    name: "static/media/[name].[hash].[ext]",
                  },
                },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              use: emitBabelLoader(
                layerEntries,
                runtimeEntries,
                manifestSchemaEntries,
                toolConfig.forests,
                corePkgInfo,
                mode,
                toolConfig.clients
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
      new DefinePlugin(prepareEnv(toolConfig.env)),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
      isEnvDevelopment &&
        new ReactRefreshWebpackPlugin({
          overlay: false,
        }),
    ].filter(Boolean),
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
  };
  return webpackConfig;
}
