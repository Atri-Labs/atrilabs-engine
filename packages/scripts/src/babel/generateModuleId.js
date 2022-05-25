const finder = require("find-package-json");
const path = require("path");

/**
 *
 * @param {string} source source must resolve when used with require.resolve
 * @return <package_name>/<relative_path_to_module> or <package_name>
 */
function generateModuleId(source) {
  try {
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
    return `${packageName}/${unixRelativeSourcePath}`;
  } catch (err) {
    // if a package is referred instead of a module, then use package name as id
    return source;
  }
}

module.exports = generateModuleId;
