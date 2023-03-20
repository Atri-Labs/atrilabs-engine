#!/usr/bin/env node
import { runIPC } from "@atrilabs/node-python-ipc";
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
 * 6. Generate two JS files for each page - index.client.js & index.server.js.
 *
 * 7. Generate py-classes from manifests.
 *
 * 8. Generate py-models from nodes.
 *
 */
console.log("build-atri-app ran");
