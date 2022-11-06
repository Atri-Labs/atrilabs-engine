#!/usr/bin/env node
import fs from "fs";
import path from "path";
import {
  buildInfoFile,
  buildInfoFilename,
  buildServer,
  getMode,
  setNodeAndBabelEnv,
} from "../shared/utils";

// @ts-ignore
global.window = undefined;

const mode = getMode();
setNodeAndBabelEnv(mode);

// Where will I get manifest directories to include?
try {
  const buildInfo = JSON.parse(fs.readFileSync(buildInfoFile).toString());
  if (buildInfo) {
    const serverEntry: string = buildInfo["serverEntry"];
    const serverSideEntry: string = buildInfo["serverSideEntry"];
    const serverSrc: string = buildInfo["serverSrc"];
    const serverOutput: string = buildInfo["serverOutput"];
    const appSrc: string = buildInfo["appSrc"];
    const manifestDirs: { pkg: string }[] = buildInfo["manifestDirs"];
    if (
      !(
        serverEntry &&
        typeof serverEntry === "string" &&
        serverOutput &&
        typeof serverOutput === "string" &&
        serverSrc &&
        typeof serverSrc === "string"
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
    const includes = [...manifestPkgs, appSrc, serverSrc];
    buildServer({
      serverEntry: path.resolve(serverEntry),
      serverOutput: path.resolve(serverOutput),
      includes: includes.map((inc) => path.resolve(inc)),
      mode,
      allowList: manifestDirs.map((dir) => dir.pkg),
      addWatchOptions: false,
      serverSideEntry: path.resolve(serverSideEntry),
    });
  } else {
    console.log(`Missing manifestDirs in ${buildInfoFilename}`);
  }
} catch (err) {
  console.log(`Error\n`, err);
}
