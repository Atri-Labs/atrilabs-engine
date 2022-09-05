import { buildPages, copyPublicDirectory } from "../shared/generatePage";
import fs from "fs";
import path from "path";
import { ServerInfo } from "../shared/types";

const appServerInfo: ServerInfo = JSON.parse(
  fs.readFileSync("atri-server-info.json").toString()
);

const outputDir = path.join("dist", "ssg");

import "./build-app";

import "./build-server";

// copy app/static directory
copyPublicDirectory(appServerInfo, outputDir);

buildPages(appServerInfo, {
  paths: {
    appDistHtml: path.join(appServerInfo.publicDir, "index.html"),
    getAppText: path.join("dist", "app-node", "static", "js", "app.bundle.js"),
  },
  outputDir,
});
