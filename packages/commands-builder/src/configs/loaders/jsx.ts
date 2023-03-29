import getCacheIdentifier from "react-dev-utils/getCacheIdentifier";
import { babelPresetReactApp } from "./jsxTsx";
export default function setJsxLoaders(options: {
  isEnvProduction: boolean;
  isEnvDevelopment: boolean;
  shouldUseSourceMap: boolean;
  isEnvTest: boolean;
  hasJsxRuntime: boolean;
}) {
  const {
    isEnvProduction,
    shouldUseSourceMap,
    isEnvDevelopment,
    isEnvTest,
    hasJsxRuntime,
  } = options;
  return [
    // Process any JS outside of the app with Babel.
    // Unlike the application JS, we only compile the standard ES features.
    {
      test: /\.(js|mjs)$/,
      exclude: /@babel(?:\/|\\{1,2})runtime/,
      loader: require.resolve("babel-loader"),
      options: {
        babelrc: false,
        configFile: false,
        compact: false,
        presets: [
          [
            babelPresetReactApp,
            {
              runtime: hasJsxRuntime ? "automatic" : "classic",
              isEnvProduction,
              isEnvDevelopment,
              isEnvTest,
              areHelpersEnabled: true,
            },
          ],
        ],
        cacheDirectory: true,
        // See #6846 for context on why cacheCompression is disabled
        cacheCompression: false,
        // @remove-on-eject-begin
        cacheIdentifier: getCacheIdentifier(
          isEnvProduction
            ? "production"
            : isEnvDevelopment
            ? "development"
            : "",
          ["babel-plugin-named-asset-import", "react-dev-utils"]
        ),
        sourceType: "unambiguous",
        // @remove-on-eject-end
        // Babel sourcemaps are needed for debugging into node_modules
        // code.  Without the options below, debuggers like VSCode
        // show incorrect code and set breakpoints on the wrong lines.
        sourceMaps: shouldUseSourceMap,
        inputSourceMap: shouldUseSourceMap,
      },
    },
  ];
}
