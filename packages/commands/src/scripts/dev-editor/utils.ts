import fs from "fs";
import type { ToolConfig } from "@atrilabs/core";
import { CorePkgInfo, ToolPkgInfo } from "./types";
import path from "path";

export function getToolPkgInfo(): ToolPkgInfo {
  const toolDir = path.resolve(process.cwd());
  const toolSrc = path.resolve(toolDir, "src");
  const toolConfigFile = path.resolve(toolSrc, "tool.config.js");
  const toolNodeModule = path.resolve(toolDir, "node_modules");
  const cacheDir = path.resolve(toolNodeModule, ".cache", "@atrilabs", "build");
  const publicDir = path.resolve(toolDir, "public");
  const toolHtml = path.resolve(publicDir, "index.html");
  return {
    dir: toolDir,
    src: toolSrc,
    configFile: toolConfigFile,
    nodeModule: toolNodeModule,
    cacheDir,
    publicDir,
    toolHtml,
  };
}

export function readToolConfig() {
  const toolPkgInfo = getToolPkgInfo();
  if (!fs.existsSync(toolPkgInfo.configFile)) {
    throw Error(`Expected a tool config file at ${toolPkgInfo.configFile}.`);
  }
  // @ts-ignore
  const config = __non_webpack_require__(toolPkgInfo.configFile);
  return config as ToolConfig;
}

const moduleFileExtensions = ["ts", "tsx", "js", "jsx"];

/**
 *
 * @param filename file name without extension
 */
function findFileWithoutExtension(filename: string) {
  for (let i = 0; i < moduleFileExtensions.length; i++) {
    const ext = moduleFileExtensions[i];
    const filenameWithExt = `${filename}.${ext}`;
    if (
      fs.existsSync(filenameWithExt) &&
      !fs.statSync(filenameWithExt).isDirectory()
    ) {
      // add this to layer entries
      return filenameWithExt;
    }
  }
  return;
}

export function getCorePkgInfo(): CorePkgInfo {
  // @ts-ignore
  const corePackageJSON = __non_webpack_require__.resolve(
    "@atrilabs/core/package.json"
  );
  const dir = path.dirname(corePackageJSON);
  const browserForestManagerFile = findFileWithoutExtension(
    path.resolve(dir, "src", "entries", "BrowserForestManager")
  );
  const manifestRegistryFile = findFileWithoutExtension(
    path.resolve(dir, "src", "entries", "manifestRegistry")
  );
  const apiFile = findFileWithoutExtension(
    path.resolve(dir, "src", "entries", "api")
  );
  if (
    browserForestManagerFile === undefined ||
    manifestRegistryFile === undefined ||
    apiFile === undefined
  ) {
    throw Error(`Missing a entryFile or indexFile in @atrilabs/core`);
  }
  return {
    dir,
    browserForestManagerFile,
    manifestRegistryFile,
    apiFile,
  };
}
