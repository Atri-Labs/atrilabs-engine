import { Router } from "express";
import { findAssetDeps } from "../utils/findAssetDeps";
import fs from "fs";
import path from "path";
import { createHTML } from "../utils/createHTML";
import { renderReactString } from "../utils/renderReactString";
import { processRoute } from "../utils/processRoute";

const assetDepGraph = JSON.parse(
  fs
    .readFileSync(
      path.resolve("dist", "app-build", "client", "asset-dep-graph.json")
    )
    .toString()
);

export function handleGetHtml(router: Router) {
  router.use(async (req, res, next) => {
    try {
      if (req.method === "GET") {
        const pageRoute = req.originalUrl;
        const assetDeps = findAssetDeps(pageRoute, assetDepGraph);
        if (assetDeps) {
          const reactString = renderReactString(pageRoute);
          const assetDepKey = processRoute(pageRoute).assetDepKey;
          const html = await createHTML(
            reactString,
            assetDeps,
            assetDepGraph,
            assetDepKey
          );
          res.header("Content-Type", "text/html");
          res.send(html);
          return;
        }
      }
    } catch (err) {
      console.log(`Error while responding to GET page request`, err);
    }
    next();
  });
}
