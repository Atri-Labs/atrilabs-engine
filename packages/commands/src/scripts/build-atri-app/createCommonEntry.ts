import {
  Callback,
  CallbackHandler,
} from "@atrilabs/react-component-manifest-schema";
import { Entry } from "webpack";
import { ComponentManifests, PageInfo } from "./types";
import {
  createCssText,
  createStoreFromComponents,
  getEntryNameFromPathPath,
} from "./utils";
const { stringify } = require("querystring");
import { CANVAS_ZONE_ROOT_ID } from "@atrilabs/atri-app-core/src/api/consts";
import pkgUp from "pkg-up";
import path from "path";

export async function createCommonEntry(options: {
  pageInfos: PageInfo[];
  componentManifests: ComponentManifests;
  loaderName: string;
}) {
  const entry: Entry = {
    _error: { import: "./pages/_error" },
  };
  const { pageInfos, componentManifests, loaderName } = options;
  const processedComponentManifests: {
    [pkg: string]: { [key: string]: string };
  } = {};
  Object.keys(componentManifests).reduce((prev, pkg) => {
    Object.keys(componentManifests[pkg]!).reduce((prev, key) => {
      if (prev[pkg] === undefined) prev[pkg] = {};
      if (
        componentManifests[pkg]![key]!.paths.component.startsWith("manifests/")
      ) {
        prev[pkg]![key] = path.resolve(
          process.cwd(),
          componentManifests[pkg]![key]!.paths.component
        );
      } else {
        prev[pkg]![key] = path.resolve(
          path.dirname(
            pkgUp.sync({
              // @ts-ignore
              cwd: __non_webpack_require__.resolve(pkg),
            })!
          ),
          componentManifests[pkg]![key]!.paths.component
        );
      }

      return prev;
    }, prev);
    return prev;
  }, processedComponentManifests);

  const routes = pageInfos.map(({ routeObjectPath }) => {
    return routeObjectPath;
  });

  for (let i = 0; i < pageInfos.length; i++) {
    const { pagePath, routeObjectPath, components } = pageInfos[i]!;
    const entryName = getEntryNameFromPathPath(pagePath);
    const srcs: string[] = [];

    const aliasCompMap: {
      [alias: string]: {
        pkg: string;
        key: string;
        actions: {
          [callbackName: string]: Callback[];
        };
        handlers: {
          [callbackName: string]: CallbackHandler;
        };
        type: "repeating" | "parent" | "normal";
      };
    } = {};
    components.forEach((comp) => {
      aliasCompMap[comp.alias] = {
        pkg: comp.meta.pkg,
        key: comp.meta.key,
        actions: comp.callbacks,
        handlers: comp.handlers,
        type: comp.type,
      };
    });

    const idCompMap: { [id: string]: typeof components["0"] } = {};
    components.reduce((prev, comp) => {
      prev[comp.id] = comp;
      return prev;
    }, idCompMap);

    const compTree: { [canvasZoneId: string]: { [compId: string]: string[] } } =
      {};
    components.forEach((comp) => {
      if (compTree[comp.parent.canvasZoneId] === undefined) {
        compTree[comp.parent.canvasZoneId] = {};
      }
      if (compTree[comp.parent.canvasZoneId]![comp.parent.id] === undefined) {
        compTree[comp.parent.canvasZoneId]![comp.parent.id] = [];
      }
      if (
        (comp.type === "parent" || comp.type === "repeating") &&
        compTree[comp.parent.canvasZoneId]![comp.id] === undefined
      ) {
        compTree[comp.parent.canvasZoneId]![comp.id] = [];
      }
      compTree[comp.parent.canvasZoneId]![comp.parent.id]!.push(comp.id!);
    });
    Object.keys(compTree).forEach((canvasZoneId) => {
      Object.keys(compTree[canvasZoneId]!).forEach((compId) => {
        compTree[canvasZoneId]![compId]!.sort(
          (a, b) => idCompMap[a]!.parent.index - idCompMap[b]!.parent.index
        );
      });
    });

    const compTreeWithAlias: {
      [canvasZoneId: string]: { [compId: string]: string[] };
    } = {};
    Object.keys(compTree).forEach((canvasZoneId) => {
      Object.keys(compTree[canvasZoneId]!).forEach((compId) => {
        compTree[canvasZoneId]![compId]!.forEach((childId) => {
          if (compTreeWithAlias[canvasZoneId] === undefined) {
            compTreeWithAlias[canvasZoneId] = {};
          }

          if (compId === CANVAS_ZONE_ROOT_ID) {
            if (compTreeWithAlias[canvasZoneId]![compId] === undefined) {
              compTreeWithAlias[canvasZoneId]![compId] = [];
            }
            compTreeWithAlias[canvasZoneId]![compId]!.push(
              idCompMap[childId]!.alias
            );
          } else {
            if (
              compTreeWithAlias[canvasZoneId]![idCompMap[compId]!.alias] ===
              undefined
            ) {
              compTreeWithAlias[canvasZoneId]![idCompMap[compId]!.alias] = [];
            }
            compTreeWithAlias[canvasZoneId]![idCompMap[compId]!.alias]!.push(
              idCompMap[childId]!.alias
            );
          }
        });
      });
    });

    const requiredComponentMap: { [pkg: string]: { [key: string]: string } } =
      {};
    components.forEach((component) => {
      const pkg = component.meta.pkg;
      const key = component.meta.key;
      if (requiredComponentMap[pkg] === undefined) {
        requiredComponentMap[pkg] = {};
      }
      requiredComponentMap[pkg]![key] = processedComponentManifests[pkg]![key]!;
    });

    const options = Buffer.from(
      JSON.stringify({
        pagePath,
        srcs: JSON.stringify(srcs || []),
        reactRouteObjectPath: routeObjectPath,
        routes: JSON.stringify(routes || []),
        styles: await createCssText(components),
        entryRouteStore: JSON.stringify(
          createStoreFromComponents(components) || {}
        ),
        aliasCompMap: JSON.stringify(aliasCompMap),
        componentTree: JSON.stringify(compTreeWithAlias),
        componentMap: JSON.stringify(requiredComponentMap),
      })
    ).toString("base64");
    entry[entryName] = {
      import: `${loaderName}?${stringify({
        options: options,
      })}!`,
    };
  }
  return entry;
}
