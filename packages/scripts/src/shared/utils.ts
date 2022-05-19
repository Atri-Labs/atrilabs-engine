import path from "path";
import fs from "fs";
import chalk from "chalk";
import {
  LayerConfig,
  ManifestConfig,
  ManifestSchemaConfig,
  RuntimeConfig,
  ToolConfig,
} from "@atrilabs/core";
import { merge } from "lodash";
import {
  CorePkgInfo,
  LayerEntry,
  ManifestPkgInfo,
  ManifestSchemaPkgInfo,
  RuntimeEntry,
  ToolEnv,
  ToolPkgInfo,
} from "./types";

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
  const setCurrentForestFile = findFileWithoutExtension(
    path.resolve(dir, "lib", "setCurrentForest")
  );
  if (
    entryFile === undefined ||
    indexFile === undefined ||
    layerDetailsFile === undefined ||
    setCurrentForestFile === undefined
  ) {
    throw Error(chalk.red(`Missing entryFile or indexFile in @atrilabs/core`));
  }
  return {
    dir: path.dirname(require.resolve("@atrilabs/core/package.json")),
    entryFile,
    indexFile,
    layerDetailsFile,
    setCurrentForestFile,
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
      runtime: LayerConfig["runtime"];
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
            runtime: mod.default.runtime,
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
      const { layerEntry, exposes, requires, runtime } = await getLayerInfo(
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
        runtime,
      });
    } catch (err) {
      console.log(err);
    }
  }

  return layerEntries;
}

