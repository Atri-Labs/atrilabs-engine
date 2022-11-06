#!/usr/bin/env node
import fs from "fs";
import path from "path";
import {
  buildApp,
  getMode,
  setNodeAndBabelEnv,
  buildInfoFile,
  buildInfoFilename,
} from "../shared/utils";

// @ts-ignore
global.window = undefined;

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
      !(
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
      )
    ) {
      throw Error(`Wrong schema of ${buildInfoFilename}.`);
    }
    const manifestPkgs = manifestDirs.map((manifestDef) => {
      if (manifestDef["pkg"]) {
        return path.dirname(require.resolve(`${manifestDef.pkg}/package.json`));
      } else {
        throw Error(`Wrong schema of ${buildInfoFilename}.`);
      }
    });
    const includes = [...manifestPkgs, appSrc];
    buildApp({
      appEntry: path.resolve(appEntry),
      appHtml: path.resolve(appHtml),
      appOutput: path.resolve(appOutput),
      includes: includes.map((inc) => path.resolve(inc)),
      mode,
      addWatchOptions: false,
      assetUrlPrefix:
        process.env["ASSET_URL_PREFIX"] || buildInfo.assetUrlPrefix,
    });
  } else {
    console.log(`Missing manifestDirs in ${buildInfoFilename}`);
  }
} catch (err) {
  console.log(`Error\n`, err);
}
