import fs from "fs";
import { LayerEntry } from "./types";
import path from "path";

/**
 * Creates global modules for all layers. A global module for a layer has
 * information global in the scope of layer such as whether currentLayer
 * is root or child.
 */
export function createGlobalModuleForLayer(layerEntry: LayerEntry) {
  const lines: string[] = [];
  if (layerEntry.isRoot) {
    lines.push(`export const currentLayer = "root";`);
  } else {
    lines.push(`export const currentLayer = "child";`);
  }
  if (!fs.existsSync(path.dirname(layerEntry.globalModulePath))) {
    fs.mkdirSync(path.dirname(layerEntry.globalModulePath), {
      recursive: true,
    });
  }
  fs.writeFileSync(layerEntry.globalModulePath, lines.join("\n"));
}

/**
 * Symlink all layer's config file in cache directory. It is required
 * so that when a new layer is added to tool.config.js, re-compilation kicks in.
 * Watching this directory will be equivalent of watching all layer.config.js file.
 */
export function symlinkLayerConfigFile(layerEntry: LayerEntry) {
  if (!fs.existsSync(path.dirname(layerEntry.layerConfigSymlink))) {
    fs.mkdirSync(path.dirname(layerEntry.layerConfigSymlink), {
      recursive: true,
    });
  }
  fs.symlinkSync(
    layerEntry.layerConfigPath,
    layerEntry.layerConfigSymlink,
    "file"
  );
}
