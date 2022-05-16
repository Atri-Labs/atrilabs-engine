const pluginTester = require("babel-plugin-tester/pure");
const jsxAddLayerPlugin = require("../src/babel/add-layer-jsx-import-to-core");

pluginTester.default({
  plugin: jsxAddLayerPlugin,
  snapshot: false,
  pluginName: "add-layer-jsx-import-to-core",
  pluginOptions: {
    layers: [
      { path: "layerA.js", runtime: "CanvasRuntime" },
      { path: "layerB.js" },
    ],
    coreEntry: "/a.js",
    runtimes: ["CanvasRuntime"],
  },
  tests: {
    simpleTest: {
      code: "// it's an empty file",
      output: "// it's an empty file",
      fixture: "/a.js",
    },
  },
  babelOptions: { plugins: ["@babel/plugin-syntax-jsx"] },
});
