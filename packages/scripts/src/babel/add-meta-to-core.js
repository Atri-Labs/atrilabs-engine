const InternalVisitor = {
  VariableDeclarator(path) {
    const id = path.get("id");
    if (id.type === "Identifier" && id.node.name === "menuRegistry") {
      const items = this.options.menu.map((name) => {
        return `${name}: {items: []},`;
      });
      const init = path.get("init");
      init.replaceWithSourceString(`{${items.join("\n")}}`);
    }
    if (id.type === "Identifier" && id.node.name === "containerRegistry") {
      const items = this.options.containers.map((name) => {
        return `${name}: {items: []},`;
      });
      const init = path.get("init");
      init.replaceWithSourceString(`{${items.join("\n")}}`);
    }
    if (id.type === "Identifier" && id.node.name === "tabsRegistry") {
      const items = this.options.tabs.map((name) => {
        return `${name}: {items: []},`;
      });
      const init = path.get("init");
      init.replaceWithSourceString(`{${items.join("\n")}}`);
    }
  },
};
/**
 *
 * @param {*} babel
 * @param {{menu?: string[], containers?: string[], tabs?: string[], layerDetailsFile: string}} options
 */
module.exports = function (babel, options) {
  return {
    visitor: {
      Program: {
        enter: (path, parent) => {
          const skip = !(parent.filename.includes(options.layerDetailsFile));
          if (!skip) {
            path.traverse(InternalVisitor, { options });
          }
        },
      },
    },
  };
};
