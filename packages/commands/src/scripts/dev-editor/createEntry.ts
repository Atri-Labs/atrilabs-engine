import { editorServerMachineInterpreter } from "./machine/init";
const { stringify } = require("querystring");

export async function createEntry() {
  const irs = editorServerMachineInterpreter.machine.context.manifests;
  console.log("irs", irs);
  console.log("s", stringify({ irs: JSON.stringify(irs) }));
  return {
    api: { import: "@atrilabs/core/src/entries/api" },
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
      dependOn: ["api", "BrowserForestManager", "blockRegistry"],
    },
  };
}
