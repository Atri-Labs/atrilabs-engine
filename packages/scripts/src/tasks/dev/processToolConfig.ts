import { createGlobalModuleForLayer } from "../../shared/processLayer";
import { ToolPkgInfo } from "../../shared/types";
import { extractLayerEntries, importToolConfig } from "../../shared/utils";

export function processToolConfig(toolPkgInfo: ToolPkgInfo) {
  return importToolConfig(toolPkgInfo.configFile).then(async (toolConfig) => {
    const layerEntries = await extractLayerEntries(toolConfig, toolPkgInfo);

    // create global module for each layer
    layerEntries.forEach((layerEntry) => {
      createGlobalModuleForLayer(layerEntry);
    });

    return { layerEntries, toolConfig };
  });
}
