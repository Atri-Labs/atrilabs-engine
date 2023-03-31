import path from "path";

export function processRoute(route: string) {
  const removedTrailingSlash =
    route === "/" ? "index" : route.replace(/^(\/)/, "");
  return {
    assetDepKey: removedTrailingSlash,
    jsPath: path.resolve(
      "dist",
      "app-build",
      "server",
      `${removedTrailingSlash}.js`
    ),
  };
}
