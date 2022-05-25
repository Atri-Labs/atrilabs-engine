const generateModuleId = require("./generateModuleId");

module.exports = function (babel) {
  return {
    visitor: {
      ImportDeclaration: (path) => {
        if (path.get("source").node.value.endsWith("?id")) {
          const specifiers = path.get("specifiers");
          for (let i = 0; i < specifiers.length; i++) {
            const spec = specifiers[i];
            if (babel.types.isImportDefaultSpecifier(spec)) {
              const local = spec.get("local").node.name;
              const source = path.get("source").node.value.slice(0, -3);
              const newNode = babel.template.statement.ast(
                `const ${local} = "${generateModuleId(source)}"`
              );
              path.insertAfter(newNode);
              path.remove();
            }
          }
        }
      },
    },
  };
};
