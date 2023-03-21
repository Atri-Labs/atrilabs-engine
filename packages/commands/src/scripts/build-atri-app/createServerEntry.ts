import { Entry } from "webpack";
import { getAllPages } from "./utils";
const { stringify } = require("querystring");

export async function createServerEntry() {
  const entry: Entry = {
    _error: { import: "./pages/_error" },
  };
  const pagePaths = await getAllPages();
  pagePaths.forEach((filepath) => {
    const entryName = filepath.replace(/^\//, "");
    const srcs: string[] = [];
    entry[entryName] = {
      import: `atri-pages-server-loader?${stringify({
        filepath,
        srcs,
        // TODO: add other options
      })}!`,
    };
  });
  return entry;
}
