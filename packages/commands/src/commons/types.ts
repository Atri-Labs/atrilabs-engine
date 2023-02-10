export type ToolPkgInfo = {
  dir: string;
  src: string;
  configFile: string;
  nodeModule: string;
  cacheDir: string;
  publicDir: string;
  toolHtml: string;
};

export type CorePkgInfo = {
  dir: string;
  // file that exports browserForestManager function
  // needed to fill in forest def from tool.config.js
  browserForestManagerFile: string;
  // file that contains manifestRegistry
  manifestRegistryFile: string;
  // file that exposes event API
  apiFile: string;
  // file that exposes all the block names collected from layers
  blockRegistryFile: string;
};
