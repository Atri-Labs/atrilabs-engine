import {
  dirStructureToIR,
  pathsIRToRouteObjectPaths,
  readDirStructure,
} from "@atrilabs/atri-app-core";
import path from "path";

export async function getAllPages() {
  const pagePaths = await readDirStructure(path.resolve("pages"));
  const irs = dirStructureToIR(pagePaths);
  const routeObjectPaths = pathsIRToRouteObjectPaths(irs);
  return pagePaths.map((pagePath, index) => {
    return { pagePath, routeObjectPath: routeObjectPaths[index] };
  });
}
