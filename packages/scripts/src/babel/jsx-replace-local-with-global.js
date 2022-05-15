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
    if (compName === options.localname) {
      let curr = path.scope;
      while (curr) {
        if (!curr.hasOwnBinding(options.localname)) {
          curr = curr.parent;
        } else {
          if (curr === curr.getProgramParent()) {
            // found a refernce in JSX
            path.traverse(AttributeVisitor, {
              getNameMap: options.getNameMap,
              filename: options.filename,
              types: options.types,
              compName: options.compName,
            });
          }
          break;
        }
      }
    }
  },
};

const ImportSpecifierVisitor = {
  ImportSpecifier: (path, options) => {
    if (
      path.parentPath.get("source").node.value === "@atrilabs/core" &&
      path.get("imported").node.name === "Menu"
    ) {
      // path.traverse with local name
      path.getStatementParent().parentPath.traverse(JSXElementVisitor, {
        getNameMap: options.getNameMap,
        filename: options.filename,
        types: options.types,
        compName: "menu",
        localname: path.get("local").node.name,
      });
    }
    if (
      path.parentPath.get("source").node.value === "@atrilabs/core" &&
      path.get("imported").node.name === "Tab"
    ) {
      // path.traverse with local name
      path.getStatementParent().parentPath.traverse(JSXElementVisitor, {
        getNameMap: options.getNameMap,
        filename: options.filename,
        types: options.types,
        compName: "tabs",
        localname: path.get("local").node.name,
      });
    }
    if (
      path.parentPath.get("source").node.value === "@atrilabs/core" &&
      path.get("imported").node.name === "Container"
    ) {
      // path.traverse with local name
      path.getStatementParent().parentPath.traverse(JSXElementVisitor, {
        getNameMap: options.getNameMap,
        filename: options.filename,
        types: options.types,
        compName: "containers",
        localname: path.get("local").node.name,
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
          path.traverse(ImportSpecifierVisitor, {
            getNameMap: options.getNameMap,
            filename,
            types: babel.types,
          });
        },
      },
    },
  };
};
