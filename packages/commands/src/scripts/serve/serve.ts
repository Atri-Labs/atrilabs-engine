#!/usr/bin/env node
import { extractParams } from "@atrilabs/commands-builder";
import express from "express";
import { runChecks } from "./runChecks";
import { handleGetHtml } from "./routes/handleGetHtml";
import { exposeStaticDirectories } from "./routes/exposeStaticDirectories";
import { readClientDirectory } from "./utils/readClientDirectory";

async function main() {
  runChecks();

  const params = extractParams();
  const port = params.port;
  const host = params.host;
  const clientDirectoryFiles = await readClientDirectory();

  const app = express();

  handleGetHtml(app);
  exposeStaticDirectories(app, clientDirectoryFiles);

  app.listen(port, host, () => {
    console.log(`Server is listening on ${host}:${port}`);
  });
}

main();
