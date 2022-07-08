import fs from "fs";
import path from "path";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { ToolConfig } from "@atrilabs/core";
import {
  getManifestPkgInfo,
  getManifestPkgCacheDir,
  ManifestPkgInfo,
  buildManifestPackage,
} from "@atrilabs/scripts";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

export type ManifestServerOptions = {
  port?: number;
};

const app = express();
const server = http.createServer(app);

// set cors for http server
app.use(cors({ origin: "*" }));

function getAllPaths(manifestPkgInfo: ManifestPkgInfo) {
  const cacheDir = getManifestPkgCacheDir(manifestPkgInfo);
  const cacheSrcDir = path.resolve(cacheDir, "src");
  const firstBuild = path.resolve(cacheDir, "first-build");
  const finalBuild = path.resolve(cacheDir, "final-build");
  const entryPoint = path.resolve(cacheSrcDir, "index.js");
  const manifestJsPath = path.resolve(cacheSrcDir, "manifests.js");
  const shimsPath = path.resolve(cacheSrcDir, "shims.js");
  return {
    cacheDir,
    cacheSrcDir,
    firstBuild,
    finalBuild,
    entryPoint,
    manifestJsPath,
    shimsPath,
  };
}

export default function (
  toolConfig: ToolConfig,
  options: ManifestServerOptions
) {
  const port = (options && options.port) || 4003;

  app.use((req, _res, next) => {
    console.log("[manifest-server] request url", req.originalUrl);
    next();
  });
  // setup http request & response (a file server for bundled manifest assets)
  app.get("/assets", (req, res) => {
    const pkg = req.query["pkg"] as string;
    if (!pkg) {
      res.status(400).send("Manifest package name is missing in the url.");
      return;
    }
    const assetURI = req.query["file"] as string;
    if (!assetURI) {
      res.status(400).send("The url does not contain asset URI.");
      return;
    }

    const decodedPkg = decodeURI(pkg);
    const manifestPkgInfo = getManifestPkgInfo(decodedPkg);
    const { finalBuild } = getAllPaths(manifestPkgInfo);
    const assetPath = path.resolve(finalBuild, assetURI);
    if (fs.existsSync(assetPath)) {
      res.sendFile(assetPath);
    } else {
      console.log("Asset Not Found:", assetPath);
      res.status(404).send("Request asset not found.");
    }
  });

  const manifestDirs = toolConfig.manifestDirs;
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, { cors: { origin: "*" } }); // set cors for ws server

  // setup socket request & response
  io.on("connection", (socket) => {
    socket.on("sendManifestScripts", async (cb) => {
      try {
        const scriptName = "manifestscript";
        buildManifestPackage(
          manifestDirs,
          toolConfig.pkgManager,
          port,
          scriptName,
          false
        )
          .then((manifestPkgBundles) => {
            cb(manifestPkgBundles);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(
          `[manifest-server] Following error occured in sendManifestScripts message handler`
        );
        console.log(err);
      }
    });
  });

  server.listen(port, () => {
    const address = server.address();
    if (typeof address === "object" && address !== null) {
      let port = address.port;
      let ip = address.address;
      console.log(`[manifest_server] listening on http://${ip}:${port}`);
    } else if (typeof address === "string") {
      console.log(`[manifest_server] listening on http://${address}`);
    } else {
      console.log(`[manifest_server] cannot listen on ${port}`);
    }
  });
}
