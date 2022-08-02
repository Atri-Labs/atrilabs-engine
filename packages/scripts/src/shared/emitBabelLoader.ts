import {
  LayerConfig,
  ForestsConfig,
  RuntimeConfig,
  ToolConfig,
} from "@atrilabs/core";
import path from "path";
import { RuleSetRule, RuleSetUseItem } from "webpack";
import {
  LayerEntry,
  CorePkgInfo,
  RuntimeEntry,
  ManifestSchemaEntry,
} from "./types";
import {
  detectLayerForFile,
  detectRuntimeForFile,
  getNameMapForPackage,
  sortLayerEntriesInImportOrder,
} from "./utils";

/**
 * emitBabelLoader accounts for changes in layer.config.js and tool.config.js file.
 * It generates name maps etc. on every call.
 */
export default function emitBabelLoader(
  layerEntries: LayerEntry[],
  runtimeEntries: RuntimeEntry[],
  manifestSchemaEntries: ManifestSchemaEntry[],
  forestsConfig: ForestsConfig,
  corePkgInfo: CorePkgInfo,
  env: "production" | "development",
  clients: ToolConfig["clients"]
): Exclude<RuleSetRule["use"], undefined> {
  const isEnvDevelopment = env === "development";

  const getLayerList = (): { path: string }[] => {
    const sortedLayers = sortLayerEntriesInImportOrder(layerEntries);
    return sortedLayers.map((layer) => {
      return { path: layer.layerEntry };
    });
  };
  // read all name maps at once to reduce computation
  const nameMaps: {
    // path can be layerPath or runtimePath
    [path: string]: ReturnType<typeof getNameMapForPackage>;
  } = {};
  layerEntries.forEach((layer) => {
    nameMaps[layer.layerPath] = getNameMapForPackage(layer);
  });
  runtimeEntries.forEach((rt) => {
    nameMaps[rt.runtimePath] = getNameMapForPackage(rt);
  });

  // collect all exposed sockets from layers and runtimes
  // these exposed sockets are entered into core package's layerDetails.js file
  const getExposedSockets = (): {
    [k in keyof Required<
      LayerConfig["exposes"] | RuntimeConfig["exposes"]
    >]: Array<string>;
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
          exposedSockets.containers.add,
          exposedSockets.containers
        );
      }
      if (value.tabs) {
        Object.values(value.tabs).forEach(
          exposedSockets.tabs.add,
          exposedSockets.tabs
        );
      }
    });
    return {
      menu: Array.from(exposedSockets.menu),
      containers: Array.from(exposedSockets.containers),
      tabs: Array.from(exposedSockets.tabs),
    };
  };

  // we insert (import) global values like currentLayer etc.
  // to all the modules in a layer. We do this by importing the globalModulePath
  // for each layer.
  // const getImports = (
  //   filename: string
  // ): { namedImports: string[]; path: string }[] | undefined => {
  //   const layer = detectLayerForFile(filename, layerEntries);
  //   if (layer) {
  //     return [
  //       { namedImports: ["currentLayer"], path: layer.importGlobalModulePath },
  //     ];
  //   }
  //   return;
  // };

  const getNameMap = (filename: string) => {
    const layer = detectLayerForFile(filename, layerEntries);
    if (layer) {
      return nameMaps[layer.layerPath];
    }
    const runtime = detectRuntimeForFile(filename, runtimeEntries);
    if (runtime) {
      return nameMaps[runtime.runtimePath];
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
                "add-layer-jsx-import-to-core.js"
              ),
              {
                layers: getLayerList(),
                coreEntry: corePkgInfo.entryFile,
                runtimes: runtimeEntries.map((rt) => rt.runtimeEntry),
              },
            ],
            [
              path.resolve(__dirname, "..", "babel", "add-meta-to-core.js"),
              {
                ...getExposedSockets(),
                layerDetailsFile: corePkgInfo.layerDetailsFile,
              },
            ],
            // [
            //   path.resolve(__dirname, "..", "babel", "add-layer-import.js"),
            //   {
            //     getImports,
            //   },
            // ],
            [
              path.resolve(
                __dirname,
                "..",
                "babel",
                "jsx-replace-local-with-global.js"
              ),
              {
                getNameMap,
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
            [
              path.resolve(__dirname, "..", "babel", "add-forest-defs.js"),
              {
                browserForestManagerFile: corePkgInfo.browserForestManagerFile,
                forests: forestsConfig,
              },
            ],
            [
              path.resolve(
                __dirname,
                "..",
                "babel",
                "replace-import-with-id.js"
              ),
            ],
            [
              path.resolve(
                __dirname,
                "..",
                "babel",
                "populate-manifest-registry-in-core.js"
              ),
              {
                manifestRegistryFile: corePkgInfo.manifestRegistryFile,
                manifests: manifestSchemaEntries.map((entry) => {
                  return {
                    manifestId: entry.manifestId,
                    schemaModulePath: entry.modulePath,
                  };
                }),
              },
            ],
            [
              path.resolve(
                __dirname,
                "..",
                "babel",
                "add-event-client-to-core.js"
              ),
              {
                apiFile: corePkgInfo.apiFile,
                eventClient: clients.eventClient.modulePath,
              },
            ],
            isEnvDevelopment && require("react-refresh/babel"),
          ].filter(Boolean),
          presets: [
            "@babel/preset-typescript",
            ["@babel/preset-react", { runtime: "automatic" }],
          ],
          babelrc: false,
          configFile: false,
        },
      },
    ];
  };

  return use;
}
