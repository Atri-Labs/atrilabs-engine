import { editorServerMachineInterpreter } from "./machine/init";
const { stringify } = require("querystring");

export async function createEntry() {
  const irs = editorServerMachineInterpreter.machine.context.manifests;
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
}
