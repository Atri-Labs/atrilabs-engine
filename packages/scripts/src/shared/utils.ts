import path from "path";
import fs from "fs";
import chalk from "chalk";
import { LayerConfig, ToolConfig } from "@atrilabs/core";
import { merge } from "lodash";
import { CorePkgInfo, LayerEntry, ToolEnv, ToolPkgInfo } from "./types";

// NOTE: this script is expected to be run via a package manager like npm, yarn

// packaged layers will always have js/jsx extension
const moduleFileExtensions = ["js", "jsx"];

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

export function getToolPkgInfo(): ToolPkgInfo {
  const toolDir = process.cwd();
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

export function getCorePkgInfo(): CorePkgInfo {
  const dir = path.dirname(require.resolve("@atrilabs/core/package.json"));
  const entryFile = findFileWithoutExtension(
    path.resolve(dir, "lib", "layers")
  );
  const indexFile = findFileWithoutExtension(path.resolve(dir, "lib", "index"));
  const layerDetailsFile = findFileWithoutExtension(
    path.resolve(dir, "lib", "layerDetails")
  );
  if (
    entryFile === undefined ||
    indexFile === undefined ||
    layerDetailsFile === undefined
  ) {
    throw Error(chalk.red(`Missing entryFile or indexFile in @atrilabs/core`));
  }
  return {
    dir: path.dirname(require.resolve("@atrilabs/core/package.json")),
    entryFile,
    indexFile,
    layerDetailsFile,
  };
}

export function getToolEnv(): ToolEnv {
  return {
    PUBLIC_URL: "",
  };
}

/**
 * importToolConfig will re-import tool.config.js on every call.
 * Reloading is needed in case tool.config.js has any changes during
 * development.
 */
export function importToolConfig(toolConfigFile: string): Promise<ToolConfig> {
  function toolConfigExists() {
    // <toolDir>/src/tool.config.(ts|js) should exist
    if (fs.existsSync(toolConfigFile)) {
      return true;
    }
    return false;
  }

  if (toolConfigExists()) {
    delete require.cache[toolConfigFile];
    // TODO: do schema check before returning
    return import(toolConfigFile).then((mod) => mod.default);
  } else {
    throw Error(`Module Not Found: ${toolConfigFile}`);
  }
}

/**
 * extractLayerEntries will re-import layer.config.js on every call.
 * Reloading is needed in case layer.config.js has any changes during
 * development.
 */
export async function extractLayerEntries(
  toolConfig: ToolConfig,
  toolPkgInfo: ToolPkgInfo
) {
  const layerEntries: LayerEntry[] = [];

  async function getLayerInfo(layerConfigPath: string) {
    return new Promise<{
      layerEntry: string;
      requires: LayerConfig["requires"];
      exposes: LayerConfig["exposes"];
    }>((res, rej) => {
      // delete cache to re-import layer.config.js module
      delete require.cache[layerConfigPath];
      import(layerConfigPath).then((mod: { default: LayerConfig }) => {
        let layerEntry = mod.default.modulePath;
        // layerEntry must be converted to absolute path
        if (!path.isAbsolute(mod.default.modulePath)) {
          layerEntry = path.resolve(
            path.dirname(layerConfigPath),
            mod.default.modulePath
          );
        }
        const filenameWithExt = findFileWithoutExtension(layerEntry);
        if (filenameWithExt) {
          res({
            layerEntry: filenameWithExt,
            requires: mod.default.requires,
            exposes: mod.default.exposes,
          });
          return;
        }
        rej(`${layerEntry} not found`);
      });
    });
  }

  const layers = toolConfig.layers;
  // create all layer entries
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]!.pkg;
    const remap = layers[i]!.remap;
    /**
     * layer.config.js file is searched at following locations:
     * 1. <toolDir>/node_modules/<modulePath>/lib/layer.config.js
     * if path is absolute package path.
     */
    const layerConfigPaths = [require.resolve(`${layer}/lib/layer.config.js`)];
    let layerConfigPath: string | undefined = undefined;
    for (let i = 0; i < layerConfigPaths.length; i++) {
      if (fs.existsSync(layerConfigPaths[i]!)) {
        layerConfigPath = layerConfigPaths[i]!;
      }
    }
    if (layerConfigPath === undefined) {
      console.error(
        "Error: layer config not found at following location\n",
        layerConfigPaths.join("\n")
      );
      // skip the layer
      continue;
    }
    try {
      const layerPath = path.dirname(require.resolve(`${layer}/package.json`));
      const layerSrcDir = path.resolve(layerPath, "src");
      const layerPackageName = layer;
      const globalModulePath = path.resolve(
        toolPkgInfo.cacheDir,
        layer,
        "index.js"
      );
      const layerConfigSymlink = path.resolve(
        toolPkgInfo.cacheDir,
        layer,
        "layer.config.js"
      );
      const { layerEntry, exposes, requires } = await getLayerInfo(
        layerConfigPath
      );
      const isRoot = i === 0 ? true : false;
      layerEntries.push({
        index: i,
        layerEntry,
        isRoot,
        layerConfigPath,
        layerPath,
        globalModulePath,
        layerConfigSymlink,
        layerPackageName,
        exposes,
        requires,
        remap,
        layerSrcDir,
      });
    } catch (err) {
      console.log(err);
    }
  }

  return layerEntries;
}

export function getNameMapForLayer(layerEntry: LayerEntry) {
  /**
   * Create name map for all layers
   * ------------------------------
   * Name map is a map between local name and global name.
   *
   * Step 1. Merge exposes and requires of layer. This step is necessary
   * because it might happen that the layer itself is using the menu etc. that
   * it has exposed.
   *
   * Step 2. Merge remap of the layer with the layer config with precedence to
   * remap in tool config.
   */
  let namemap: LayerConfig["exposes"] = {};

  merge(namemap, layerEntry.exposes, layerEntry!.requires);
  merge(namemap, layerEntry!.remap || {});
  return namemap;
}

export function detectLayerForFile(
  filename: string,
  layerEntries: LayerEntry[]
) {
  for (let i = 0; i < layerEntries.length; i++) {
    const currLayer = layerEntries[i]!;
    if (filename.match(currLayer.layerPath)) {
      return currLayer;
    }
  }
  return;
}

/**
 * clear the cache directory.
 */
export function resetBuildCache(toolPkgInfo: ToolPkgInfo) {
  if (fs.existsSync(toolPkgInfo.cacheDir)) {
    fs.rmSync(toolPkgInfo.cacheDir, { force: true, recursive: true });
  }
  fs.mkdirSync(toolPkgInfo.cacheDir, { recursive: true });
}

export function sortLayerEntriesInImportOrder(layerEntries: LayerEntry[]) {
  const sorted = [...layerEntries];
  sorted.sort((a, b) => {
    return a.index - b.index;
  });
  return sorted;
}
