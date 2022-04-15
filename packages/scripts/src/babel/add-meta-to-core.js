const InternalVisitor = {
  VariableDeclarator(path) {
    if (this.skip) {
      return;
    }
    console.log("not skipping");
    if (path.node.id.name === "menuRegistry") {
      console.log("found menuRegistry");
      if (
        options.menu &&
        Array.isArray(options.menu) &&
        options.menu.length > 0
      ) {
        console.log("options has menu");
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
};
const externalVisitor = {
  Program(path, parent) {
    const skip = parent.filename.match(
      require.resolve("@atrilabs/core/lib/layerDetails.js")
    )
      ? false
      : true;
    if (!skip) {
      console.log("matched");
    }
    path.traverse(InternalVisitor, {
      skip,
    });
  },
};
/**
 *
 * @param {*} babel
 * @param {{menu?: string[], containers?: string[], tabs?: string[]}} options
 */
module.exports = function (babel, options) {
  return {
    visitor: externalVisitor,
  };
};
