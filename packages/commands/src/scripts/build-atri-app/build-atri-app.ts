#!/usr/bin/env node
import { extractParams } from "@atrilabs/commands-builder";
import path from "path";
import { buildServerSide } from "./buildServerSide";
import { getPagesInfo } from "./utils";

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
  const outputDir = path.resolve("dist", "app-build");
  params.paths.outputDir = outputDir;
  const pagesInfo = await getPagesInfo({ manifestDirs: params.manifestDirs });
  await buildServerSide({ ...JSON.parse(JSON.stringify(params)), pagesInfo });
}

main().catch(console.log);
