import { ModuleOptions, Configuration } from "webpack";
import { createCommonWebpackConfig } from "./common.webpack.config";
import { imageInlineSizeLimit, moduleFileExtensions } from "./utils";

const HtmlWebpackPlugin = require("html-webpack-plugin");

export type CreateWebpackConfigOptions = {
  paths: {
    appEntry: string;
    appOutput: string;
    appHtml: string;
    // include app src & manifest packages
    includes: string[];
    wsClientEntry?: string;
  };
  mode: Configuration["mode"];
  publicUrlOrPath: string;
  shouldUseSourceMap: boolean;
  assetUrlPrefix: string;
};

export default function createWebpackConfig(
  options: CreateWebpackConfigOptions
) {
  const { shouldUseSourceMap } = options;
  const isEnvDevelopment = options.mode === "development";
  const isEnvProduction = options.mode === "production";

  const rules: ModuleOptions["rules"] = [];
  if (options.shouldUseSourceMap) {
    rules.push({
      enforce: "pre" as "pre",
      exclude: /node_modules/,
      test: /\.(js|mjs|jsx|ts|tsx|css)$/,
      loader: require.resolve("source-map-loader"),
    });
  }
  const { oneOf, plugins } = createCommonWebpackConfig({
    isEnvDevelopment,
    isEnvProduction,
    shouldUseSourceMap,
    imageInlineSizeLimit,
  });
  rules.push({
    oneOf: [
      ...oneOf,
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: options.paths.includes,
        loader: require.resolve("babel-loader"),
        options: {
          customize: require.resolve(
            "babel-preset-react-app/webpack-overrides"
          ),
          presets: [
            [
              require.resolve("babel-preset-react-app"),
              {
                runtime: "automatic",
              },
            ],
          ],
          plugins: [
            require.resolve(
              "@atrilabs/scripts/build/babel/replace-import-with-id"
            ),
          ],
          babelrc: false,
          configFile: false,
          sourceMaps: shouldUseSourceMap,
          inputSourceMap: shouldUseSourceMap,
        },
      },
    ],
  });

  const entries: Configuration["entry"] = {
    app: { import: options.paths.appEntry },
  };
  if (options.paths.wsClientEntry) {
    entries["wsclient"] = { import: options.paths.wsClientEntry };
  }

  const webpackConfig: Configuration = {
    mode: options.mode,
    entry: entries,
    output: {
      path: options.paths.appOutput,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : isEnvDevelopment
        ? "static/js/[name].bundle.js"
        : undefined,
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : isEnvDevelopment
        ? "static/js/[name].chunk.js"
        : undefined,
      assetModuleFilename: "static/media/[name].[hash][ext]",
      publicPath: options.publicUrlOrPath,
    },
    module: {
      rules,
    },
    plugins: [
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: options.paths.appHtml,
            publicPath: options.assetUrlPrefix || "auto",
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      ...plugins,
    ],
    resolve: {
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    },
  };

  return webpackConfig;
}
