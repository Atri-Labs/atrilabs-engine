import { processRoute } from "./processRoute";

export function findAssetDeps(
  route: string,
  assetDepGraph: { [route: string]: string[] }
) {
  return assetDepGraph[processRoute(route).assetDepKey];
}
