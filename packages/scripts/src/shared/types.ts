import { LayerConfig, ToolConfig } from "@atrilabs/core";

export type ToolPkgInfo = {
  dir: string;
  src: string;
  configFile: string;
  nodeModule: string;
  cacheDir: string;
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
