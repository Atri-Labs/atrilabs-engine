import fs from "fs";
import path from "path";
import {
  readDirStructure,
  dirStructureToIR,
  pathsIRToRouteObjectPaths,
} from "@atrilabs/atri-app-core";
import { matchRoutes } from "react-router-dom";
import { AnyEvent } from "@atrilabs/forest";

export function getProjectInfo() {
  const pkgJSON = JSON.parse(fs.readFileSync("package.json").toString());
  if (
    pkgJSON["atriConfig"] === undefined ||
    pkgJSON["atriConfig"]["id"] === undefined
  ) {
    throw Error("project id not found in package.json");
  }
  return { id: pkgJSON["atriConfig"]["id"] };
}

export function getAppInfo() {
  const hostname = process.env["APP_HOSTNAME"];
  if (hostname === undefined) {
    throw Error("APP_HOSTNAME environment variable is required.");
  }
  return { hostname };
}

export async function getPagesInfo() {
  const pagesDir = path.resolve("pages");
  const filePaths = await readDirStructure(pagesDir);
  const ir = dirStructureToIR(filePaths);
  const routeObjectPaths = pathsIRToRouteObjectPaths(ir);
  return routeObjectPaths.map((routeObjectPath, index) => {
    return { routeObjectPath, unixFilepath: filePaths[index] };
  });
}

export function resolvePages(pathWithLeadingSlash: string) {
  const withoutSlash = pathWithLeadingSlash.replace(/^(\/)/, "");
  return path.resolve("pages", withoutSlash);
}

function getEventsJSONFilename(unixFilepath: string) {
  return unixFilepath.replace(/((\.js)|(\.ts))x?/, ".events.json");
}

function matchUrlPath(routeObjects: { path: string }[], originalUrl: string) {
  return matchRoutes(routeObjects, originalUrl);
}

export async function getMatchedPageInfo(urlPath: string) {
  const pagesInfo = await getPagesInfo();
  const routeObjects = pagesInfo.map(({ routeObjectPath }) => {
    return { path: routeObjectPath };
  });
  const matched = matchUrlPath(routeObjects, urlPath);
  if (matched && matched[0]) {
    const foundIndex = routeObjects.findIndex(
      (curr) => curr === matched[0].route
    );
    return pagesInfo[foundIndex];
  }
}

export function loadEventsForPage(unixFilepath: string) {
  const filename = getEventsJSONFilename(unixFilepath);
  if (fs.existsSync(filename)) {
    return fs.readFileSync(filename);
  }
  return Buffer.from(JSON.stringify([]));
}

export function saveEventsForPage(unixFilepath: string, events: AnyEvent[]) {
  const filename = getEventsJSONFilename(unixFilepath);
  if (fs.existsSync(filename)) {
    const parsed = JSON.parse(fs.readFileSync(filename).toString());
    parsed.push(...events);
    fs.writeFileSync(filename, JSON.stringify(parsed, null, 2));
  } else {
    fs.writeFileSync(filename, JSON.stringify(events, null, 2));
  }
}
