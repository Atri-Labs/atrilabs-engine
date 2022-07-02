import path from "path";
import { WebpackConfiguration } from "webpack-dev-server";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");

const imageInlineSizeLimit = parseInt(
  process.env["IMAGE_INLINE_SIZE_LIMIT"] || "10000"
);

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

export default function createManifestWebpackConfig(
  mode: "development" | "production",
  shouldUseSourceMap: boolean,
  entryPoint: string,
  output: { path: string; filename: string },
  scriptName: string,
  publicPath: string,
  manifestJsPath: string,
  manifests: string[],
  shimsPath: string,
  ignoreShimsDir: string
): WebpackConfiguration {
  const isEnvDevelopment = mode === "development";
  const isEnvProduction = mode === "production";

  const getStyleLoaders = (cssOptions: any, preProcessor?: string): any => {
    const loaders = [
      isEnvDevelopment && {
        loader: require.resolve("style-loader"),
      },
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
  return {
    target: "web",
    mode: mode,
    entry: entryPoint,
    output: {
      path: output.path,
      filename: output.filename,
      library: { name: scriptName, type: "umd" },
      publicPath,
    },
    devtool: "inline-source-map",
    module: {
      rules: [
        {
          enforce: "pre",
          exclude: /@babel(?:\/|\\{1,2})runtime/,
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
              exclude:
                /(node_modules[\/\\]css-loader)|(node_modules[\/\\]style-loader)/,
              use: [
                {
                  loader: require.resolve("babel-loader"),
                  options: {
                    presets: ["@babel/preset-env"],
                    babelrc: false,
                    configFile: false,
                    plugins: [
                      [
                        path.resolve(
                          __dirname,
                          "..",
                          "babel",
                          "add-shims-in-manifest.js"
                        ),
                        {
                          shimsPath,
                          ignoreShimsDir,
                        },
                      ],
                      [
                        path.resolve(
                          __dirname,
                          "..",
                          "babel",
                          "replace-import-with-id.js"
                        ),
                      ],
                      [
                        path.resolve(
                          __dirname,
                          "..",
                          "babel",
                          "add-default-exports-to-manifest-js.js"
                        ),
                        {
                          manifestJsPath,
                          manifests,
                        },
                      ],
                    ],
                  },
                },
              ],
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
    resolve: {
      extensions: [".js", ".jsx"],
      modules: ["node_modules", path.resolve("node_modules")],
    },
    optimization: {
      splitChunks: {
        chunks: "initial",
      },
    },
  };
}
