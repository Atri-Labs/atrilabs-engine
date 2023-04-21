import {
  createComponentFromNode,
  dirStructureToIR,
  pathsIRToRouteObjectPaths,
  readDirStructure,
} from "@atrilabs/atri-app-core/src/utils";
import type { ComponentManifests } from "@atrilabs/atri-app-core/src/types";
import path from "path";
import { PageInfo } from "./types";
import fs from "fs";
import { AnyEvent, createForest, Forest } from "@atrilabs/forest";
import type { ManifestIR, ToolConfig } from "@atrilabs/core/src/types";
import { processManifestDirsString } from "../../commons/processManifestDirsString";
import pkgUp from "pkg-up";
import {
  CallbackHandler,
  ReactComponentManifestSchema,
} from "@atrilabs/react-component-manifest-schema";
import {
  componentTreeDef,
  callbackTreeDef,
  forestDef,
} from "@atrilabs/atri-app-core/src/api/forestDef";
import {
  collectWebpackMessages,
  createConfig,
  createNodeLibConfig,
  PrepareConfig,
  reportWarningsOrSuccess,
} from "@atrilabs/commands-builder";
import webpack from "webpack";
import { createCSSString } from "@atrilabs/atri-app-core/src/utils";

function checkIfCWD(dir: string) {
  return dir === process.cwd();
}

/**
 * This function expects that all the packages have dist/manfiest.bundle.js.
 *
 * This function expects that the app's manifest directory has been
 * bundled in dist/manifest.bundle.js.
 * @param manifestDirs
 */
export function getComponentManifests(manifestDirs: string[]) {
  const packageRoots = [
    ...processManifestDirsString(manifestDirs).map((fullPath) => {
      const packageJSONPath = pkgUp.sync({ cwd: path.dirname(fullPath) });
      if (packageJSONPath) {
        const dir = path.dirname(packageJSONPath);
        return dir;
      }
      throw Error(`Can't find package.json for ${fullPath}`);
    }),
    process.cwd(),
  ];
  const componentManifests: ComponentManifests = {};
  packageRoots.forEach((packageRoot) => {
    const manifestBundle = path.resolve(
      packageRoot,
      "dist",
      "manifests.bundle.js"
    );
    if (checkIfCWD(packageRoot)) {
      if (!fs.existsSync(manifestBundle)) {
        console.log("Skipping reading manifests in this package.");
        return;
      }
    } else {
      if (!fs.existsSync(manifestBundle)) {
        console.log(`Cannot find manifests at ${manifestBundle}`);
        console.log(
          `Please check if the required packages are installed properly.`
        );
        process.exit(1);
      }
    }
    // @ts-ignore
    const pkgName = __non_webpack_require__(
      path.resolve(packageRoot, "package.json")
    )["name"];
    if (componentManifests[pkgName] === undefined) {
      componentManifests[pkgName] = {};
    }
    // @ts-ignore
    const manifestRegistry = __non_webpack_require__(manifestBundle);
    if (Array.isArray(manifestRegistry.default)) {
      manifestRegistry.default.forEach((fullManifest: any) => {
        const reactManifest: ReactComponentManifestSchema =
          fullManifest["fullManifest"]["manifests"][
            "@atrilabs/react-component-manifest-schema/src/index.ts"
          ];
        const paths: ManifestIR = fullManifest["paths"];
        componentManifests[pkgName]![reactManifest.meta.key] = {
          manifest: reactManifest,
          paths,
        };
      });
    }
  });
  return componentManifests;
}

function createForestFromEvents(events: AnyEvent[]) {
  const forest = createForest(forestDef);
  forest.handleEvents({
    name: "events",
    events,
    meta: { agent: "server-sent" },
  });
  return forest;
}

function getComponentCallbackHandlers(compId: string, forest: Forest) {
  const callbackTree = forest.tree(callbackTreeDef.id);
  if (callbackTree) {
    const callbackNodeId = callbackTree.links[compId]?.childId;
    if (callbackNodeId) {
      return (callbackTree.nodes[callbackNodeId]?.state["property"]
        ?.callbacks || {}) as { [callbackName: string]: CallbackHandler };
    }
  }
  return;
}

