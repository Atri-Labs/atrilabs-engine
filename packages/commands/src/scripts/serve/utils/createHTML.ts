export function createHTML(
  reactString: string,
  assetDeps: string[],
  assetDepGraph: { [entryName: string]: string[] }
) {
  const nodes = Array.from(new Set(assetDeps))
    .map((asset) => {
      if (asset.endsWith(".js")) {
        return `<script defer src="/${asset}"></script>`;
      }
      if (asset.endsWith(".css")) {
        return `<link ref="stylesheet" href="/${asset}">`;
      }
      return "";
    })
    .join("\n");

  const assetDepGraphNode = `<script id="atri-asset-dep-graph" type="application/json">${JSON.stringify(
    assetDepGraph
  )}</script>`;

  return reactString.replace(
    "</head>",
    `${nodes}\n${assetDepGraphNode}</head>`
  );
}
