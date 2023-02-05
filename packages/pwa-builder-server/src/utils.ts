import fs from "fs";
import path from "path";
import {
  readDirStructure,
  dirStructureToIR,
  pathsIRToRouteObjectPaths,
} from "@atrilabs/atri-app-core";

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