function getComponentsFromNodes(
  forest: Forest,
  componentManifests: ComponentManifests
) {
  const nodes = forest.tree(componentTreeDef.id)!.nodes!;
  const nodeIds = Object.keys(nodes);
  return nodeIds.map((nodeId) => {
    const component = createComponentFromNode(
      nodes[nodeId]!,
      forest,
      componentManifests
    )!;
    const handlers = getComponentCallbackHandlers(nodeId, forest) || {};
    return {
      ...component,
      alias: nodes[nodeId]!.state["alias"] as string,
      handlers,
    };
  });
}

function getEventsFile(pagePath: string) {
  const eventsJSONFile = path.resolve(
    "pages",
    pagePath.replace(/(\.((js|ts)x?))$/, ".events.json").replace(/^(\/)/, "")
  );
  if (fs.existsSync(eventsJSONFile)) {
    return eventsJSONFile;
  }
  return undefined;
}

function getComponentsFromEventsPath(
  eventsPath: string,
  componentManifests: ComponentManifests
) {
  try {
    const events: AnyEvent[] = JSON.parse(
      fs.readFileSync(eventsPath).toString()
    );
    const forest = createForestFromEvents(events);
    const components = getComponentsFromNodes(forest, componentManifests);
    return components;
  } catch (err) {
    throw err;
  }
}

export async function getPagesInfo(options: {
  componentManifests: ComponentManifests;
}): Promise<PageInfo[]> {
  const { componentManifests } = options;
  const pagePaths = (await readDirStructure(path.resolve("pages"))).filter(
    (pagePath) =>
      !["/_app", "/_error", "/_document"].includes(
        pagePath.replace(/(\.(js|ts)x?)$/, "")
      )
  );
  const irs = dirStructureToIR(pagePaths);
  const routeObjectPaths = pathsIRToRouteObjectPaths(irs);
  return pagePaths.map((pagePath, index) => {
    const eventsPath = getEventsFile(pagePath);
    const components = eventsPath
      ? getComponentsFromEventsPath(eventsPath, componentManifests)
      : [];
    return {
      pagePath,
      routeObjectPath: routeObjectPaths[index]!,
      eventsPath: getEventsFile(pagePath),
      components,
    };
  });
}

export function createStoreFromComponents(
  components: ReturnType<typeof getComponentsFromNodes>
) {
  const store: { [alias: string]: any } = {};
  components.forEach((component) => {
    const copyOfProps = JSON.parse(JSON.stringify(component.props));
    delete copyOfProps["styles"];
    store[component.alias] = copyOfProps;
  });
  return store;
}

export async function createCssText(
  components: ReturnType<typeof getComponentsFromNodes>
) {
  // create a css string for each component
  const promises = components.map(async (component) => {
    if (component.props["styles"]) {
      // strs is a combination of root style & breakpoint style
      const strs = createCSSString(
        `.${component.alias}`,
        component.props["styles"].styles || {},
        component.props["styles"].breakpoints || {}
      );
      return (await strs).join("\n");
    }
    return "";
  });
  return (await Promise.all(promises)).join("\n");
}

export function readToolConfig(toolPkg: string) {
  // @ts-ignore
  const toolConfig = __non_webpack_require__(toolPkg);
  return toolConfig as ToolConfig;
}

/**
 * mergeWithInitState function is supposed to be run
 * from inside an atri app
 */
export function mergeWithInitState() {}

