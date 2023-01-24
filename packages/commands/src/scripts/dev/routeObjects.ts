import {
  dirStructureToIR,
  pathsIRToRouteObjectPaths,
  readDirStructure,
} from "@atrilabs/atri-app-core";
import { PAGE_DIR } from "../../consts";
import { ROUTE_OBJECTS_UPDATED } from "./serverMachine";
import { interpreter, pagesWatcher } from "./init";

async function computeRouteObjects() {
  const filePaths = await readDirStructure(PAGE_DIR);
  const ir = dirStructureToIR(filePaths);
  const routeObjectPaths = pathsIRToRouteObjectPaths(ir);
  interpreter.send({
    type: ROUTE_OBJECTS_UPDATED,
    routeObjectPaths: routeObjectPaths,
  });
}

pagesWatcher.on("add", computeRouteObjects);
pagesWatcher.on("remove", computeRouteObjects);
