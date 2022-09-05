import {
  buildPages,
  copyAssets,
  copyPublicDirectory,
} from "../shared/generatePage";
import fs from "fs";
import path from "path";
import { ServerInfo } from "../shared/types";

const appServerInfo: ServerInfo = JSON.parse(
  fs.readFileSync("atri-server-info.json").toString()
);

const outputDir = ssgOuputPath;

import "./build-app";

import "./build-server";
import { ssgOuputPath } from "../shared/utils";

// copy app/static directory
copyPublicDirectory(appServerInfo, outputDir);

buildPages(appServerInfo, {
  paths: {
    appDistHtml: path.join(appServerInfo.publicDir, "index.html"),
    getAppText: path.join("dist", "app-node", "static", "js", "app.bundle.js"),
  },
  outputDir,
});

copyAssets(appServerInfo, outputDir);
