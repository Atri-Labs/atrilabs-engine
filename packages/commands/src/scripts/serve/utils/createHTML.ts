import path from "path";
import recursive from "recursive-readdir";

function readStaticCSSDirectory() {
  const staticCSSDir = path.resolve(
    "dist",
    "app-build",
    "client",
    "static",
    "css"
  );
  return recursive(staticCSSDir).then((files) => {
    return files.map((file) => {
      return path.relative(staticCSSDir, file);
    });
  });
}

/**
 *
 * @param entryName
 * @param files relative file names inside static/css
 * @returns
 */
function findCSSFileForPage(entryName: string, files: string[]) {
  return Array.from(
    new Set(
      files.filter((file) => {
        return file.startsWith(entryName);
      })
    )
  );
}

export async function createHTML(
  reactString: string,
  assetDeps: string[],
  assetDepGraph: { [entryName: string]: string[] },
  assetDepKey: string
) {
  const staticCSSFiles = await readStaticCSSDirectory();
  const cssFilesForPage = findCSSFileForPage(assetDepKey, staticCSSFiles);
  const staticCSSNodes = cssFilesForPage
    .map((cssFileForPage) => {
      return `<link rel="stylesheet" href="/static/css/${cssFileForPage}">`;
    })
    .join("\n");

  const nodes = Array.from(new Set(assetDeps))
    .map((asset) => {
      if (asset.endsWith(".js")) {
        return `<script defer src="/${asset}"></script>`;
      }
      if (
        asset.endsWith(".css") &&
        cssFilesForPage.findIndex((cssFileForPage) => {
          return `static/css/${cssFileForPage}` === asset;
        }) < 0
      ) {
        return `<link rel="stylesheet" href="/${asset}">`;
      }
      return "";
    })
    .join("\n");

  const assetDepGraphNode = `<script id="atri-asset-dep-graph" type="application/json">${JSON.stringify(
    assetDepGraph
  )}</script>`;

  return reactString.replace(
    "</head>",
    `${staticCSSNodes}\n${nodes}\n${assetDepGraphNode}</head>`
  );
}
