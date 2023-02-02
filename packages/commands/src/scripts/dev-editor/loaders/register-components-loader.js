function registerComponentLoader() {
  return `
  import { manifestRegistryController, defaultImportsToRegistry, registerComponents } from "@atrilabs/core";
  
  `;
}

module.exports = registerComponentLoader;
