import fs from "fs";
import type { LayerConfig, ToolConfig } from "@atrilabs/core";
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
  const blockRegistryFile = findFileWithoutExtension(
    path.resolve(dir, "src", "entries", "blockRegistry")
  );
  if (
    browserForestManagerFile === undefined ||
    manifestRegistryFile === undefined ||
    apiFile === undefined ||
    blockRegistryFile === undefined
  ) {
    throw Error(`Missing a entryFile or indexFile in @atrilabs/core`);
  }
  return {
    dir,
    browserForestManagerFile,
    manifestRegistryFile,
    apiFile,
    blockRegistryFile,
  };
}

function readLayerConfig(pkg: string) {
  // @ts-ignore
  const config = __non_webpack_require__(`${pkg}/src/layer.config.js`);
  return config as LayerConfig;
}

export function getExposedBlocks(toolConfig: ToolConfig) {
  const layerConfigs = toolConfig.layers.map(({ pkg }) => {
    return readLayerConfig(pkg);
  });
  const exposingLayers = layerConfigs.filter(
    (config) => config["exposes"] !== undefined
  );
  return exposingLayers.reduce((prev, curr) => {
    const blockNames = Object.keys(curr.exposes!);
    blockNames.forEach((blockName) => {
      const blockEntries: Set<string> = new Set(
        // @ts-ignore
        Object.values(curr.exposes![blockName]!)
      );
      prev[blockName] = [
        ...(prev[blockName] || []),
        ...Array.from(blockEntries),
      ];
    });
    return prev;
  }, {} as { [blockName: string]: string[] });
}

/**
 * The top level layers with no dependency on any runtime is
 * put in the root otherwise in the runtime array.
 * @param toolConfig
 * @returns
 */
export function getLayerArrangment(toolConfig: ToolConfig) {
  const layerConfigs = toolConfig.layers.map(({ pkg }) => {
    return readLayerConfig(pkg);
  });
  const runtimes = toolConfig.runtimes.map(({ pkg }) => pkg);
  const runtimeMap = runtimes.reduce(
    (prev, curr) => {
      prev[curr] = [];
      return prev;
    },
    { root: [] } as { [runtimePkg: string]: string[] }
  );
  layerConfigs.forEach((layerConfig, index) => {
    if (layerConfig.runtime?.pkg) {
      if (runtimeMap[layerConfig.runtime.pkg]) {
        runtimeMap[layerConfig.runtime.pkg]!.push(
          toolConfig.layers[index]!.pkg
        );
      } else {
        throw Error(
          `The runtime ${layerConfig.runtime.pkg} from ${
            toolConfig.layers[index]!.pkg
          } is not an available runtime in tool.config.js.`
        );
      }
    } else {
      runtimeMap["root"]!.push(toolConfig.layers[index]!.pkg);
    }
  });
  return runtimeMap;
}
