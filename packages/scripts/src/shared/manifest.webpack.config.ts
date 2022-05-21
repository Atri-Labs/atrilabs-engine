import path from "path";
import { WebpackConfiguration } from "webpack-dev-server";

export default function createManifestWebpackConfig(
  entryPoint: string,
  output: { path: string; filename: string },
  scriptName: string,
  publicPath: string,
  manifestJsPath: string,
  manifests: string[]
): WebpackConfiguration {
  return {
    mode: "production",
    entry: entryPoint,
    output: {
      path: output.path,
      filename: output.filename,
      library: scriptName,
      publicPath,
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
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
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
  };
}
