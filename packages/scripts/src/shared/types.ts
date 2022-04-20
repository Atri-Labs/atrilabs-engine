import { LayerConfig, ToolConfig } from "@atrilabs/core";

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
  // the path where layer specific module is written
  globalModulePath: string;
  layerConfigSymlink: string;
  // flag root layer
  isRoot: boolean;
  // info
  exposes: LayerConfig["exposes"];
  requires: LayerConfig["requires"];
  remap: ToolConfig["layers"]["0"]["remap"];
};

export type CorePkgInfo = {
  dir: string;
  // file that is used as webpack entry point
  entryFile: string;
  // file that gets imported when core package is imported
  indexFile: string;
};

export type ToolEnv = {
  PUBLIC_URL: string;
};
