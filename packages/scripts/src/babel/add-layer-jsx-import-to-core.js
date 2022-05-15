const ts = require("typescript");

/**
 * The path to layer can be without extension.
 * @param {*} babel
 * @param {{layers: {path: string}[], coreEntry: string}} options
 * @returns
 */
module.exports = function (babel, options) {
  return {
    visitor: {
      Program(path, parent) {
        if (!parent.filename.match(options.coreEntry)) {
          return;
        }
        if (options && options.layers && Array.isArray(options.layers)) {
          const oldCode = parent.file.code + "\n";
          const importStrings = options.layers
            .map((layer, index) => {
              return `import Layer${index} from "${layer.path}";\n`;
            })
            .join("");
          const callLayers = options.layers
            .map((_, index) => {
              return `<Layer${index} />\n`;
            })
            .join("");
          const renderString = `root.render(<div>${callLayers}</div>)`;
          const newCode = oldCode + importStrings + renderString;
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
