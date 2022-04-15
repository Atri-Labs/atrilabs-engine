/**
 *
 * @param {*} babel
 * @param {{menu?: string[], containers?: string[], tabs?: string[]}} options
 */
module.exports = function (babel, options) {
  return {
    visitor: {
      Program(path, parent) {
        if (!parent.filename.match("@atrilabs/core/layerDetails.js")) {
          path.skip();
        }
      },
      VariableDeclarator(path) {
        if (path.node.id.name === "menuRegistry") {
          if (
            options.menu &&
            Array.isArray(options.menu) &&
            options.menu.length > 0
          ) {
            const items = options.menu.map((name) => {
              return `${name}: {items: []},`;
            });
            path.get("init").replaceWithSourceString(`{${items.join("\n")}}`);
          }
        }
        if (path.node.id.name === "containerRegistry") {
          if (
            options.containers &&
            Array.isArray(options.menu) &&
            options.containers.length > 0
          ) {
            const items = options.containers.map((name) => {
              return `${name}: {items: []},`;
            });
            path.get("init").replaceWithSourceString(`{${items.join("\n")}}`);
          }
        }
        if (path.node.id.name === "tabsRegistry") {
          if (
            options.tabs &&
            Array.isArray(options.menu) &&
            options.tabs.length > 0
          ) {
            const items = options.tabs.map((name) => {
              return `${name}: {items: []},`;
            });
            path.get("init").replaceWithSourceString(`{${items.join("\n")}}`);
          }
        }
      },
    },
  };
};
