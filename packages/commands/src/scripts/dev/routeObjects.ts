import {
  dirStructureToIR,
  pathsIRToRouteObjectPaths,
  readDirStructure,
} from "@atrilabs/atri-app-core/src/utils";
import { PAGE_DIR } from "../../consts";
import { FS_CHANGED, ROUTE_OBJECTS_UPDATED } from "./serverMachine";
import { interpreter, pagesWatcher } from "./init";

export async function computeRouteObjects() {
  interpreter.send({
    type: FS_CHANGED,
  });
  const filePaths = await readDirStructure(PAGE_DIR);
  const ir = dirStructureToIR(filePaths);
  const routeObjectPaths = pathsIRToRouteObjectPaths(ir);
  interpreter.send({
    type: ROUTE_OBJECTS_UPDATED,
    routeObjectPaths: routeObjectPaths,
  });
}

export function setFSWatchers() {
  pagesWatcher.on("add", computeRouteObjects);
  pagesWatcher.on("remove", computeRouteObjects);
}
