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
            .map((layer) => {
              return `import "${layer.path}";\n`;
            })
            .join("");
          path.replaceWith(babel.parse(importStrings).program);
          path.skip();
        }
      },
    },
  };
};
