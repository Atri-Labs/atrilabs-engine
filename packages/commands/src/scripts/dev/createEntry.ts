import { Entry } from "webpack";
import { interpreter } from "./init";
const { stringify } = require("querystring");

export async function createEntry() {
  // TODO: add pages when they are requested
  const requestedRouteObjectPaths = Array.from(
    interpreter.machine.context.requestedRouteObjectPaths
  );
  const entry: Entry = {
    app: { import: ["react", "react-dom"] },
    _error: {
      import: `atri-pages-client-loader?${stringify({
        routeObjectPath: "/",
        modulePath: "./pages/_error",
      })}!`,
      dependOn: "app",
    },
  };
  requestedRouteObjectPaths.forEach((requestedRouteObjectPath) => {
    let entryName = requestedRouteObjectPath;
    if (requestedRouteObjectPath === "/") {
      entryName = "index";
    }
    entry[entryName] = {
      import: `atri-pages-client-loader?${stringify({
        routeObjectPath: `${requestedRouteObjectPath}`,
        modulePath: `./pages/${requestedRouteObjectPath}`,
      })}!`,
      dependOn: "app",
    };
  });
  return entry;
}
