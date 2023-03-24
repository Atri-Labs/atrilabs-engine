import {
  Callback,
  CallbackHandler,
} from "@atrilabs/react-component-manifest-schema";
import { Entry } from "webpack";
import { PageInfo } from "./types";
import { createCssText, createStoreFromComponents } from "./utils";
const { stringify } = require("querystring");
import { CANVAS_ZONE_ROOT_ID } from "@atrilabs/atri-app-core/src/api/consts";

export async function createServerEntry(options: { pageInfos: PageInfo[] }) {
  const entry: Entry = {
    _error: { import: "./pages/_error" },
  };
  const { pageInfos } = options;
  const routes = pageInfos.map(({ routeObjectPath }) => {
    return routeObjectPath;
  });
  for (let i = 0; i < pageInfos.length; i++) {
    const { pagePath, routeObjectPath, components } = pageInfos[i]!;
    const entryName = pagePath.replace(/^\//, "");
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

          if (
            compTreeWithAlias[canvasZoneId]![compId] === undefined &&
            compId === CANVAS_ZONE_ROOT_ID
          ) {
            compTreeWithAlias[canvasZoneId]![compId] = [];
          } else if (
            compTreeWithAlias[canvasZoneId]![idCompMap[compId]!.alias] ===
            undefined
          ) {
            compTreeWithAlias[canvasZoneId]![idCompMap[compId]!.alias] = [];
          }

          compTreeWithAlias[canvasZoneId]![idCompMap[compId]!.alias]!.push(
            idCompMap[childId]!.alias
          );
        });
      });
    });
    entry[entryName] = {
      import: `atri-pages-server-loader?${stringify({
        pagePath,
        srcs: JSON.stringify(srcs || []),
        reactRouteObjectPath: routeObjectPath,
        routes: JSON.stringify(routes || []),
        styles: await createCssText(components),
        entryRouteStore: JSON.stringify(
          createStoreFromComponents(components) || {}
        ),
        aliasCompMap: JSON.stringify(aliasCompMap),
        compTree: JSON.stringify(compTreeWithAlias),
      })}!`,
    };
  }
  return entry;
}
