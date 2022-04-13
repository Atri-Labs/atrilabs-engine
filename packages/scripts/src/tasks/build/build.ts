#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { LayerConfig, ToolConfig } from "@atrilabs/core";

// this script is expected to be run via a package manager like npm, yarn
const toolDir = process.cwd();
const toolSrc = path.resolve(toolDir, "src");
const toolConfigFile = path.resolve(toolSrc, "tool.config.js");

function toolConfigExists() {
  // <toolDir>/src/tool.config.(ts|js) should exist
  if (fs.existsSync(toolConfigFile)) {
    return true;
  }
  throw Error(`Module Not Found: ${toolConfigFile}`);
}
toolConfigExists();

async function processLayer(layerConfigPath: string) {
  import(layerConfigPath).then((mod: { default: LayerConfig }) => {
    let layerEntry = mod.default.modulePath;
    if (!path.isAbsolute(mod.default.modulePath)) {
      layerEntry = path.resolve(layerConfigPath, mod.default.modulePath);
    }
    // check if layerEntry file exists
    if (fs.existsSync(layerEntry) && !fs.statSync(layerEntry).isDirectory()) {
      // add this to layer entries
    }
  });
}

import(toolConfigFile).then((mod: { default: ToolConfig }) => {
  const layers = mod.default.layers;
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]!.modulePath;
    /**
     * layer.config.js file is searched at following locations:
     * 1. <toolDir>/node_modules/<modulePath>/lib/layer.config.js
     * if path is absolute package path.
     *
     * 2. Relative path
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
    processLayer(layerConfigPath);
  }
});
