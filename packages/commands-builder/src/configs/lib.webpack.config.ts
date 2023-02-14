import { createConfig } from "./app.webpack.config";
import { AppConfigOptions } from "./config-options-types";
import webpack from "webpack";

export function createLibConfig(options: AppConfigOptions) {
  const appWebpackConfig = createConfig(options);

  const { clientEnv } = options;

  // re-assign plugins as not all plugins are relevant for library
  appWebpackConfig.plugins = [
    new webpack.DefinePlugin(clientEnv.stringified),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ];

  return appWebpackConfig;
}
