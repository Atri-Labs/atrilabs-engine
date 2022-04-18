const callExprVisitor = {
  CallExpression(path) {
    const options = this.options;
    const filename = this.filename;
    const map = options.getNameMap(filename);

    if (
      path.node.callee.name === "menu" &&
      path.get("arguments.0") &&
      path.get("arguments.0").type === "StringLiteral"
    ) {
      const name = path.get("arguments.0").node.value;
      if (map.menu) {
        const menu = map.menu;
        if (menu[name]) {
          path.get("arguments.0").replaceWithSourceString(`"${menu[name]}"`);
        }
      }
    }

    if (
      path.node.callee.name === "container" &&
      path.get("arguments.0") &&
      path.get("arguments.0").type === "StringLiteral"
    ) {
      const name = path.get("arguments.0").node.value;
      if (map.containers) {
        const containers = map.containers;
        if (containers[name]) {
          path
            .get("arguments.0")
            .replaceWithSourceString(`"${containers[name]}"`);
        }
      }
    }

    if (
      path.node.callee.name === "tab" &&
      path.get("arguments.0") &&
      path.get("arguments.0").type === "StringLiteral"
    ) {
      const name = path.get("arguments.0").node.value;
      if (map.tabs) {
        const tabs = map.tabs;
        if (tabs[name]) {
          path.get("arguments.0").replaceWithSourceString(`"${tabs[name]}"`);
        }
      }
    }
  },
};

/**
 *
 * @param {*} babel
 * @param {{getNameMap: (filename: string)=>{menu: {[localname: string]: string},containers: {[localname: string]: string},tabs: {[localname: string]: string}}}} options
 * @returns
 */
module.exports = function (babel, options) {
  let filename = "";
  return {
    visitor: {
      Program(path, parent) {
        filename = parent.filename;
        path.traverse(callExprVisitor, { options, filename });
      },
    },
  };
};
