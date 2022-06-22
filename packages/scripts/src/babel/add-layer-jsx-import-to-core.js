const ts = require("typescript");

/**
 * The path to layer can be without extension.
 * @param {*} babel
 * @param {{layers: {path: string, runtime?: string}[], coreEntry: string, runtimes: string[]}} options
 * @returns
 */
module.exports = function (babel, options) {
  return {
    visitor: {
      Program(path, parent) {
        if (!(parent.filename.includes(options.coreEntry))) {
          return;
        }
        if (
          options &&
          options.layers &&
          Array.isArray(options.layers) &&
          options.runtimes &&
          Array.isArray(options.runtimes)
        ) {
          // collect all runtime and layer information
          // {[runtime: string]: {layers: {path: string, index: number}[], index: number}}
          const runtimeLayerMap = {};
          // layers that are not contained in any runtime are called independent layers
          // {path: string, index: number}[]
          const independentLayers = [];
          options.runtimes.forEach((rt, index) => {
            runtimeLayerMap[rt] = { layers: [], index: index };
          });
          options.layers.forEach((la, index) => {
            if (la.runtime) {
              if (runtimeLayerMap[la.runtime]) {
                runtimeLayerMap[la.runtime].layers.push({
                  path: la.path,
                  index: index,
                });
              }
            } else {
              independentLayers.push({ path: la.path, index: index });
            }
          });

          // create code strings
          const oldCode = parent.file.code + "\n";

          const importRuntimeString = Object.keys(runtimeLayerMap).map((rt) => {
            const index = runtimeLayerMap[rt].index;
            return `import Runtime${index} from "${rt}";\n`;
          });

          const importLayerString = options.layers
            .map((layer, index) => {
              return `import Layer${index} from "${layer.path}";\n`;
            })
            .join("");

          const callIndependentLayers = independentLayers
            .map((la) => {
              const index = la.index;
              return `<Layer${index} />\n`;
            })
            .join("");

          const callRuntimeAndLayers = Object.keys(runtimeLayerMap)
            .map((rt) => {
              const index = runtimeLayerMap[rt].index;
              const runtimeLayers = runtimeLayerMap[rt].layers;
              const callRuntimeLayers = runtimeLayers
                .map((la) => {
                  const index = la.index;
                  return `<Layer${index} />\n`;
                })
                .join("");
              const callRuntime = `<Runtime${index}>${callRuntimeLayers}</Runtime${index}>\n`;
              return callRuntime;
            })
            .join("");

          const renderString = `root.render(<div>${callIndependentLayers}${callRuntimeAndLayers}</div>)`;

          const newCode =
            oldCode + importRuntimeString + importLayerString + renderString;
          const compiledCode = ts.transpileModule(newCode, {
            compilerOptions: {
              target: "es5",
              lib: ["dom", "dom.iterable", "esnext"],
              allowJs: true,
              skipLibCheck: true,
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              strict: true,
              forceConsistentCasingInFileNames: true,
              noFallthroughCasesInSwitch: true,
              module: "es6",
              moduleResolution: "node",
              resolveJsonModule: true,
              isolatedModules: true,
              jsx: "react-jsx",
            },
          }).outputText;

          path.replaceWith(babel.parse(compiledCode).program);
          path.skip();
        }
      },
    },
  };
};
