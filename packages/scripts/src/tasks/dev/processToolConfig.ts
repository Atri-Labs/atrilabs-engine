import { createGlobalModuleForLayer } from "../../shared/processLayer";
import { ToolPkgInfo } from "../../shared/types";
import { extractLayerEntries, importToolConfig } from "../../shared/utils";
import watchLayerSource from "./watchLayerSource";

export function processToolConfig(toolPkgInfo: ToolPkgInfo) {
  return importToolConfig(toolPkgInfo.configFile).then(async (toolConfig) => {
    const layerEntries = await extractLayerEntries(toolConfig, toolPkgInfo);

    // create global module for each layer
    layerEntries.forEach((layerEntry) => {
      createGlobalModuleForLayer(layerEntry);
    });

    // Watch layer src directory. It does nothing if the directory is already under watch.
    watchLayerSource(layerEntries);

    return { layerEntries, toolConfig };
  });
}
