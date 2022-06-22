/**
 *
 * @param {babel} babel
 * @param {{manifestJsPath: string, manifests: string[]}} options
 * @returns
 */
module.exports = function (babel, options) {
  const defaultImportsVisitor = {
    VariableDeclarator: (path) => {
      if (path.get("id").node.name === "defaultImports") {
        const init = path.get("init");
        const expr = options.manifests
          .map((m, index) => {
            return `man${index}`;
          })
          .join(",");
        init.replaceWith(babel.template.expression.ast(`[${expr}]`));
      }
    },
  };
  return {
    visitor: {
      Program: (path, parent) => {
        // put if condition here
        if (
          options.manifestJsPath &&
          parent.filename.includes(options.manifestJsPath)
        ) {
          path.traverse(defaultImportsVisitor);
          options.manifests.forEach((m, index) => {
            const importNode = babel.template.statement.ast(
              `import man${index} from "${m}";`
            );
            path.unshiftContainer("body", importNode);
          });
        }
      },
    },
  };
};
