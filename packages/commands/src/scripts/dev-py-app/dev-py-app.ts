#!/usr/bin/env node

import { dirStructureToIR } from "@atrilabs/atri-app-core";
import { watch } from "chokidar";
import {
  generatePythonModelForAPage,
  generatePythonPageModels,
} from "../../commons/generatePythonPageModels";
import { PAGE_DIR } from "../../consts";
import { generatePythonRoutes } from "./generatePythonRoutes";
import path from "path";

/**
 * 1. Generate .model.py files on startup.
 *
 * 2. Generate ${page}.py files on startup.
 *
 * 3. Watch the pages directory for new pages (and maybe new .events.json file?).
 *
 * 4. Watch the pages directory for changes in .events.json.
 */

async function main() {
  await generatePythonPageModels();
  await generatePythonRoutes();
  const watcher = watch(PAGE_DIR, { ignoreInitial: true, alwaysStat: true });
  watcher.on("add", async (_filepath, stats) => {
    if (stats?.isDirectory() === false) {
      await generatePythonPageModels();
      await generatePythonRoutes();
    }
  });
  watcher.on("change", (filepath, stats) => {
    if (stats?.isDirectory() === false && filepath.endsWith(".events.json")) {
      // WARN: adding .jsx without confirming that the actual
      // extension is .jsx.
      const unixfilepath = `/${path
        .relative(PAGE_DIR, filepath)
        .replace(/(\.events\.json)$/, "")}.jsx`;
      const ir = dirStructureToIR([unixfilepath])[0]!;
      generatePythonModelForAPage(ir);
    }
  });

  ["SIGINT", "SIGTERM"].forEach(function (sig) {
    process.on(sig, function () {
      watcher.close();
      process.exit();
    });
  });

  if (process.env["CI"] !== "true") {
    // Gracefully exit when stdin ends
    process.stdin.on("end", function () {
      watcher.close();
      process.exit();
    });
  }
}

main().catch(console.log);
