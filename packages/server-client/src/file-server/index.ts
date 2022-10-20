import { ToolConfig } from "@atrilabs/core";
import path from "path";
import fs from "fs";
import { exit } from "process";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

export type FileServerOptions = {
  dir: string;
  port?: number;
};

export default function (toolConfig: ToolConfig, options: FileServerOptions) {
  // pre flight checks
  if (!options || !options.dir) {
    console.log("Required option dir is missing");
    exit();
  }
  if (!path.isAbsolute(options.dir)) {
    console.log("The provided option dir must be an absolute path");
    exit();
  }
  if (!fs.existsSync(options.dir)) {
    console.log(`[file-server] Directory Not Found: ${options.dir}`);
    exit();
  }

  app.get("/api/project-info", (_req, res) => {
    res.send({ projectId: process.env["ATRI_PROJECT_ID"] });
  });

  // serve static assets
  const assetUrlPrefix = toolConfig.assetManager.urlPath;
  const assetsDir = toolConfig.assetManager.assetsDir;
  app.use(assetUrlPrefix, express.static(assetsDir));

  app.use(express.static(options.dir));

  const port = (options && options.port) || 4002;
  server.listen(port, "0.0.0.0", () => {
    console.log(`[file-server] listening on http://0.0.0.0:${port}`);
  });
}
