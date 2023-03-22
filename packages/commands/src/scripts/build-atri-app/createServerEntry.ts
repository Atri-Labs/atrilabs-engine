import { Entry } from "webpack";
import { PageInfo } from "./types";
import { createCssText, createStoreFromComponents } from "./utils";
const { stringify } = require("querystring");

export async function createServerEntry(options: { pageInfos: PageInfo[] }) {
  const entry: Entry = {
    _error: { import: "./pages/_error" },
  };
  const { pageInfos } = options;
  const routes = pageInfos.map(({ routeObjectPath }) => {
    return { path: routeObjectPath };
  });
  for (let i = 0; i < pageInfos.length; i++) {
    const { pagePath, routeObjectPath, components } = pageInfos[i]!;
    const entryName = pagePath.replace(/^\//, "");
    const srcs: string[] = [];
    entry[entryName] = {
      import: `atri-pages-server-loader?${stringify({
        pagePath,
        srcs: JSON.stringify(srcs || []),
        reactRouteObjectPath: routeObjectPath,
        routes: JSON.stringify(routes || []),
        styles: await createCssText(components),
        entryRouteStores: JSON.stringify(
          createStoreFromComponents(components) || {}
        ),
      })}!`,
    };
  }
  return entry;
}
