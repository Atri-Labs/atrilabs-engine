import { Entry } from "webpack";
import { interpreter } from "./init";
const { stringify } = require("querystring");
import { IRToUnixFilePath, routeObjectPathToIR } from "@atrilabs/atri-app-core";

export async function createEntry() {
  const requestedRouteObjectPaths = Array.from(
    interpreter.machine.context.requestedRouteObjectPaths
  );
  const entry: Entry = {
    _error: {
      import: `atri-pages-client-loader?${stringify({
        routeObjectPath: "/",
        modulePath: "./pages/_error",
      })}!`,
    },
  };
  requestedRouteObjectPaths.forEach((requestedRouteObjectPath) => {
    const ir = routeObjectPathToIR(requestedRouteObjectPath);
    const filepath = IRToUnixFilePath(ir);
    const entryName = filepath.replace(/^\//, "");
    entry[entryName] = {
      import: `atri-pages-client-loader?${stringify({
        routeObjectPath: `${requestedRouteObjectPath}`,
        modulePath: `./pages${filepath}`,
      })}!`,
    };
  });
  return entry;
}
