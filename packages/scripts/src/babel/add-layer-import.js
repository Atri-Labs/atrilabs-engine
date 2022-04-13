/**
 *
 * @param {*} babel
 * @param {{importStatements: {path: string, namedImports: string[]}[]}} options
 */
module.exports = function (babel, options) {
  return {
    visitor: {
      Program(path, parent) {
        // TODO: check file path and add only imports from it's package
        var result = parent.file.code + "\n";
        options.importStatements.forEach(function (statement) {
          result += `import {${statement.namedImports.join(", ")}} from "${
            statement.path
          }"\n`;
        });
        path.replaceWith(babel.parse(code).program);
        path.skip();
      },
    },
  };
};
