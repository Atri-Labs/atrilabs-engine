import chokidar from "chokidar";
import fs from "fs";
import { CorePkgInfo, ToolPkgInfo } from "../../shared/types";
import { processToolConfig } from "./processToolConfig";

/**
 * Webpack doesn't watch files that doesn't get resolved in the build process.
 * Hence, this is a trick to force compilation.
 */
export default function forceRecompile(
  corePkgInfo: CorePkgInfo,
  toolPkgInfo: ToolPkgInfo
) {
  // forcing re-compile by re-writing core/lib/layers.js file
  const rewriteLayersJS = () => {
    const layersContent = fs.readFileSync(corePkgInfo.entryFile);
    fs.writeFileSync(corePkgInfo.entryFile, layersContent);
  };

  // layer configs that are not inside node_modules directory, are considered
  // as layers under development. Hence, we watch the layer.config.js files
  // for these layers.
  const addLayerConfigToWatch = () => {
    return processToolConfig(toolPkgInfo).then(({ layerEntries }) => {
      const configFiles = layerEntries
        .map((entry) => {
          if (!entry.layerConfigPath.match(/node_modules/)) {
            return entry.layerConfigPath;
          }
          return;
        })
        .filter((entry) => entry !== undefined) as string[];
      watcher.add(configFiles);
    });
  };

  const watcher = chokidar.watch([toolPkgInfo.configFile]);

  addLayerConfigToWatch();

  watcher.on("change", (path) => {
    if (path === toolPkgInfo.configFile) {
      addLayerConfigToWatch().then(rewriteLayersJS);
    } else {
      rewriteLayersJS();
    }
  });
}
