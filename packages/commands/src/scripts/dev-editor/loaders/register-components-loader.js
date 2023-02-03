function registerComponentLoader() {
  /**
   * @type {import("@atrilabs/core").ManifestIR[]}
   */
  const irs = this.getOptions();
  return `
  import { manifestRegistryController, defaultImportsToRegistry, registerComponents } from "@atrilabs/core";
  
  `;
}

module.exports = registerComponentLoader;
