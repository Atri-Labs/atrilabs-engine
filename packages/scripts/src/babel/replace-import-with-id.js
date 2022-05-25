const finder = require("find-package-json");
const path = require("path");
/**
 *
 * @param {string} source source must resolve when used with require.resolve
 * @return <package_name>/<relative_path_to_module> or <package_name>
 */
function generateId(source) {
  const sourcePath = require.resolve(source);
  const packageJSONfinder = finder(sourcePath).next();
  const packageJSONPath = packageJSONfinder.filename;
  const packageJSON = packageJSONfinder.value;
  const packageName = packageJSON["name"];
  const relativeSourcePath = path.relative(
    path.dirname(packageJSONPath),
    sourcePath
  );
  const unixRelativeSourcePath = relativeSourcePath
    .split(path.sep)
    .join(path.posix.sep);
  // if a package is referred instead of a module, then use package name as id
  if (source === packageName) {
    return packageName;
  }
  return `${packageName}/${unixRelativeSourcePath}`;
}

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
                `const ${local} = "${generateId(source)}"`
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
