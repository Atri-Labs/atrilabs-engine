/**
 *
 * @param {*} babel
 * @param {{getImports: (filename: string)=>{namedImports: string[], path: string}[]}} options
 */
module.exports = function (babel, options) {
  const visited = {};
  return {
    visitor: {
      Program(path, parent) {
        // visit only once
        if (visited[parent.filename] === undefined) {
          visited[parent.filename] = true;
        } else {
          return;
        }
        if (options.getImports === undefined) {
          return;
        }
        const importDefs = options.getImports(parent.filename);
        // schema check
        if (importDefs && Array.isArray(importDefs) && importDefs.length > 0) {
          let result = parent.file.code + "\n";
          importDefs.forEach((importDef) => {
            // schema check
            if (importDef.path && Array.isArray(importDef.namedImports)) {
              result += `import {${importDef.namedImports.join(", ")}} from "${
                importDef.path
              }"`;
            }
          });
          path.replaceWith(babel.parse(result).program);
        }
      },
    },
  };
};
