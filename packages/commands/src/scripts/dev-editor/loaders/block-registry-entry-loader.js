/**
 *
 * @param {string} source
 */
function blockRegistryEntryLoader(source) {
  /**
   * @type {ReturnType<import("../utils")["getExposedBlocks"]>}
   */
  const exposedBlocks = this.getOptions().exposedBlocks;
  return source.replace(
    "export declare var registry: BlockRegistry;",
    `export const registry: BlockRegistry = {
        ${Object.keys(exposedBlocks)
          .map((blockName) => {
            /**
             * @type {string[]}
             */
            const entries = exposedBlocks[blockName];
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
