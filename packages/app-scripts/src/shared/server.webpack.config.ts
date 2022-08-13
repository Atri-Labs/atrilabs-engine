import { Configuration, ModuleOptions } from "webpack";
import { createCommonWebpackConfig } from "./common.webpack.config";
import { imageInlineSizeLimit, moduleFileExtensions } from "./utils";
// const nodeExternals = require("webpack-node-externals");

export type ServerWerbpackConfigOptions = {
  paths: {
    serverEntry: string;
    serverOutput: string;
    // include app src & manifest packages
    includes: string[];
    // useStore to be used on server side
    serverSideEntry: string;
  };
  mode: Configuration["mode"];
  publicUrlOrPath: string;
  shouldUseSourceMap: boolean;
  allowList: string[];
};

export default function createServerWebpackConfig(
  options: ServerWerbpackConfigOptions
) {
  const { shouldUseSourceMap } = options;
  const isEnvDevelopment = options.mode === "development";
  const isEnvProduction = options.mode === "production";
  const rules: ModuleOptions["rules"] = [];
  const { oneOf, plugins } = createCommonWebpackConfig({
    isEnvDevelopment,
    isEnvProduction,
    imageInlineSizeLimit,
    shouldUseSourceMap,
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
          sourceMaps: options.shouldUseSourceMap,
          inputSourceMap: options.shouldUseSourceMap,
        },
      },
    ],
  });

  /**
   * The allow list must contain all the dependency of the manifest packages,
   * and their dependencies dependency and so on. This will entail reading package.json
   * of all dependencies recursively. Currently we are parking this approach, instead,
   * we are taking a short route by bundling our node module dependencies as well like express.
   */
  // const allowListFunc = (moduleName: string) => {
  //   for (let i = 0; i < options.allowList.length; i++) {
  //     const allowPkg = options.allowList[i]!;
  //     if (moduleName.includes(allowPkg)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  const webpackConfig: Configuration = {
    mode: options.mode,
    entry: {
      app: { import: options.paths.serverEntry },
      serverSide: { import: options.paths.serverSideEntry },
    },
    target: "node",
    // externals: [nodeExternals({ allowlist: allowListFunc })],
    externalsPresets: { node: true },
    output: {
      path: options.paths.serverOutput,
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
      library: {
        name: "getAppText",
        type: "commonjs",
      },
    },
    resolve: {
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    },
    module: {
      rules,
    },
    plugins: [...plugins],
  };
  return webpackConfig;
}
