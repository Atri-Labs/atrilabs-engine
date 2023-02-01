/**
 *
 * @param {string} source
 */
function blockRegistryEntryLoader(source) {
  /**
   * @type {ReturnType<import("../utils")["getExposedBlocks"]>}
   */
  const exposedBlocks = this.getOptions().exposedBlocks;
  console.log(exposedBlocks);
  return source.replace(
    "export declare var registry: BlockRegistry;",
    `export const registry: BlockRegistry = {
        ${Object.keys(exposedBlocks)
          .map((blockName) => {
            /**
             * @type {string[]}
             */
            const entries = exposedBlocks[blockName];
            console.log("entries", blockName, entries);
            return `${blockName}: {${entries
              .map((entry) => {
                return `${entry}: {items: []}`;
              })
              .join(",")}}`;
          })
          .join(",")}
    }`
  );
}

module.exports = blockRegistryEntryLoader;
