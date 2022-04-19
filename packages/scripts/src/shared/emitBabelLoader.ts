import { LayerConfig } from "@atrilabs/core";
import path from "path";
import { RuleSetRule, RuleSetUseItem } from "webpack";
import { LayerEntry } from "./types";
import {
  detectLayerForFile,
  getNameMapForLayer,
  sortLayerEntriesInImportOrder,
} from "./utils";

/**
 * emitBabelLoader accounts for changes in layer.config.js and tool.config.js file.
 * It generates name maps etc. on every call.
 */
export default function emitBabelLoader(
  layerEntries: LayerEntry[]
): Exclude<RuleSetRule["use"], undefined> {
  const getLayerList = (): { path: string }[] => {
    const sortedLayers = sortLayerEntriesInImportOrder(layerEntries);
    return sortedLayers.map((layer) => {
      return { path: layer.layerEntry };
    });
  };
  // read all name maps at once to reduce computation
  const nameMaps: {
    [layerPath: string]: ReturnType<typeof getNameMapForLayer>;
  } = {};
  layerEntries.forEach((layer) => {
    nameMaps[layer.layerPath] = getNameMapForLayer(layer);
  });

  const getExposedSockets = (): {
    [k in keyof Required<LayerConfig["exposes"]>]: Array<string>;
  } => {
    const exposedSockets = {
      menu: new Set<string>(),
      containers: new Set<string>(),
      tabs: new Set<string>(),
    };
    const values = Object.values(nameMaps);
    values.forEach((value) => {
      if (value.menu) {
        Object.values(value.menu).forEach(
          exposedSockets.menu.add,
          exposedSockets.menu
        );
      }
      if (value.containers) {
        Object.values(value.containers).forEach(
          exposedSockets.menu.add,
          exposedSockets.menu
        );
      }
      if (value.tabs) {
        Object.values(value.tabs).forEach(
          exposedSockets.menu.add,
          exposedSockets.menu
        );
      }
    });
    return {
      menu: Array.from(exposedSockets.menu),
      containers: Array.from(exposedSockets.containers),
      tabs: Array.from(exposedSockets.tabs),
    };
  };

  const getImports = (
    filename: string
  ): { namedImports: string[]; path: string }[] | undefined => {
    const layer = detectLayerForFile(filename, layerEntries);
    if (layer) {
      return [{ namedImports: ["currentLayer"], path: layer.globalModulePath }];
    }
    return;
  };

  const getNameMap = (filename: string) => {
    const layer = detectLayerForFile(filename, layerEntries);
    if (layer) {
      return nameMaps[layer.layerPath];
    }
    return;
  };

  const use = (): RuleSetUseItem[] => {
    return [
      {
        loader: require.resolve("babel-loader"),
        options: {
          plugins: [
            [
              path.resolve(
                __dirname,
                "..",
                "babel",
                "add-layer-import-to-core.js"
              ),
              {
                layers: getLayerList(),
              },
            ],
            [
              path.resolve(__dirname, "..", "babel", "add-meta-to-core.js"),
              getExposedSockets(),
            ],
            [
              path.resolve(__dirname, "..", "babel", "add-layer-import.js"),
              {
                getImports,
              },
            ],
            [
              path.resolve(
                __dirname,
                "..",
                "babel",
                "replace-local-with-global.js"
              ),
              {
                getNameMap,
              },
            ],
          ],
          babelrc: false,
          configFile: false,
        },
      },
    ];
  };

  return use;
}
