import { createGlobalModuleForLayer } from "../../shared/processLayer";
import { ToolPkgInfo } from "../../shared/types";
import {
  extractLayerEntries,
  extractManifestSchemaEntries,
  extractRuntimeEntries,
  importToolConfig,
} from "../../shared/utils";
import { watchLayerSource, watchRuntimeSource } from "./watchPackageSource";

export function processToolConfig(toolPkgInfo: ToolPkgInfo) {
  return importToolConfig(toolPkgInfo.configFile).then(async (toolConfig) => {
    const layerEntries = await extractLayerEntries(toolConfig, toolPkgInfo);

    // create global module for each layer
    layerEntries.forEach((layerEntry) => {
      createGlobalModuleForLayer(layerEntry);
    });

    const runtimeEntries = await extractRuntimeEntries(toolConfig);

    const manifestSchemaEntries = await extractManifestSchemaEntries(
      toolConfig
    );

    // Watch layer src directory. It does nothing if the directory is already under watch.
    watchLayerSource(layerEntries);

    // Wathc runtime src directory.
    watchRuntimeSource(runtimeEntries);

    return { layerEntries, toolConfig, runtimeEntries, manifestSchemaEntries };
  });
}
