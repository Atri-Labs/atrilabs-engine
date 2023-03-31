export function createHTML(reactString: string, assetDeps: string[]) {
  const nodes = Array.from(new Set(assetDeps))
    .map((asset) => {
      if (asset.endsWith(".js")) {
        return `<script defer src="${asset}"></script>`;
      }
      if (asset.endsWith(".css")) {
        return `<link ref="stylesheet" href="${asset}">`;
      }
      return "";
    })
    .join("\n");

  return reactString.replace("</head>", `${nodes}</head>`);
}