export function getNameMapForPackage(entry: LayerEntry | RuntimeEntry) {
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
  let namemap: LayerConfig["exposes"] | RuntimeConfig["exposes"] = {};

  merge(namemap, entry.exposes, entry!.requires);
  merge(namemap, entry!.remap || {});
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

export function detectRuntimeForFile(
  filename: string,
  runtimeEntries: RuntimeEntry[]
) {
  for (let i = 0; i < runtimeEntries.length; i++) {
    const currRuntime = runtimeEntries[i]!;
    if (filename.match(currRuntime.runtimePath)) {
      return currRuntime;
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

export async function extractRuntimeEntries(
  toolConfig: ToolConfig
): Promise<RuntimeEntry[]> {
  const runtimeEntries: RuntimeEntry[] = [];

  function getRuntimeInfo(runtimeConfigPath: string) {
    return new Promise<{
      runtimeEntry: string;
      requires: RuntimeConfig["requires"];
      exposes: RuntimeConfig["exposes"];
    }>((res, rej) => {
      // delete cache to re-import layer.config.js module
      delete require.cache[runtimeConfigPath];
      import(runtimeConfigPath).then((mod: { default: RuntimeConfig }) => {
        let runtimeEntry = mod.default.modulePath;
        // layerEntry must be converted to absolute path
        if (!path.isAbsolute(mod.default.modulePath)) {
          runtimeEntry = path.resolve(
            path.dirname(runtimeConfigPath),
            mod.default.modulePath
          );
        }
        const filenameWithExt = findFileWithoutExtension(runtimeEntry);
        if (filenameWithExt) {
          res({
            runtimeEntry: filenameWithExt,
            requires: mod.default.requires,
            exposes: mod.default.exposes,
          });
          return;
        }
        rej(`${runtimeEntry} not found`);
      });
    });
  }

  const runtimes = toolConfig.runtimes;
  for (let i = 0; i < runtimes.length; i++) {
    const runtime = runtimes[i]!.pkg;
    const remap = runtimes[i]!.remap;

    /**
     * layer.config.js file is searched at following locations:
     * 1. <toolDir>/node_modules/<modulePath>/lib/layer.config.js
     * if path is absolute package path.
     */
    const runtimeConfigPaths = [
      require.resolve(`${runtime}/lib/runtime.config.js`),
    ];
    let runtimeConfigPath: string | undefined = undefined;
    for (let i = 0; i < runtimeConfigPaths.length; i++) {
      if (fs.existsSync(runtimeConfigPaths[i]!)) {
        runtimeConfigPath = runtimeConfigPaths[i]!;
      }
    }
    if (runtimeConfigPath === undefined) {
      console.error(
        "Error: layer config not found at following location\n",
        runtimeConfigPaths.join("\n")
      );
      // skip the layer
      continue;
    }
    try {
      const runtimePath = path.dirname(
        require.resolve(`${runtime}/package.json`)
      );
      const runtimeSrcDir = path.resolve(runtimePath, "src");
      const runtimePackageName = runtime;
      const { runtimeEntry, exposes, requires } = await getRuntimeInfo(
        runtimeConfigPath
      );
      runtimeEntries.push({
        index: i,
        runtimeEntry,
        runtimeConfigPath,
        runtimePath,
        runtimePackageName,
        exposes,
        requires,
        remap,
        runtimeSrcDir,
      });
    } catch (err) {
      console.log(err);
    }
  }
  return runtimeEntries;
}

export function getManifestSchemaPkgInfo(pkg: string): ManifestSchemaPkgInfo {
  const schemaPath = path.dirname(require.resolve(`${pkg}/package.json`));
  const srcDir = path.resolve(schemaPath, "src");
  const configFile = path.resolve(srcDir, "manifest.schema.config.js");
  const manifestId = pkg;
  return { pkg, schemaPath, srcDir, configFile, manifestId };
}

export function getManifestPkgInfo(pkg: string): ManifestPkgInfo {
  const manifestPath = path.dirname(require.resolve(`${pkg}/package.json`));
  const srcDir = path.resolve(manifestPath, "src");
  const configFile = path.resolve(srcDir, "manifest.config.js");
  return { pkg, manifestPath, srcDir, configFile };
}

export async function importManifestConfig(
  manifestConfigFile: string
): Promise<ManifestConfig> {
  function manifestConfigExists() {
    // <toolDir>/src/tool.config.(ts|js) should exist
    if (fs.existsSync(manifestConfigFile)) {
      return true;
    }
    return false;
  }

  if (manifestConfigExists()) {
    delete require.cache[manifestConfigFile];
    // TODO: do schema check before returning
    return import(manifestConfigFile).then((mod) => mod.default);
  } else {
    throw Error(`Module Not Found: ${manifestConfigFile}`);
  }
}

export async function importManifestSchemaConfig(
  manfiestSchemaConfigFile: string
): Promise<ManifestSchemaConfig> {
  function manifestConfigExists() {
    // <toolDir>/src/tool.config.(ts|js) should exist
    if (fs.existsSync(manfiestSchemaConfigFile)) {
      return true;
    }
    return false;
  }

  if (manifestConfigExists()) {
    delete require.cache[manfiestSchemaConfigFile];
    // TODO: do schema check before returning
    return import(manfiestSchemaConfigFile).then((mod) => mod.default);
  } else {
    throw Error(`Module Not Found: ${manfiestSchemaConfigFile}`);
  }
}

// extract build type (libs) for a manifest pkg
export async function extractManifestPkgBuildType(
  manifestPkgfInfo: ManifestPkgInfo
) {
  const manifestConfig = await importManifestConfig(
    manifestPkgfInfo.configFile
  );
  const buildTypes = new Set<ManifestSchemaConfig["libs"]["0"]>();
  for (let i = 0; i < manifestConfig.manifestSchema.length; i++) {
    const manifestSchemaPkg = manifestConfig.manifestSchema[i]!;
    const manifestSchemaPkgInfo = getManifestSchemaPkgInfo(
      manifestSchemaPkg.pkg
    );
    const manifestSchemaConfig = await importManifestSchemaConfig(
      manifestSchemaPkgInfo.configFile
    );
    if (manifestSchemaConfig.libs) {
      if (Array.isArray(manifestSchemaConfig.libs)) {
        manifestSchemaConfig.libs.forEach((buildType) => {
          buildTypes.add(buildType);
        });
      } else {
        throw Error(
          `Invalid manifest schema config in ${manifestSchemaPkgInfo.configFile}. Libs field must be an array of string.`
        );
      }
    } else {
      throw Error(
        `Invalid manifest schema config in ${manifestSchemaPkgInfo.configFile}. Missing libs field.`
      );
    }
  }
  return buildTypes;
}

// extract build type (libs) and collect default exports from manifest dir
export async function extractManifestPkgBuildInfo(
  manifestPkgInfo: ManifestPkgInfo
): Promise<{
  buildType: ManifestSchemaConfig["libs"]["0"];
  exports: string[];
}> {
  const buildTypes = await extractManifestPkgBuildType(manifestPkgInfo);
  if (buildTypes.size > 1) {
    throw Error(
      "We currently don't support manifest schemas of more than one build type in a single package."
    );
  }
  if (buildTypes.size === 0) {
    throw Error(
      `Build type cannot be inferred for the manifest package ${manifestPkgInfo.pkg}`
    );
  }
  const buildType = Array.from(buildTypes)[0]!;
  // TODO: loop throug manifest dir and collect all file names
  const exports: string[] = [];
  return { buildType, exports };
}

/**
 * The Manifest server might put a watch on a manifest package cache directory
 * hence, manifest package's cache directory will be needed.
 * This function just returns the path and doesn't actually creates it.
 */
export function getManifestPkgCacheDir(
  manifestPkgfInfo: ManifestPkgInfo
): string {
  const cacheDir = getToolPkgInfo()["cacheDir"];
  return path.resolve(cacheDir, "manifests", manifestPkgfInfo.pkg);
}

/**
 * manifest server might have to copy manifest template to the cache directory
 * and treat it as an entry point for webpack build.
 */
export function copyManifestEntryTemplate(dest: string) {}

/**
 * manifest server will compile a typescript based manifest package.
 * the compiled assets will be put in outDir which is some location in cache dir.
 */
export function compileTypescriptManifestPkg(outDir: string) {}

/**
 * manifest server will bundle the manifest package. The generated bundle will be sent
 * over to the manifest client.
 */
export function bundleManifestPkg(
  entryPoint: string,
  outDir: string,
  packageName: string
) {}
