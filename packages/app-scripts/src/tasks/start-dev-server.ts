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
  serverInfoFile,
} from "../shared/utils";
import http from "http";

// @ts-ignore
global.window = undefined;

const mode = getMode();
setNodeAndBabelEnv(mode);

const buildStage = { app: "", server: "" };
function checkIfBothDone() {
  if (buildStage["app"] === "done" && buildStage["server"] === "done") {
    return true;
  }
  return false;
}
function sendReloadSignalToServer() {
  const serverInfo = JSON.parse(fs.readFileSync(serverInfoFile).toString());
  const serverPort: number = serverInfo["port"];
  const request = http.request({
    method: "POST",
    host: "localhost",
    port: serverPort,
    path: "/reload-all-dev-sockets",
  });
  request.on("response", (resp) => {
    resp.on("error", (err) => {
      console.log("response has some error\n", err);
    });
  });
  request.on("error", (err) => {
    console.log("request failed with error\n", err);
  });
  request.end();
}

function resetBuildStages() {
  buildStage["app"] = "";
  buildStage["server"] = "";
}

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
      wsClientEntry: path.resolve(__dirname, "..", "shared", "wsclient"),
      assetUrlPrefix:
        process.env["ASSET_URL_PREFIX"] || buildInfo.assetUrlPrefix,
    });
    const serverEntry: string = buildInfo["serverEntry"];
    const serverSideEntry: string = buildInfo["serverSideEntry"];
    const serverSrc: string = buildInfo["serverSrc"];
    const serverOutput: string = buildInfo["serverOutput"];
    if (
      !(
        serverEntry &&
        typeof serverEntry === "string" &&
        serverOutput &&
        typeof serverOutput === "string" &&
        serverSrc &&
        typeof serverSrc === "string" &&
        serverSideEntry &&
        typeof serverSideEntry === "string"
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
      serverSideEntry: path.resolve(serverSideEntry),
    });
    buildAppCompiler.hooks.watchRun.tap("build-app-watch-run", (_compiler) => {
      console.log("build-app-watch-run called");
      buildStage["app"] = "pending";
    });
    buildAppCompiler.hooks.done.tap("build-app-done", () => {
      console.log("build-app-done called");
      buildStage["app"] = "done";
      if (checkIfBothDone()) {
        sendReloadSignalToServer();
        resetBuildStages();
      }
    });
    buildServerCompiler.hooks.watchRun.tap(
      "build-server-watch-run",
      (_compiler) => {
        console.log("build-server-watch-run called");
        buildStage["server"] = "pending";
      }
    );
    buildServerCompiler.hooks.done.tap("build-server-done", () => {
      console.log("build-server-done called");
      buildStage["server"] = "done";
      if (checkIfBothDone()) {
        sendReloadSignalToServer();
        resetBuildStages();
      }
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
