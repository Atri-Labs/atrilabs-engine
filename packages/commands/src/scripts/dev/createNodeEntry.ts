import { Entry } from "webpack";
import { interpreter } from "./init";
import { IRToUnixFilePath, routeObjectPathToIR } from "@atrilabs/atri-app-core";
const { stringify } = require("querystring");

export async function createNodeEntry() {
  const requestedRouteObjectPaths = Array.from(
    interpreter.machine.context.requestedRouteObjectPaths
  );
  const entry: Entry = {
    _error: { import: "./pages/_error" },
  };
  requestedRouteObjectPaths.forEach((requestedRouteObjectPath) => {
    const ir = routeObjectPathToIR(requestedRouteObjectPath);
    const filepath = IRToUnixFilePath(ir);
    const entryName = filepath.replace(/^\//, "");
    const scriptSrcs: string[] = [
      `/atri/js/pages/runtime.js`,
      `/atri/js/pages/app.js`,
      `/atri/js/pages${filepath}.js`,
    ];
    entry[entryName] = {
      import: `atri-pages-server-loader?${stringify({
        filepath,
        scriptSrcs,
      })}!`,
    };
  });
  return entry;
}
