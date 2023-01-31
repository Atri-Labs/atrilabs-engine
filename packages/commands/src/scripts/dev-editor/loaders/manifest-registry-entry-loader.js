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
      return `import man_${index} from "${val.pkg}";`;
    })
    .join("\n");

  return source.replace(
    "declare var manifestRegistry: ManifestRegistry;",
    `${importStatements}
    
    const manifestRegistry: ManifestRegistry = {
        ${manifestSchema
          .map((val, index) => {
            return `
            "${val.pkg}": {
                schema: man_${index}(),
                components: []
            }`;
          })
          .join(",")}
    }
    `
  );
}

module.exports = manifestRegistryEntryLoader;
