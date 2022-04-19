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
