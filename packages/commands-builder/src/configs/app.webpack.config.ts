import { Configuration as WebpackConfiguration } from "webpack";
import path from "path";
import fs from "fs";
import createEnvironmentHash from "./utils/createEnvironmentHash";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import {
  setImageLoaders,
  setJsxTsxLoaders,
  setNodeModuleSourceMapLoaders,
  setAssetLoaders,
  setStyleLoaders,
  setJsxLoaders,
} from "./loaders";
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
import {
  reactRefreshRuntimeEntry,
  reactRefreshWebpackPluginRuntimeEntry,
  babelRuntimeEntry,
  babelRuntimeEntryHelpers,
  babelRuntimeRegenerator,
} from "./utils/allowedModules";
import HtmlWebpackPlugin from "html-webpack-plugin";
import InlineChunkHtmlPlugin from "react-dev-utils/InlineChunkHtmlPlugin";
import InterpolateHtmlPlugin from "react-dev-utils/InterpolateHtmlPlugin";
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
import webpack from "webpack";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const ForkTsCheckerWebpackPlugin =
  process.env["TSC_COMPILE_ON_ERROR"] === "true"
    ? require("react-dev-utils/ForkTsCheckerWarningWebpackPlugin")
    : require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const resolve = require("resolve");
const ESLintPlugin = require("eslint-webpack-plugin");

export function createConfig(options: {
  isEnvDevelopment: boolean;
  isEnvTest: boolean;
  isEnvProduction: boolean;
  isEnvProductionProfile: boolean;
  clientEnv: {
    raw: { [key: string]: any };
    stringified: { [key: string]: any };
  };
  shouldUseSourceMap: boolean;
  entry: WebpackConfiguration["entry"];
  paths: {
    outputDir: string;
    appSrc: string;
    appWebpackCache: string;
    appTsConfig: string;
    appJsConfig: string;
    appNodeModules: string;
    appPackageJson: string;
    appHtml: string;
    // appPath is set as cwd for eslint plugin
    appPath: string;
    // service worker src path
    swSrc: string;
    appTsBuildInfoFile?: string;
  };
  publicUrlOrPath: string;
  moduleFileExtensions: string[];
  modules?: {
    additionalModulePaths?: string[];
    webpackAliases?: any;
  };
  imageInlineSizeLimit: number;
  shouldInlineRuntimeChunk: boolean;
  eslint?: {
    disableESLintPlugin?: boolean;
    emitErrorsAsWarnings?: boolean;
  };
  useTypeScript: boolean;
  generateIndexHtml?: boolean;
  additionalInclude?: string[];
  additionalNodeModules?: string[];
  outputFilename: string;
}): WebpackConfiguration {
  const {
    isEnvDevelopment,
    isEnvTest,
    isEnvProduction,
    isEnvProductionProfile,
    clientEnv,
    shouldUseSourceMap,
    entry,
    paths,
    modules,
    imageInlineSizeLimit,
    shouldInlineRuntimeChunk,
    eslint,
    moduleFileExtensions,
    publicUrlOrPath,
    useTypeScript,
    generateIndexHtml,
    additionalInclude,
    additionalNodeModules,
    outputFilename,
  } = options;

  return {
    target: ["browserslist"],
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
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: publicUrlOrPath,
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
      version: createEnvironmentHash(clientEnv),
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
      minimize: isEnvProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 2018,
            },
            compress: {
              ecma: 5,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
        // This is only used in production mode
        new CssMinimizerPlugin(),
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
          reactRefreshRuntimeEntry,
          reactRefreshWebpackPluginRuntimeEntry,
          babelRuntimeEntry,
          babelRuntimeEntryHelpers,
          babelRuntimeRegenerator,
        ]),
      ],
    },
    module: {
      strictExportPresence: true,
      rules: [
        ...setNodeModuleSourceMapLoaders({ shouldUseSourceMap }),
        {
          oneOf: [
            ...setImageLoaders({ imageInlineSizeLimit }),
            ...setJsxTsxLoaders({
              appSrc: paths.appSrc,
              isEnvDevelopment,
              isEnvProduction,
              isEnvTest,
              hasJsxRuntime: true,
              additionalInclude: additionalInclude || [],
            }),
            ...setJsxLoaders({
              isEnvDevelopment,
              isEnvProduction,
              shouldUseSourceMap,
              isEnvTest,
              hasJsxRuntime: true,
            }),
            ...setStyleLoaders({
              isEnvDevelopment,
              isEnvProduction,
              publicUrlOrPath: publicUrlOrPath,
              appSrc: paths.appSrc,
              shouldUseSourceMap,
            }),
            ...setAssetLoaders(),
          ],
        },
      ],
    },
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      generateIndexHtml
        ? new HtmlWebpackPlugin(
            Object.assign(
              {},
              {
                inject: true,
                template: paths.appHtml,
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
          )
        : false,
      // Inlines the webpack runtime script. This script is too small to warrant
      // a network request.
      // https://github.com/facebook/create-react-app/issues/5358
      isEnvProduction &&
        shouldInlineRuntimeChunk &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      // It will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that URL.
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, clientEnv.raw),
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(paths.appPath),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(clientEnv.stringified),
      // Experimental hot reloading for React .
      // https://github.com/facebook/react/tree/main/packages/react-refresh
      isEnvDevelopment &&
        new ReactRefreshWebpackPlugin({
          overlay: false,
        }),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
      // Generate an asset manifest file with the following content:
      // - "files" key: Mapping of all asset filenames to their corresponding
      //   output file so that tools can pick it up without having to parse
      //   `index.html`
      // - "entrypoints" key: Array of files which are included in `index.html`,
      //   can be used to reconstruct the HTML if necessary
      new WebpackManifestPlugin({
        fileName: "asset-manifest.json",
        publicPath: publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = Object.keys(entrypoints)
            .map((entryName) => {
              entrypoints[entryName]!.filter((filename) => {
                return !filename.endsWith(".map");
              });
            })
            .flat();

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      // Generate a service worker script that will precache, and keep up to date,
      // the HTML & assets that are part of the webpack build.
      isEnvProduction &&
        fs.existsSync(paths.swSrc) &&
        new WorkboxWebpackPlugin.InjectManifest({
          swSrc: paths.swSrc,
          dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
          exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
          // Bump up the default maximum size (2mb) that's precached,
          // to make lazy-loading failure scenarios less likely.
          // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        }),
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
            // This one is specifically to match during CI tests,
            // as micromatch doesn't match
            // '../cra-template-typescript/template/src/App.tsx'
            // otherwise.
            include: [
              { file: "../**/src/**/*.{ts,tsx}" },
              { file: "**/src/**/*.{ts,tsx}" },
            ],
            exclude: [
              { file: "**/src/**/__tests__/**" },
              { file: "**/src/**/?(*.){spec|test}.*" },
              { file: "**/src/setupProxy.*" },
              { file: "**/src/setupTests.*" },
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
