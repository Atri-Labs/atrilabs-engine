import fs from "fs";
import path from "path";

/**
 * This function adds file:// before adding it as a script src in a template html.
 * @param bundlePath location of the file in the file system
 */
export function readIndexHtml(bundlePath: string) {
  const indexHtmlContent = fs
    .readFileSync(path.resolve(__dirname, "..", "public", "index.html"))
    .toString();
  return indexHtmlContent.replace("%BUNDLE_URL%", `file://${bundlePath}`);
}

export function importReactDependencies() {
  // We clear require cache and re-import react dependencies
  // because we don't want to keep global changes in React namespace
  // in different calls.
  delete require.cache["react"];
  delete require.cache["react/jsx-runtime"];
  return Promise.all([import("react"), import("react/jsx-runtime")]);
}
