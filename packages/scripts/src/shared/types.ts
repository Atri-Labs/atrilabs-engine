import { LayerConfig, RuntimeConfig, ToolConfig } from "@atrilabs/core";

export type ToolPkgInfo = {
  dir: string;
  src: string;
  configFile: string;
  nodeModule: string;
  cacheDir: string;
  publicDir: string;
  toolHtml: string;
};

export type LayerEntry = {
  index: number;
  layerPackageName: string;
  layerPath: string;
  layerConfigPath: string;
  layerEntry: string;
  layerSrcDir: string;
  // the path where layer specific module is written
  globalModulePath: string;
  layerConfigSymlink: string;
  // flag root layer
  isRoot: boolean;
  // info
  exposes: LayerConfig["exposes"];
  requires: LayerConfig["requires"];
  remap: ToolConfig["layers"]["0"]["remap"];
  runtime: LayerConfig["runtime"];
};

export type RuntimeEntry = {
  index: number;
  runtimePackageName: string;
  runtimePath: string;
  runtimeConfigPath: string;
  runtimeEntry: string;
  runtimeSrcDir: string;
  // info
  exposes: RuntimeConfig["exposes"];
  requires: RuntimeConfig["requires"];
  remap: ToolConfig["runtimes"]["0"]["remap"];
};

export type CorePkgInfo = {
  dir: string;
  // file that is used as webpack entry point
  entryFile: string;
  // file that gets imported when core package is imported
  indexFile: string;
  // file that contains information spanning and applicable to all layers
  // such as global name map for menu, tab, containers etc.
  layerDetailsFile: string;
  // file that contains setCurrentForest function
  setCurrentForestFile: string;
};

export type ToolEnv = {
  PUBLIC_URL: string;
};

export type ServerConfig = {
  host: string;
  port: number;
};
