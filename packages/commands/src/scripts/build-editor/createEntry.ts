import { ManifestIR } from "@atrilabs/core";
const { stringify } = require("querystring");

export function createEntry(irs: ManifestIR[]) {
  return () => {
    return {
      BrowserForestManager: {
        import: "@atrilabs/core/src/entries/BrowserForestManager",
      },
      blockRegistry: {
        import: "@atrilabs/core/src/entries/blockRegistry",
      },
      registerComponents: {
        import: `register-components-loader?${stringify({
          irs: JSON.stringify(irs),
        })}!`,
      },
      main: {
        import: "./src/index",
        dependOn: ["BrowserForestManager", "blockRegistry"],
      },
    };
  };
}
