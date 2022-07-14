#!/usr/bin/env node
import fs from "fs";
import path from "path";
import {
  buildApp,
  getMode,
  setNodeAndBabelEnv,
  buildInfoFile,
  buildInfoFilename,
  buildServer,
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
    const buildAppCompiler = buildApp({
      appEntry: path.resolve(appEntry),
      appHtml: path.resolve(appHtml),
      appOutput: path.resolve(appOutput),
      includes: includes.map((inc) => path.resolve(inc)),
      mode,
      addWatchOptions: true,
    });
    const serverEntry: string = buildInfo["serverEntry"];
    const serverSrc: string = buildInfo["serverSrc"];
    const serverOutput: string = buildInfo["serverOutput"];
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
    const serverIncludes = [...manifestPkgs, appSrc, serverSrc];
    const buildServerCompiler = buildServer({
      serverEntry: path.resolve(serverEntry),
      serverOutput: path.resolve(serverOutput),
      includes: serverIncludes.map((inc) => path.resolve(inc)),
      mode,
      allowList: manifestDirs.map((dir) => dir.pkg),
      addWatchOptions: true,
    });
    buildAppCompiler.hooks.watchRun.tap("build-app-watch-run", (_compiler) => {
      console.log("build-app-watch-run called");
    });
    buildAppCompiler.hooks.done.tap("build-app-done", () => {
      console.log("build-app-done called");
    });
    buildServerCompiler.hooks.watchRun.tap(
      "build-server-watch-run",
      (_compiler) => {
        console.log("build-server-watch-run called");
      }
    );
    buildServerCompiler.hooks.done.tap("build-server-done", () => {
      console.log("build-server-done called");
    });
    // wait for kill signals
    ["SIGINT", "SIGTERM"].forEach(function (sig) {
      process.on(sig, function () {
        process.exit();
      });
    });
    // wait for input on stdin (hold the terminal)
    process.stdin.on("end", function () {
      process.exit();
    });
  } else {
    console.log(`Missing manifestDirs in ${buildInfoFilename}`);
  }
} catch (err) {
  console.log(`Error\n`, err);
}
