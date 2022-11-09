import {
  buildPages,
  copyAssets,
  copyPublicDirectory,
} from "../shared/generatePage";
import fs from "fs";
import path from "path";
import type { ServerInfo } from "@atrilabs/core";
import {
  ssgOutputPath,
  buildAppWithDefaults,
  buildServerWithDefaults,
} from "../shared/utils";

// @ts-ignore
global.window = undefined;

const appServerInfo: ServerInfo = JSON.parse(
  fs.readFileSync("atri-server-info.json").toString()
);

const promises = Promise.all([
  buildAppWithDefaults(),
  buildServerWithDefaults(),
]);

promises
  .then(() => {
    const outputDir = ssgOutputPath;

    // copy app/static directory
    copyPublicDirectory(appServerInfo, outputDir);

    buildPages(appServerInfo, {
      paths: {
        appDistHtml: path.join(appServerInfo.publicDir, "index.html"),
        getAppText: path.join(
          "dist",
          "app-node",
          "static",
          "js",
          "app.bundle.js"
        ),
      },
      outputDir,
    });

    copyAssets(appServerInfo, outputDir);
  })
  .catch((err) => {
    console.log("Error\n", err);
  });
