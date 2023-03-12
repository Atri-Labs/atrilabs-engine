const { stringify } = require("querystring");
import path from "path";
import { computeManifestIRsForDirs } from "@atrilabs/commands/src/commons/computeManifestIRs";

async function computeIRs() {
  const irs = await computeManifestIRsForDirs([
    path.resolve(process.cwd(), "manifests"),
  ]);
  return irs;
}

export async function createEntry() {
  const irs = await computeIRs();
  return {
    registerComponents: {
      import: `register-components-loader?${stringify({
        irs: JSON.stringify(irs),
      })}!`,
    },
    main: ["webpack-hot-middleware/client"],
  };
}
