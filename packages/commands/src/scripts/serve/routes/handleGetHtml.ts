import { Router } from "express";
import { findAssetDeps } from "../utils/findAssetDeps";
import fs from "fs";
import path from "path";
import { createHTML } from "../utils/createHTML";
import { renderReactString } from "../utils/renderReactString";

const assetDepGraph = JSON.parse(
  fs
    .readFileSync(
      path.resolve("dist", "app-build", "client", "asset-dep-graph.json")
    )
    .toString()
);

export function handleGetHtml(router: Router) {
  router.use((req, res, next) => {
    if (req.method === "GET") {
      const pageRoute = req.originalUrl;
      const assetDeps = findAssetDeps(pageRoute, assetDepGraph);
      if (assetDeps) {
        const reactString = renderReactString(pageRoute);
        const html = createHTML(reactString, assetDeps);
        res.header("Content-Type", "text/html");
        res.send(html);
        return;
      }
    }
    next();
  });
}
