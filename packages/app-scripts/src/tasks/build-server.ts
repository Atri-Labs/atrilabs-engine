#!/usr/bin/node
import fs from "fs";
import {
  buildInfoFile,
  buildInfoFilename,
  buildServer,
  getMode,
  setNodeAndBabelEnv,
} from "../shared/utils";

const mode = getMode();
setNodeAndBabelEnv(mode);

// Where will I get manifest directories to include?
try {
  const buildInfo = JSON.parse(fs.readFileSync(buildInfoFile).toString());
  if (buildInfo) {
    const serverEntry: string = buildInfo["serverEntry"];
    const serverSrc: string = buildInfo["serverSrc"];
    const serverOutput: string = buildInfo["serverOutput"];
    const appSrc: string = buildInfo["appSrc"];
    if (
      serverEntry &&
      typeof serverEntry === "string" &&
      serverOutput &&
      typeof serverOutput === "string" &&
      serverSrc &&
      typeof serverSrc === "string"
    ) {
      throw Error(`Wrong schema of ${buildInfoFilename}.`);
    }
    const includes = [serverSrc, appSrc];
    buildServer({ serverEntry, serverOutput, includes, mode });
  } else {
    console.log(`Missing manifestDirs in ${buildInfoFilename}`);
  }
} catch (err) {
  console.log(`Error\n`, err);
}
