import { Entry } from "webpack";
import { interpreter } from "./init";
import { IRToUnixFilePath, routeObjectPathToIR } from "@atrilabs/atri-app-core";

export async function createNodeEntry() {
  const requestedRouteObjectPaths = Array.from(
    interpreter.machine.context.requestedRouteObjectPaths
  );
  const entry: Entry = {
    _error: { import: "./pages/_error" },
    _app: { import: "./pages/_app" },
  };
  requestedRouteObjectPaths.forEach((requestedRouteObjectPath) => {
    const ir = routeObjectPathToIR(requestedRouteObjectPath);
    const filepath = IRToUnixFilePath(ir);
    const entryName = filepath.replace(/^\//, "");
    entry[entryName] = {
      import: `./pages${filepath}`,
    };
  });
  return entry;
}