export function startNodeWebpackBuild(
  params: Parameters<typeof createNodeLibConfig>[0] & {
    prepareConfig?: PrepareConfig;
  }
) {
  const webpackConfig = createNodeLibConfig(params);

  if (typeof params.prepareConfig === "function") {
    params.prepareConfig(webpackConfig);
  }

  return new Promise<void>((resolve, reject) => {
    webpack(webpackConfig, async (err, stats) => {
      try {
        const messages = await collectWebpackMessages({
          writeStats: false,
          err,
          stats,
          outputDir: params.paths.outputDir,
        });
        reportWarningsOrSuccess(messages.warnings);
        if (err || stats?.hasErrors()) reject();
        else resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

export function startWebpackBuild(
  params: Parameters<typeof createConfig>[0] & {
    prepareConfig?: PrepareConfig;
  }
) {
  const webpackConfig = createConfig(params);

  if (typeof params.prepareConfig === "function") {
    params.prepareConfig(webpackConfig);
  }

  return new Promise<webpack.StatsChunk[]>((resolve, reject) => {
    webpack(webpackConfig, async (err, stats) => {
      try {
        const messages = await collectWebpackMessages({
          writeStats: false,
          err,
          stats,
          outputDir: params.paths.outputDir,
        });
        reportWarningsOrSuccess(messages.warnings);
        fs.writeFileSync(
          path.resolve(params.paths.outputDir, `webpack-stats.json`),
          JSON.stringify(
            stats?.toJson().chunks?.map((chunk) => {
              return {
                id: chunk.id,
                parents: chunk.parents,
                siblings: chunk.siblings,
                files: chunk.files,
                runtime: chunk.runtime,
                children: chunk.children,
                entry: chunk.entry,
              };
            })
          )
        );
        if (err || stats?.hasErrors()) reject(err || stats?.toJson().errors);
        else resolve(stats?.toJson().chunks || []);
      } catch (err) {
        reject(err);
      }
    });
  });
}

export function getEntryNameFromPathPath(pagePath: string) {
  const entryName = pagePath.replace(/^\//, "").replace(/(\.(js|ts)x?)$/, "");
  return entryName;
}

function traverseForConcernedChunkIds(
  id: string | number,
  idChunkMap: {
    [chunkId: string | number]: webpack.StatsChunk;
  },
  visited: Set<string | number>
): (string | number)[] {
  const chunk = idChunkMap[id];
  const ownIds = [...(chunk?.parents || [])];
  return [
    ...ownIds
      .map((ownId) => {
        if (visited.has(ownId)) return [];
        visited.add(ownId);
        return traverseForConcernedChunkIds(ownId, idChunkMap, visited);
      })
      .flat(),
    ...ownIds,
  ];
}

function startTraverse(
  id: string | number,
  idChunkMap: {
    [chunkId: string | number]: webpack.StatsChunk;
  }
) {
  const visited = new Set<string | number>([id]);
  const concernedChunkIds = traverseForConcernedChunkIds(
    id,
    idChunkMap,
    visited
  );
  return concernedChunkIds
    .map((chunkId) => {
      return idChunkMap[chunkId]?.files || [];
    })
    .flat();
}

export function getAssetDependencyGraph(
  pagesInfo: PageInfo[],
  chunks: webpack.StatsChunk[]
) {
  const entryNames = new Set<string>();
  pagesInfo.forEach(({ pagePath }) => {
    const entryName = getEntryNameFromPathPath(pagePath);
    entryNames.add(entryName);
  });

  const entryChunkMap: { [entryName: string]: webpack.StatsChunk } = {};
  chunks.forEach((chunk) => {
    if (chunk.files) {
      chunk.files.forEach((file) => {
        const probableEntryName = file.replace(/(\.js)$/, "");
        if (entryNames.has(probableEntryName))
          entryChunkMap[probableEntryName] = chunk;
      });
    }
  });

  const idChunkMap: { [chunkId: string | number]: webpack.StatsChunk } = {};
  chunks.forEach((chunk) => {
    if (chunk.id) idChunkMap[chunk.id] = chunk;
  });

  const assetDependencyGraph: { [entryName: string]: string[] } = {};
  entryNames.forEach((entryName) => {
    const entryChunk = entryChunkMap[entryName];
    const siblingChunkIds = entryChunk?.siblings || [];
    const files = [...siblingChunkIds, entryChunk!.id!]
      .map((chunkId) => {
        return startTraverse(chunkId, idChunkMap);
      })
      .flat();

    siblingChunkIds.forEach((siblingChunkId) => {
      if (idChunkMap[siblingChunkId]?.files) {
        files.push(...idChunkMap[siblingChunkId]!.files!);
      }
    });

    if (entryChunk?.files) files.push(...entryChunk.files);

    assetDependencyGraph[entryName] = Array.from(
      new Set(["runtime.js", ...files])
    );
  });

  return assetDependencyGraph;
}
