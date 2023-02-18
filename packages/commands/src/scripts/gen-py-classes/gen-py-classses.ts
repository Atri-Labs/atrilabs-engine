#!/usr/bin/env node

import { computeManifestIRsForDirs } from "../../commons/computeManifestIRs";
import fs from "fs";
import pkgUp from "pkg-up";
import path from "path";
/**
 * This function has to be run in a manifests package.
 * Generate python classes.
 *
 * A single style class??
 */
async function main() {
  /**
   * 1. Check if manifests directory exists.
   *
   * 2. If we are inside a package, check if the entry point
   * of the package is manifest.config.js file.
   */
  const manifestDirs: string[] = [];
  if (fs.existsSync("manifests")) {
    manifestDirs.push("manifests");
  }
  // @ts-ignore
  const main = __non_webpack_require__(pkgUp.sync())["main"];
  if (main.endsWith("manifest.config.js")) {
    // @ts-ignore
    const dir = path.dirname(__non_webpack_require__.resolve(main));
    manifestDirs.push(dir);
  }
  const manifestIRs = await computeManifestIRsForDirs(manifestDirs);
  manifestIRs.forEach((manifestIR) => {
    const manifestFilename = manifestIR.manifest;
    // @ts-ignore
    const manifests = __non_webpack_require__(manifestFilename);
    const reactManifest = Object.keys(manifests).find((manifest) => {
      return manifest.match("react-component-manifest-schema");
    });
    if (reactManifest) {
    }
  });
}

main().catch((err) => console.log(err));
