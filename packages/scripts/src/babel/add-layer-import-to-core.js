/**
 * The path to layer can be without extension.
 * @param {*} babel
 * @param {{layers: {path: string}[]}} options
 * @returns
 */
module.exports = function (babel, options) {
  return {
    visitor: {
      Program(path, parent) {
        if (
          !parent.filename.match(
            require.resolve("@atrilabs/core/lib/layers.js")
          )
        ) {
          return;
        }
        if (options && options.layers && Array.isArray(options.layers)) {
          const importStrings = options.layers
            .map((layer, index) => {
              return `import layer${index} from "${layer.path}";\n`;
            })
            .join("");
          const callLayers = options.layers
            .map((_, index) => {
              return `layer${index}()\n`;
            })
            .join("");
          const newCode = importStrings + callLayers;
          path.replaceWith(babel.parse(newCode).program);
          path.skip();
        }
      },
    },
  };
};
