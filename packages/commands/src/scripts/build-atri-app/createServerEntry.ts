import { Entry } from "webpack";
import { getAllPages } from "./utils";
const { stringify } = require("querystring");

export async function createServerEntry() {
  const entry: Entry = {
    _error: { import: "./pages/_error" },
  };
  const pageInfo = await getAllPages();
  pageInfo.forEach(({ pagePath, routeObjectPath }) => {
    const entryName = pagePath.replace(/^\//, "");
    const srcs: string[] = [];
    entry[entryName] = {
      import: `atri-pages-server-loader?${stringify({
        pagePath,
        srcs,
        reactRouteObjectPath: routeObjectPath,
        routes: pageInfo.map(({ routeObjectPath }) => {
          return { path: routeObjectPath };
        }),
        // TODO: add actual style & route stores
        styles: "",
        entryRouteStores: {},
      })}!`,
    };
  });
  return entry;
}
