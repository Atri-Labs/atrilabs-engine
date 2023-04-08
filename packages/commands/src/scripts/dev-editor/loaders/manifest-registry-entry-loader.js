const generateModuleId = require("./utils/generateModuleId");
const upath = require("upath");

/**
 *
 * @param {string} source
 */
function manifestRegistryEntryLoader(source) {
  /**
   * @type {import("@atrilabs/core").ToolConfig["manifestSchema"]}
   */
  const manifestSchema = this.getOptions().manifestSchema;

  const importStatements = manifestSchema
    .map((val, index) => {
      return `import man_${index} from "${upath.toUnix(val.pkg)}";`;
    })
    .join("\n");

  return source.replace(
    "declare var manifestRegistry: ManifestRegistry;",
    `${importStatements}
    
    const manifestRegistry: ManifestRegistry = {
        ${manifestSchema
          .map((val, index) => {
            return `
            "${generateModuleId(val.pkg)}": {
                schema: man_${index}(),
                manifests: []
            }`;
          })
          .join(",")}
    }
    `
  );
}

module.exports = manifestRegistryEntryLoader;
