#!/usr/bin/env node
import { extractParams } from "@atrilabs/commands-builder";
import path from "path";
import { buildClientSide } from "./buildClientSide";
import { buildServerSide } from "./buildServerSide";
import {
  getAssetDependencyGraph,
  getComponentManifests,
  getPagesInfo,
} from "./utils";
import fs from "fs";

/**
 *
 * 1. [O] Create a temporary folder for the build inside dist/.
 *
 * 2. [O] From events.json file to create nodes.
 *
 * 3. [X] Convert component nodes into custom.json, callbacks.json, styles.css for each page.
 *
 * 4. [X] Import all the 4 files in the page.
 *
 * 5. Write some code for rendering from custom.json & callbacks.json.
 * The code should be similar to live preview code.
 *
 * 6. Generate two JS files for each page - client/index.js & server/index.js.
 *
 * 7. Generate py-classes from manifests.
 *
 * 8. Generate py-models from nodes.
 *
 */

async function main() {
  const params = extractParams();
  params.isEnvProduction = true;
  params.isEnvDevelopment = false;
  params.isEnvProductionProfile = false;
  params.isEnvTest = false;
  const outputDir = path.resolve("dist", "app-build");
  params.paths.outputDir = outputDir;
  const componentManifests = getComponentManifests(params.manifestDirs);
  const pagesInfo = await getPagesInfo({ componentManifests });
  await buildServerSide({
    ...JSON.parse(JSON.stringify(params)),
    pagesInfo,
    componentManifests,
    shouldUseSourceMap: true,
  });
  const chunks = await buildClientSide({
    ...JSON.parse(JSON.stringify(params)),
    pagesInfo,
    componentManifests,
    shouldUseSourceMap: true,
  });
  const assetDependencyGraph = getAssetDependencyGraph(pagesInfo, chunks);
  fs.writeFileSync(
    path.resolve(`${params.paths.outputDir}`, "client", "asset-dep-graph.json"),
    JSON.stringify(assetDependencyGraph, null, 2)
  );
}

main().catch(console.log);
