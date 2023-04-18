import fs from "fs";
import { computeManifestIRsForDirs } from "../../commons/computeManifestIRs";
import pkgUp from "pkg-up";
import path from "path";

/**
 * This function can be run inside a packages or Atri app.
 *
 * 1. If ran inside a Atri app:
 *
 * - Check if manifests directory exists.
 *
 * 2. If ran inside a package:
 *
 * - Check if the entry point of the package is manifest.config.js file.
 */
export async function getManifestIRs() {
  const manifestDirs: string[] = [];
  if (fs.existsSync(path.resolve("manifests"))) {
    manifestDirs.push(path.resolve("manifests"));
  }
  // @ts-ignore
  const main = __non_webpack_require__(pkgUp.sync())["main"];
  if (main && main.endsWith("manifest.config.js")) {
    // @ts-ignore
    const dir = path.resolve(path.join(path.dirname(main), "manifests"));
    manifestDirs.push(dir);
  }
  const manifestIRs = await computeManifestIRsForDirs(manifestDirs);
  return manifestIRs;
}
