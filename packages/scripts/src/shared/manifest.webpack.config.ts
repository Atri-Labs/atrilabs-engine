import { WebpackConfiguration } from "webpack-dev-server";

export default function createManifestWebpackConfig(
  entryPoint: string,
  output: { path: string; filename: string },
  scriptName: string
): WebpackConfiguration {
  return {
    mode: "production",
    entry: entryPoint,
    output: {
      path: output.path,
      filename: output.filename,
      library: scriptName,
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
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
  };
}
