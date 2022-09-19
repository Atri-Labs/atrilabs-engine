import { Configuration, Stats, webpack } from "webpack";
import createServerWebpackConfig from "./server.webpack.config";
import createWebpackConfig from "./webpack.config";
import path from "path";
import fs from "fs";

export const imageInlineSizeLimit = parseInt(
  process.env["IMAGE_INLINE_SIZE_LIMIT"] || "10000"
);

export const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

const watchOptions: Configuration["watchOptions"] = {
  ignored: `${path.resolve("node_modules")}/**`,
};

export type BuildTypes = "development" | "production";

export type BuildAppOptions = {
  mode: BuildTypes;
  appEntry: string;
  appHtml: string;
  appOutput: string;
  includes: string[];
  addWatchOptions: boolean;
  wsClientEntry?: string;
  assetUrlPrefix: string;
};

export function buildApp(options: BuildAppOptions) {
  const {
    mode,
    appEntry,
    appHtml,
    appOutput,
    includes,
    wsClientEntry,
    assetUrlPrefix,
  } = options;

  process.env["NODE_ENV"] = mode;
  process.env["BABEL_ENV"] = mode;

  const webpackConfig = createWebpackConfig({
    paths: { appEntry, appHtml, appOutput, includes, wsClientEntry },
    mode,
    publicUrlOrPath: "/",
    shouldUseSourceMap: false,
    assetUrlPrefix,
  });

  if (options.addWatchOptions) {
    webpackConfig.watch = true;
    webpackConfig.watchOptions = watchOptions;
  }

  return webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.log("Error\n", err);
    }
    if (stats?.hasErrors) {
      console.log(stats.toString());
    }
  });
}

export type BuildServerOptions = {
  mode: BuildTypes;
  serverEntry: string;
  serverOutput: string;
  includes: string[];
  allowList: string[];
  addWatchOptions: boolean;
  serverSideEntry: string;
};

export function buildServer(options: BuildServerOptions) {
  const {
    mode,
    serverEntry,
    serverOutput,
    includes,
    allowList,
    serverSideEntry,
  } = options;

  process.env["NODE_ENV"] = mode;
  process.env["BABEL_ENV"] = mode;

  const webpackConfig = createServerWebpackConfig({
    paths: { serverEntry, serverOutput, includes, serverSideEntry },
    mode,
    publicUrlOrPath: "/",
    shouldUseSourceMap: false,
    allowList,
  });

  if (options.addWatchOptions) {
    webpackConfig.watch = true;
    webpackConfig.watchOptions = watchOptions;
  }

  return webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.log("Error\n", err);
    }
    if (stats?.hasErrors) {
      console.log(stats.toString());
    }
  });
}

export function getMode(): BuildTypes {
  const mode =
    process.env["MODE"] &&
    (process.env["MODE"] === "production" ||
      process.env["MODE"] === "development")
      ? process.env["MODE"]
      : "development";
  return mode;
}

export function setNodeAndBabelEnv(mode: BuildTypes) {
  process.env["NODE_ENV"] = mode;
  process.env["BABEL_ENV"] = mode;
}

export const buildInfoFilename = "atri-build-info.json";

export const buildInfoFile = path.resolve(buildInfoFilename);

export const serverInfoFilename = "atri-server-info.json";

export const serverInfoFile = path.resolve(serverInfoFilename);

export const ssgOutputPath = path.resolve("dist", "ssg");

export function buildAppWithDefaults() {
  return new Promise<Stats>((res, rej) => {
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
            return path.dirname(
              require.resolve(`${manifestDef.pkg}/package.json`)
            );
          } else {
            throw Error(`Wrong schema of ${buildInfoFilename}.`);
          }
        });
        const includes = [...manifestPkgs, appSrc];
        const compiler = buildApp({
          appEntry: path.resolve(appEntry),
          appHtml: path.resolve(appHtml),
          appOutput: path.resolve(appOutput),
          includes: includes.map((inc) => path.resolve(inc)),
          mode,
          addWatchOptions: false,
          assetUrlPrefix:
            process.env["ASSET_URL_PREFIX"] || buildInfo.assetUrlPrefix,
        });
        compiler.hooks.done.tap("build with defaults", (stats) => {
          res(stats);
        });
      } else {
        rej(`Missing manifestDirs in ${buildInfoFilename}`);
      }
    } catch (err) {
      rej(err);
    }
  });
}

export function buildServerWithDefaults() {
  return new Promise<Stats>((res, rej) => {
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
            return path.dirname(
              require.resolve(`${manifestDef.pkg}/package.json`)
            );
          } else {
            throw Error(`Wrong schema of ${buildInfoFilename}.`);
          }
        });
        const includes = [...manifestPkgs, appSrc, serverSrc];
        const compiler = buildServer({
          serverEntry: path.resolve(serverEntry),
          serverOutput: path.resolve(serverOutput),
          includes: includes.map((inc) => path.resolve(inc)),
          mode,
          allowList: manifestDirs.map((dir) => dir.pkg),
          addWatchOptions: false,
          serverSideEntry: path.resolve(serverSideEntry),
        });
        compiler.hooks.done.tap("server built with defaults", (stats) => {
          res(stats);
        });
      } else {
        rej(`Missing manifestDirs in ${buildInfoFilename}`);
      }
    } catch (err) {
      rej(err);
    }
  });
}
