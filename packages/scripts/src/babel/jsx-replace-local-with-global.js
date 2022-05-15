const AttributeVisitor = {
  JSXAttribute: (path) => {
    const options = this.opt.options;
    const filename = this.opt.filename;
    const map = options.getNameMap(filename);
    // check if name attribute exists
    if (path.get("name").node.name === "name") {
      // the name attribute must have a string literal value
      if (this.opt.types.isStringLiteral(path.get("value"))) {
        const strValue = path.get("value").node.value;
        // key can menu, container, tab
        const key = this.compName.toLowerCase();
        if (map[key] && map[key][strValue]) {
          path.get("value").replaceWithSourceString(`"${map[key][strValue]}"`);
        }
      }
      if (this.opt.types.isJSXExpressionContainer(path.get("value"))) {
        const expr = path.get("value").get("expression");
        if (this.opt.types.isStringLiteral(expr)) {
          const strValue = expr.node.value;
          // key can menu, container, tab
          const key = this.compName.toLowerCase();
          if (map[key] && map[key][strValue]) {
            path
              .get("value")
              .replaceWithSourceString(`"${map[key][strValue]}"`);
          }
        }
      }
    }
  },
};

const JSXElementVisitor = {
  JSXElement: (path) => {
    // Menu, Container, Tab
    const compName = path.get("openingElement").get("name").node.name;
    if (compName === "Menu") {
      console.log(compName);
      path.traverse(AttributeVisitor, { opt: this, compName: "Menu" });
    }
    if (compName === "Tab") {
      console.log(compName);
      path.traverse(AttributeVisitor, { opt: this, compName: "Tab" });
    }
    if (compName === "Container") {
      console.log(compName);
      path.traverse(AttributeVisitor, { opt: this, compName: "Container" });
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
            options,
            filename,
            types: babel.types,
          });
        },
      },
    },
  };
};
