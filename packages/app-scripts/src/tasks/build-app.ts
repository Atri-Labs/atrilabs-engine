#!/usr/bin/node
import fs from "fs";
import {
  buildApp,
  getMode,
  setNodeAndBabelEnv,
  buildInfoFile,
  buildInfoFilename,
} from "../shared/utils";

const mode = getMode();
setNodeAndBabelEnv(mode);

try {
  const buildInfo = JSON.parse(fs.readFileSync(buildInfoFile).toString());
  if (buildInfo) {
    const appEntry: string = buildInfo["appEntry"];
    const appHtml: string = buildInfo["appHtml"];
    const appOutput: string = buildInfo["appOutput"];
    const appSrc: string = buildInfo["appSrc"];
    const manifestDirs: { pkg: string }[] = buildInfo["manifestDirs"];
    if (
      appEntry &&
      typeof appEntry === "string" &&
      appHtml &&
      typeof appHtml === "string" &&
      appOutput &&
      typeof appOutput === "string" &&
      appSrc &&
      typeof appSrc === "string" &&
      manifestDirs &&
      Array.isArray(manifestDirs)
    ) {
      throw Error(`Wrong schema of ${buildInfoFilename}.`);
    }
    const manifestPkgs = manifestDirs.map((manifestDef) => {
      if (manifestDef["pkg"]) {
        return manifestDef.pkg;
      } else {
        throw Error(`Wrong schema of ${buildInfoFilename}.`);
      }
    });
    const includes = [...manifestPkgs, appSrc];
    buildApp({ appEntry, appHtml, appOutput, includes, mode });
  } else {
    console.log(`Missing manifestDirs in ${buildInfoFilename}`);
  }
} catch (err) {
  console.log(`Error\n`, err);
}
