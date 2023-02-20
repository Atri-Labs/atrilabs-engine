import { getManifestIRs } from "./getManifestIRs";
const { stringify } = require("querystring");

export async function createManifestsEntry() {
  const irs = await getManifestIRs();
  const entry = {
    main: {
      import: `register-components-loader?${stringify({
        irs: JSON.stringify(irs),
      })}!`,
    },
  };
  return entry;
}
