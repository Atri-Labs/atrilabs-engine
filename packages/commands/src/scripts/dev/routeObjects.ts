import {
  dirStructureToIR,
  pathsIRToRouteObjectPaths,
  readDirStructure,
} from "@atrilabs/atri-app-core";
import { PAGE_DIR } from "../../consts";
import { pagesWatcher } from "./pagesWatcher";

let routeObjectPaths: string[] = [];

async function computeRouteObjects() {
  const filePaths = await readDirStructure(PAGE_DIR);
  const ir = dirStructureToIR(filePaths);
  routeObjectPaths = pathsIRToRouteObjectPaths(ir);
}

pagesWatcher.on("add", computeRouteObjects);
pagesWatcher.on("remove", computeRouteObjects);

export function getRouteObjects() {
  return routeObjectPaths.map((routeObjectPath) => {
    return { path: routeObjectPath };
  });
}
