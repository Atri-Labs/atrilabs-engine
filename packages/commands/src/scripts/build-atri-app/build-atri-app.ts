#!/usr/bin/env node
import { extractParams } from "@atrilabs/commands-builder";
import path from "path";
import { buildServerSide } from "./buildServerSide";

/**
 *
 * 1. Create a temporary folder for the build inside dist/.
 *
 * 2. From events.json file to create nodes.
 *
 * 3. Convert component nodes into custom.json, callbacks.json, styles.css for each page.
 *
 * 4. Import all the 4 files in the page.
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
  await buildServerSide(JSON.parse(JSON.stringify(params)));
}

main().catch(console.log);
