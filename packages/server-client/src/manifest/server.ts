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
  extractManifestPkgBuildInfo,
  compileTypescriptManifestPkg,
  bundleManifestPkg,
  copyManifestEntryTemplate,
  ManifestPkgInfo,
} from "@atrilabs/scripts";
import {
  ClientToServerEvents,
  InterServerEvents,
  ManifestPkgBundle,
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
  app.use((req, _res, next) => {
    console.log("req rec", req.originalUrl);
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
      const manifestPkgBundles: ManifestPkgBundle[] = [];
      const scriptName = "manifestscript";
      // TODO: build script
      for (let i = 0; i < manifestDirs.length; i++) {
        const dir = manifestDirs[i]!;
        const pkg = dir.pkg;
        const manifestPkgInfo = getManifestPkgInfo(pkg);
        // create cache directory if not already created
        const {
          cacheDir,
          cacheSrcDir,
          firstBuild,
          finalBuild,
          entryPoint,
          manifestJsPath,
          shimsPath,
        } = getAllPaths(manifestPkgInfo);
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
        console.log(`cacheDir created - ${cacheDir}`);
        // get build info for the manifest package
        const buildInfo = await extractManifestPkgBuildInfo(manifestPkgInfo);
        console.log(
          `manifest package build info - ${JSON.stringify(buildInfo, null, 2)}`
        );
        copyManifestEntryTemplate("react", cacheSrcDir);
        console.log(`shim files copied`);
        // compile typescript if manifest pkg contains tsconfig.json file
        const compiledFiles = await compileTypescriptManifestPkg(
          buildInfo.dir,
          firstBuild
        );
        console.log(
          "compiled ts files",
          JSON.stringify(compiledFiles, null, 2)
        );
        // TODO: if no tsconfig.js file, then do a babel build
        // use the built assets from previous step, to create a webpack build
        await bundleManifestPkg(
          entryPoint,
          { path: finalBuild, filename: "bundle.js" },
          scriptName,
          `http://localhost:${port}/assets?pkg=${encodeURI(pkg)}&file=`,
          manifestJsPath,
          compiledFiles,
          shimsPath,
          // ignore putting import {Shims} from "path/to/shims.js"
          // in all files from cache src dir
          cacheSrcDir
        );
        manifestPkgBundles.push({
          src: fs
            .readFileSync(path.resolve(finalBuild, "bundle.js"))
            .toString(),
          scriptName,
          pkg: pkg,
        });
      }
      cb(manifestPkgBundles);
    });
  });

  const port = (options && options.port) || 4003;
  server.listen(port, () => {
    console.log(`[manifest_server] address ${server.address()}`);
  });
}
