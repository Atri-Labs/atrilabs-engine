import path from "path";

export const reactRefreshRuntimeEntry = require.resolve(
  "react-refresh/runtime"
);
export const reactRefreshWebpackPluginRuntimeEntry = require.resolve(
  "@pmmmwh/react-refresh-webpack-plugin"
);
export const babelRuntimeEntry = path.resolve("./loaders/jsxTsx");
export const babelRuntimeEntryHelpers = [
  require.resolve("@babel/runtime/helpers/esm/assertThisInitialized", {
    paths: [babelRuntimeEntry],
  }),
  require.resolve("@babel/runtime/helpers/slicedToArray", {
    paths: [babelRuntimeEntry],
  }),
];
export const babelRuntimeRegenerator = require.resolve(
  "@babel/runtime/regenerator",
  {
    paths: [babelRuntimeEntry],
  }
);
