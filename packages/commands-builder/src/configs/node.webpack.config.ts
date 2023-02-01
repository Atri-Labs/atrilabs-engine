import { Configuration } from "webpack";
import path from "path";
import createEnvironmentHash from "./utils/createEnvironmentHash";
import fs from "fs";
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
import {
  babelRuntimeEntry,
  babelRuntimeEntryHelpers,
  babelRuntimeRegenerator,
} from "./utils/allowedModules";
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
const ForkTsCheckerWebpackPlugin =
  process.env["TSC_COMPILE_ON_ERROR"] === "true"
    ? require("react-dev-utils/ForkTsCheckerWarningWebpackPlugin")
    : require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const resolve = require("resolve");
const ESLintPlugin = require("eslint-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
import webpack from "webpack";
import {
  setJsxTsxLoaders,
  setNodeModuleSourceMapLoaders,
  setJsxLoaders,
} from "./loaders";
import setFileLoaders from "./loaders/files";

export function createNodeConfig(options: {
  isEnvDevelopment: boolean;
  isEnvProductionProfile: boolean;
  isEnvTest: boolean;
  isEnvProduction: boolean;
  shouldUseSourceMap: boolean;
  entry: Configuration["entry"];
  serverEnv: {
    raw: { [key: string]: any };
    stringified: { [key: string]: any };
  };
  paths: {
    outputDir: string;
    appSrc: string;
    appPath: string;
    appWebpackCache: string;
    appTsConfig: string;
    appJsConfig: string;
    appNodeModules: string;
    appPackageJson: string;
    appTsBuildInfoFile?: string;
  };
  modules?: {
    additionalModulePaths?: string[];
    webpackAliases?: any;
  };
  moduleFileExtensions: string[];
  useTypeScript: boolean;
  eslint?: {
    disableESLintPlugin?: boolean;
    emitErrorsAsWarnings?: boolean;
  };
  additionalNodeModules?: string[];
  outputFilename: string;
  additionalInclude?: string[];
  allowlist?: string[];
  babel?: {
    plugins?: [string, any][];
  };
}): Configuration {
  const {
    isEnvProductionProfile,
    isEnvDevelopment,
    isEnvProduction,
    isEnvTest,
    shouldUseSourceMap,
    paths,
    serverEnv,
    modules,
    moduleFileExtensions,
    useTypeScript,
    eslint,
    entry,
    additionalNodeModules,
    outputFilename,
    additionalInclude,
    allowlist,
    babel,
  } = options;
  return {
    target: "node",
    externalsPresets: { node: true },
    externals: [
      nodeExternals({ additionalModuleDirs: additionalNodeModules, allowlist }),
    ],
    mode: isEnvProduction ? "production" : "development",
    stats: "errors-warnings",
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? "source-map"
        : false
      : isEnvDevelopment
      ? "cheap-module-source-map"
      : false,
    entry,
    output: {
      // The build folder.
      path: paths.outputDir,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: outputFilename,
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js",
      assetModuleFilename: "static/media/[name].[hash][ext]",
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info: any) =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, "/")
        : isEnvDevelopment
        ? (info: any) =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")
        : () => {},
    },
    cache: {
      type: "filesystem",
      version: createEnvironmentHash(serverEnv),
      cacheDirectory: paths.appWebpackCache,
      store: "pack",
      buildDependencies: {
        defaultWebpack: ["webpack/lib/"],
        config: [__filename],
        tsconfig: [paths.appTsConfig, paths.appJsConfig].filter((f) =>
          fs.existsSync(f)
        ),
      },
    },
    infrastructureLogging: {
      level: "none",
    },
    optimization: {
      minimize: false,
    },
    module: {
      strictExportPresence: true,
      rules: [
        ...setNodeModuleSourceMapLoaders({ shouldUseSourceMap }),
        {
          oneOf: [
            ...setJsxTsxLoaders({
              appSrc: paths.appSrc,
              isEnvDevelopment,
              isEnvProduction,
              isEnvTest,
              hasJsxRuntime: true,
              removeReactRefresh: true,
              additionalInclude: additionalInclude || [],
              babel,
            }),
            ...setJsxLoaders({
              isEnvDevelopment,
              isEnvProduction,
              shouldUseSourceMap,
              isEnvTest,
              hasJsxRuntime: true,
            }),
            ...setFileLoaders(),
          ],
        },
      ],
    },
    resolve: {
      // This allows you to set a fallback for where webpack should look for modules.
      // We placed these paths second because we want `node_modules` to "win"
      // if there are any conflicts. This matches Node resolution mechanism.
      // https://github.com/facebook/create-react-app/issues/253
      modules: ["node_modules", paths.appNodeModules].concat(
        modules?.additionalModulePaths || [],
        additionalNodeModules || []
      ),
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
      alias: {
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        "react-native": "react-native-web",
        // Allows for better profiling with ReactDevTools
        ...(isEnvProductionProfile && {
          "react-dom$": "react-dom/profiling",
          "scheduler/tracing": "scheduler/tracing-profiling",
        }),
        ...(modules?.webpackAliases || {}),
      },
      plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(paths.appSrc, [
          paths.appPackageJson,
          babelRuntimeEntry,
          babelRuntimeEntryHelpers,
          babelRuntimeRegenerator,
        ]),
      ],
    },
    plugins: [
      new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
      new ModuleNotFoundPlugin(paths.appPath),
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      new webpack.NormalModuleReplacementPlugin(
        /\.(css|scss|less|sass)$/,
        "node-noop"
      ),
      // TypeScript type checking
      useTypeScript &&
        new ForkTsCheckerWebpackPlugin({
          async: isEnvDevelopment,
          typescript: {
            typescriptPath: resolve.sync("typescript", {
              basedir: paths.appNodeModules,
            }),
            configOverwrite: {
              compilerOptions: {
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                skipLibCheck: true,
                inlineSourceMap: false,
                declarationMap: false,
                noEmit: true,
                incremental: true,
                tsBuildInfoFile: paths.appTsBuildInfoFile,
              },
            },
            context: paths.appPath,
            diagnosticOptions: {
              syntactic: true,
            },
            mode: "write-references",
            // profile: true,
          },
          issue: {
            include: [{ file: `${paths.appSrc}/**/*.{ts,tsx}` }],
            exclude: [
              { file: `${paths.appSrc}/**/__tests__/**` },
              { file: `${paths.appSrc}/**/?(*.){spec|test}.*` },
              { file: `${paths.appSrc}/setupProxy.*` },
              { file: `${paths.appSrc}/setupTests.*` },
            ],
          },
          logger: {
            infrastructure: "silent",
          },
        }),
      !eslint?.disableESLintPlugin &&
        new ESLintPlugin({
          // Plugin options
          extensions: ["js", "mjs", "jsx", "ts", "tsx"],
          formatter: require.resolve("react-dev-utils/eslintFormatter"),
          eslintPath: require.resolve("eslint"),
          failOnError: !(isEnvDevelopment && eslint?.emitErrorsAsWarnings),
          context: paths.appSrc,
          cache: true,
          cacheLocation: path.resolve(
            paths.appNodeModules,
            ".cache/.eslintcache"
          ),
          // ESLint class options
          cwd: paths.appPath,
          resolvePluginsRelativeTo: __dirname,
          baseConfig: {
            extends: [require.resolve("eslint-config-react-app/base")],
          },
        }),
    ].filter(Boolean),
  };
}
