const AttributeVisitor = {
  JSXAttribute: (path, options) => {
    const getNameMap = options.getNameMap;
    const filename = options.filename;
    const map = getNameMap(filename);
    // check if name attribute exists
    if (path.get("name").node.name === "name") {
      // the name attribute must have a string literal value
      if (options.types.isStringLiteral(path.get("value"))) {
        const strValue = path.get("value").node.value;
        // key can menu, container, tab
        const key = options.compName.toLowerCase();
        if (map[key] && map[key][strValue]) {
          path.get("value").replaceWithSourceString(`"${map[key][strValue]}"`);
        }
      }
      if (options.types.isJSXExpressionContainer(path.get("value"))) {
        const expr = path.get("value").get("expression");
        if (options.types.isStringLiteral(expr)) {
          const strValue = expr.node.value;
          // key can menu, container, tab
          const key = options.compName.toLowerCase();
          if (map[key] && map[key][strValue]) {
            expr.replaceWithSourceString(`"${map[key][strValue]}"`);
          }
        }
      }
    }
  },
};

const JSXElementVisitor = {
  JSXElement: (path, options) => {
    // Menu, Container, Tab
    const compName = path.get("openingElement").get("name").node.name;
    if (compName === "Menu") {
      path.traverse(AttributeVisitor, {
        getNameMap: options.getNameMap,
        filename: options.filename,
        types: options.types,
        compName: "menu",
      });
    }
    if (compName === "Tab") {
      path.traverse(AttributeVisitor, {
        getNameMap: options.getNameMap,
        filename: options.filename,
        types: options.types,
        compName: "tabs",
      });
    }
    if (compName === "Container") {
      path.traverse(AttributeVisitor, {
        getNameMap: options.getNameMap,
        filename: options.filename,
        types: options.types,
        compName: "containers",
      });
    }
  },
};

/**
 *
 * @param {*} babel
 * @param {{getNameMap: (filename: string)=>{menu?: {[localname: string]: string},containers?: {[localname: string]: string},tabs?: {[localname: string]: string}}|undefined}} options
 * @returns
 */
module.exports = function (babel, options) {
  return {
    visitor: {
      Program: {
        enter: (path, parent) => {
          const filename = parent.filename;
          path.traverse(JSXElementVisitor, {
            getNameMap: options.getNameMap,
            filename,
            types: babel.types,
          });
        },
      },
    },
  };
};
