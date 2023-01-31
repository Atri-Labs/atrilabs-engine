const generateModuleId = require("./utils/generateModuleId");
const fs = require("fs");
/**
 *
 * @param {string} source
 * @returns
 */
function browserForestManagerEntryLoader(source) {
  /**
   * @type {import("@atrilabs/core").ToolConfig["forests"]}
   */
  const forests = this.getOptions().forests;
  const forestIds = Object.keys(forests);
  const trees = forestIds.map((forestId) => {
    return forests[forestId].map((m) => m.modulePath);
  });
  const importStatements = forestIds
    .map((forestId, forestIndex) => {
      return trees[forestIndex]
        .map((tree, treeIndex) => {
          return `import tree_${forestIndex}_${treeIndex} from "${tree}";`;
        })
        .join("\n");
    })
    .join("\n");

  const newSource = source.replace(
    "declare var defs: ForestDef[];",
    `${importStatements}

    const defs: ForestDef[] = [
        ${forestIds
          .map((forestId, forestIndex) => {
            return `{
                pkg: "${forestId}",
                id: "${generateModuleId(forestId)}",
                trees: [${trees[forestIndex]
                  .map((tree, treeIndex) => {
                    return `{
                        id: "${generateModuleId(tree)}",
                        modulePath: "${tree}",
                        defFn: tree_${forestIndex}_${treeIndex}
                    }`;
                  })
                  .join(",")}]
            }`;
          })
          .join(",\n")}
    ];
    `
  );
  return newSource;
}

module.exports = browserForestManagerEntryLoader;
