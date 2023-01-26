import { Entry } from "webpack";
import { interpreter } from "./init";

export async function createNodeEntry() {
  // TODO: add pages when they are requested
  const requestedRouteObjectPaths = Array.from(
    interpreter.machine.context.requestedRouteObjectPaths
  );
  const entry: Entry = {
    _error: { import: "./pages/_error" },
    _app: { import: "./pages/_app" },
  };
  requestedRouteObjectPaths.forEach((requestedRouteObjectPath) => {
    let entryName = requestedRouteObjectPath.replace(/^\//, "");
    if (requestedRouteObjectPath === "/") {
      entryName = "index";
    }
    entry[entryName] = {
      import: `./pages/${requestedRouteObjectPath}`,
    };
  });
  return entry;
}
