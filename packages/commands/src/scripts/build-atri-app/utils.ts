import {
  dirStructureToIR,
  pathsIRToRouteObjectPaths,
  readDirStructure,
} from "@atrilabs/atri-app-core/src/utils";
import path from "path";
import { PageInfo } from "./types";
import fs from "fs";
import { AnyEvent } from "@atrilabs/forest";
import {
  createForestFromEvents,
  getComponentsFromNodes,
  jssToCss,
} from "../../commons/build-utils";

export function getEventsFile(pagePath: string) {
  const eventsJSONFile = pagePath.replace(/(\.((js|ts)x?))$/, ".events.json");
  if (fs.existsSync(eventsJSONFile)) {
    return eventsJSONFile;
  }
  return undefined;
}

export function getComponentsFromEventsPath(eventsPath: string) {
  try {
    const events: AnyEvent[] = JSON.parse(
      fs.readFileSync(eventsPath).toString()
    );
    const forest = createForestFromEvents(events);
    const components = getComponentsFromNodes(forest);
    return components;
  } catch (err) {
    throw err;
  }
}

export async function getPagesInfo(): Promise<PageInfo[]> {
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
      ? getComponentsFromEventsPath(eventsPath)
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
