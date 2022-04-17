#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { LayerConfig, ToolConfig } from "@atrilabs/core";
import { Configuration, webpack } from "webpack";

// this script is expected to be run via a package manager like npm, yarn
const toolDir = process.cwd();
const toolSrc = path.resolve(toolDir, "src");
const toolConfigFile = path.resolve(toolSrc, "tool.config.js");
const toolNodeModule = path.resolve(toolDir, "node_modules");
const cacheDirectory = path.resolve(
  toolNodeModule,
  ".cache",
  "@atrilabs",
  "build"
);

const moduleFileExtensions = ["js", "jsx"];

function toolConfigExists() {
  // <toolDir>/src/tool.config.(ts|js) should exist
  if (fs.existsSync(toolConfigFile)) {
    return true;
  }
  throw Error(`Module Not Found: ${toolConfigFile}`);
}
toolConfigExists();

type LayerEntry = {
  index: number;
  layerPackageName: string;
  layerPath: string;
  layerConfigPath: string;
  layerEntry: string;
  // the path where layer specific module is written
  globalModulePath: string;
  // flag root layer
  isRoot: boolean;
  // info
  exposes: LayerConfig["exposes"];
  requires: LayerConfig["requires"];
};
const layerEntries: {
  [layerConfigPath: string]: LayerEntry;
} = {};

async function getLayerInfo(layerConfigPath: string) {
  return new Promise<{
    layerEntry: string;
    requires: LayerConfig["requires"];
    exposes: LayerConfig["exposes"];
  }>((res, rej) => {
    import(layerConfigPath).then((mod: { default: LayerConfig }) => {
      let layerEntry = mod.default.modulePath;
      if (!path.isAbsolute(mod.default.modulePath)) {
        layerEntry = path.resolve(
          path.dirname(layerConfigPath),
          mod.default.modulePath
        );
      }
      // check if layerEntry file exists with extensions .js .jsx
      for (let i = 0; i < moduleFileExtensions.length; i++) {
        const ext = moduleFileExtensions[i];
        const filename = `${layerEntry}.${ext}`;
        if (fs.existsSync(filename) && !fs.statSync(filename).isDirectory()) {
          // add this to layer entries
          res({
            layerEntry,
            requires: mod.default.requires,
            exposes: mod.default.exposes,
          });
          return;
        }
      }
      rej(`${layerEntry} not found`);
    });
  });
}

function resetBuildCache() {
  if (fs.existsSync(cacheDirectory)) {
    fs.rmSync(cacheDirectory, { force: true, recursive: true });
  }
  fs.mkdirSync(cacheDirectory, { recursive: true });
}
resetBuildCache();

function createGlobalModuleForLayer(layerEntry: LayerEntry) {
  const lines: string[] = [];
  if (layerEntry.isRoot) {
    lines.push(`export const currentLayer = "root"`);
  } else {
    lines.push(`export const currentLayer = "child"`);
  }
  if (!fs.existsSync(path.dirname(layerEntry.globalModulePath))) {
    fs.mkdirSync(path.dirname(layerEntry.globalModulePath), {
      recursive: true,
    });
  }
  fs.writeFileSync(layerEntry.globalModulePath, lines.join("\n"));
}

import(toolConfigFile).then(async (mod: { default: ToolConfig }) => {
  const layers = mod.default.layers;
  // create all layer entries
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]!.pkg;
    /**
     * layer.config.js file is searched at following locations:
     * 1. <toolDir>/node_modules/<modulePath>/lib/layer.config.js
     * if path is absolute package path.
     *
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
    try {
      const layerPath = path.dirname(require.resolve(`${layer}/package.json`));
      const layerPackageName = layer;
      const globalModulePath = path.resolve(cacheDirectory, layer, "index.js");
      const { layerEntry, exposes, requires } = await getLayerInfo(
        layerConfigPath
      );
      const isRoot = i === 0 ? true : false;
      layerEntries[layerConfigPath] = {
        index: i,
        layerEntry,
        isRoot,
        layerConfigPath,
        layerPath,
        globalModulePath,
        layerPackageName,
        exposes,
        requires,
      };
    } catch (err) {
      console.log(err);
    }
  }

  const layerConfigPaths = Object.keys(layerEntries);
  const exposedSockets: {
    [k in keyof Required<LayerConfig["exposes"]>]: Set<string>;
  } = {
    menu: new Set(),
    containers: new Set(),
    tabs: new Set(),
  };
  const layerList: { path: string }[] = [];
  layerConfigPaths.forEach((layerConfigPath) => {
    // create global module for each layer
    createGlobalModuleForLayer(layerEntries[layerConfigPath]!);
    // prepare input for babel plugins
    // input to for add-to-meta-core.js
    layerEntries[layerConfigPath]!.exposes["menu"]
      ? Object.values(layerEntries[layerConfigPath]!.exposes["menu"]!).forEach(
          exposedSockets["menu"].add,
          exposedSockets["menu"]
        )
      : null;
    layerEntries[layerConfigPath]!.exposes["containers"]
      ? Object.values(
          layerEntries[layerConfigPath]!.exposes["containers"]!
        ).forEach(
          exposedSockets["containers"].add,
          exposedSockets["containers"]
        )
      : null;
    layerEntries[layerConfigPath]!.exposes["tabs"]
      ? Object.values(layerEntries[layerConfigPath]!.exposes["tabs"]!).forEach(
          exposedSockets["tabs"].add,
          exposedSockets["tabs"]
        )
      : null;
  });
  // input for add-layer-import-to-core.js
  const layerEntryValues = Object.values(layerEntries);
  layerEntryValues.sort((a, b) => {
    return a.index - b.index;
  });
  layerList.push(
    ...layerEntryValues.map((value) => {
      return { path: value.layerEntry };
    })
  );
  console.log(JSON.stringify(layerList));

  // bundle ui
  const webpackConfig: Configuration = {
    target: "web",
    entry: {
      layers: {
        import: require.resolve("@atrilabs/core/lib/layers.js"),
        dependOn: "shared",
      },
      shared: ["react", "react-dom"],
    },
    output: {
      path: path.resolve(toolDir, mod.default.output),
    },
    module: {
      rules: [
        {
          enforce: "pre",
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve("source-map-loader"),
        },
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              loader: require.resolve("babel-loader"),
              options: {
                plugins: [
                  [
                    path.resolve(
                      __dirname,
                      "..",
                      "..",
                      "babel",
                      "add-layer-import-to-core.js"
                    ),
                    {
                      layers: layerList,
                    },
                  ],
                  [
                    path.resolve(
                      __dirname,
                      "..",
                      "..",
                      "babel",
                      "add-meta-to-core.js"
                    ),
                    {
                      menu: Array.from(exposedSockets["menu"]),
                      containers: Array.from(exposedSockets["containers"]),
                      tabs: Array.from(exposedSockets["tabs"]),
                    },
                  ],
                ],
                babelrc: false,
                configFile: false,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    },
  };
  webpack(webpackConfig, (err, stats) => {
    let buildFailed = false;
    if (err) {
      buildFailed = true;
      console.error(err);
    }
    if (stats?.hasErrors()) {
      buildFailed = true;
      console.log(stats?.toJson().errors);
    }
    if (!buildFailed) {
      console.log(`Build completed!`);
    }
  });
});
