import {
  dirStructureToIR,
  pathsIRToRouteObjectPaths,
  readDirStructure,
} from "@atrilabs/atri-app-core/src/utils";
import path from "path";
import { ComponentManifests, PageInfo } from "./types";
import fs from "fs";
import { AnyEvent, createForest, Forest, TreeNode } from "@atrilabs/forest";
import type { ManifestIR, ToolConfig } from "@atrilabs/core/src/types";
import { processManifestDirsString } from "../../commons/processManifestDirsString";
import pkgUp from "pkg-up";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import {
  componentTreeDef,
  forestDef,
} from "@atrilabs/atri-app-core/src/api/forestDef";
import { getEffectiveStyle } from "@atrilabs/atri-app-core/src/utils/getEffectiveStyle";
import postcss from "postcss";
const cssjs = require("postcss-js");

function jssToCss(jss: React.CSSProperties) {
  return postcss()
    .process(jss, { parser: cssjs, from: undefined })
    .then((code) => {
      return code.css + ";";
    });
}

/**
 * This function expects that all the packages have dist/manfiest.bundle.js.
 *
 * This function expects that the app's manifest directory has been
 * bundled in dist/manifest.bundle.js.
 * @param manifestDirs
 */
function getComponentManifests(manifestDirs: string[]) {
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
        const paths: ManifestIR = fullManifest["fullManifest"]["paths"];
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

function createPropsFromManifestComponent(
  compId: string,
  manifet: any,
  breakpoint: { min: number; max: number },
  forest: Forest
) {
  const propsKeys = Object.keys(manifet.dev.attachProps);
  const props: { [key: string]: any } = {};
  for (let i = 0; i < propsKeys.length; i++) {
    const propKey = propsKeys[i]!;
    const treeId = manifet.dev.attachProps[propKey].treeId;
    const tree = forest.tree(treeId);
    if (tree && tree.links[compId]) {
      const link = tree.links[compId]!;
      if (link.childId) {
        const propNodeId = link.childId;
        if (tree.nodes[propNodeId] === undefined) {
          continue;
        }
        // convention that state.property field in tree contains the value
        const value = tree.nodes[propNodeId]!.state["property"];
        const breakpoints = tree.nodes[propNodeId]!.state["breakpoints"];
        // temporary fix: handle breakpoint for styles prop only

        if (value) {
          if (breakpoints && propKey === "styles" && breakpoint) {
            const styles = getEffectiveStyle(
              breakpoint,
              breakpoints,
              value["styles"]
            );
            props[propKey] = styles;
          } else {
            props[propKey] = value[propKey];
          }
        }
      }
    }
  }
  return props;
}

function createComponentFromNode(
  node: TreeNode,
  breakpoint: { min: number; max: number },
  forest: Forest,
  componentManifests: ComponentManifests
) {
  const id = node.id;
  const meta = node.meta;
  const pkg = meta.pkg;
  const key = meta.key;
  const parent = {
    id: node.state.parent.id,
    index: node.state.parent.index,
    canvasZoneId: node.state.parent["canvasZoneId"],
  };
  if (
    componentManifests[pkg] === undefined ||
    componentManifests[pkg]![key] === undefined
  ) {
    throw Error(
      `Manifest not found for manifest package ${pkg} for component key ${key}`
    );
  }
  const manifest = componentManifests[pkg]![key]!.manifest;
  // use CanvasAPI to create component
  const props = createPropsFromManifestComponent(
    id,
    manifest,
    breakpoint,
    forest
  );
  const callbacks =
    manifest.dev["attachCallbacks"] &&
    typeof manifest.dev["attachCallbacks"] === "object" &&
    !Array.isArray(manifest.dev["attachCallbacks"])
      ? manifest.dev["attachCallbacks"]
      : {};
  return {
    id,
    props,
    parent,
    acceptsChild: typeof manifest.dev.acceptsChild === "function",
    callbacks,
    meta: node.meta,
  };
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
      {
        max: 1200,
        min: 900,
      },
      forest,
      componentManifests
    )!;
    return { ...component, alias: nodes[nodeId]!.state["alias"] as string };
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
  manifestDirs: string[];
}): Promise<PageInfo[]> {
  const { manifestDirs } = options;
  const pagePaths = (await readDirStructure(path.resolve("pages"))).filter(
    (pagePath) =>
      !["/_app", "/_error", "/_document"].includes(
        pagePath.replace(/(\.(js|ts)x?)$/, "")
      )
  );
  const irs = dirStructureToIR(pagePaths);
  const routeObjectPaths = pathsIRToRouteObjectPaths(irs);
  const componentManifests = getComponentManifests(manifestDirs);
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
  const cssObj: { [alias: string]: React.CSSProperties } = {};
  components.forEach((component) => {
    if (component.props["styles"])
      cssObj[component.alias] = component.props["styles"];
  });
  return await jssToCss(cssObj);
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
