const InternalVisitor = {
  AssignmentExpression(path) {
    const left = path.get("left");
    const right = path.get("right");
    if (left.type === "MemberExpression" && right.type === "ObjectExpression") {
      const obj = left.get("object");
      const prop = left.get("property");
      if (
        obj.type === "Identifier" &&
        obj.node.name === "exports" &&
        prop.type === "Identifier"
      ) {
        if (prop.node.name === "menuRegistry") {
          const items = this.options.menu.map((name) => {
            return `${name}: {items: []},`;
          });
          right.replaceWithSourceString(`{${items.join("\n")}}`);
        }
        if (prop.node.name === "containerRegistry") {
          const items = this.options.containers.map((name) => {
            return `${name}: {items: []},`;
          });
          right.replaceWithSourceString(`{${items.join("\n")}}`);
        }
        if (prop.node.name === "tabsRegistry") {
          const items = this.options.tabs.map((name) => {
            return `${name}: {items: []},`;
          });
          right.replaceWithSourceString(`{${items.join("\n")}}`);
        }
      }
    }
  },
};
/**
 *
 * @param {*} babel
 * @param {{menu?: string[], containers?: string[], tabs?: string[]}} options
 */
module.exports = function (babel, options) {
  return {
    visitor: {
      Program(path, parent) {
        const skip = parent.filename.match(
          require.resolve("@atrilabs/core/lib/layerDetails.js")
        )
          ? false
          : true;
        if (!skip) {
          path.traverse(InternalVisitor, { options });
        }
      },
    },
  };
};
