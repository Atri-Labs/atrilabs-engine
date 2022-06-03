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
  installManifestPkgDependencies,
  getFiles,
} from "@atrilabs/scripts";
import {
  ClientToServerEvents,
  InterServerEvents,
  ManifestPkgBundle,
  ServerToClientEvents,
  SocketData,
  Cache,
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

async function updateBuildCache(
  buildCacheFile: string,
  manifestDir: string,
  pkg: string
) {
  // create cache file if not already exist - default value {}
  if (!fs.existsSync(buildCacheFile)) {
    fs.writeFileSync(buildCacheFile, "{}");
  }
  // read cache file as Cache
  const cache: Cache = JSON.parse(fs.readFileSync(buildCacheFile).toString());
  // re/write timestamp for all files in the manifest directory of pkg
  const files = getFiles(manifestDir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    const stat = await fs.promises.stat(file);
    const timestamp = stat.mtime;
    if (!cache[pkg]) {
      cache[pkg] = {};
    }
    cache[pkg]![path.relative(manifestDir, file)] = { timestamp };
  }
  // write back to cache file
  fs.writeFileSync(buildCacheFile, JSON.stringify(cache, null, 2));
}

async function checkCache(arg: {
  buildCacheFile: string;
  finalBundleFile: string;
  pkg: string;
  manifestDir: string;
}) {
  if (
    fs.existsSync(arg.buildCacheFile) &&
    // final bundle must exist
    fs.existsSync(arg.finalBundleFile)
  ) {
    const cache: Cache = JSON.parse(
      fs.readFileSync(arg.buildCacheFile).toString()
    );
    // cahce hit is checked for each package
    // if any file in the manifest packge has changed, cache miss will happen
    if (cache[arg.pkg]) {
      const currentFiles = getFiles(arg.manifestDir)
        .map((filename) => path.relative(arg.manifestDir, filename))
        .sort();
      const cachedFiles = Object.keys(cache[arg.pkg]!).sort();
      if (currentFiles.length === cachedFiles.length) {
        let hit = true;
        for (let i = 0; i < currentFiles.length; i++) {
          const currentFile = currentFiles[i]!;
          const cacheFile = cachedFiles[i]!;

          if (currentFile != cacheFile) {
            console.log(`file order mismatch`, currentFile, cacheFile);
            hit = false;
            break;
          }

          const currentStat = await fs.promises.stat(
            path.resolve(arg.manifestDir, cacheFile)
          );
          if (
            currentStat.mtime.getTime() !==
            new Date(cache[arg.pkg]![cacheFile]!.timestamp).getTime()
          ) {
            console.log(`cache miss mtime mistmatch`, cacheFile);
            hit = false;
            break;
          }
        }
        return hit;
      } else {
        console.log("cache miss - number of files mismatch");
      }
    }
  }
  return false;
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
        // get build info for the manifest package
        const buildInfo = await extractManifestPkgBuildInfo(manifestPkgInfo);

        // check cache hit
        const buildCacheFile = path.resolve(cacheDir, "cache.json");
        const hit = await checkCache({
          buildCacheFile,
          finalBundleFile: path.resolve(finalBuild, "bundle.js"),
          pkg,
          manifestDir: buildInfo.dir,
        });
        if (hit) {
          manifestPkgBundles.push({
            src: fs
              .readFileSync(path.resolve(finalBuild, "bundle.js"))
              .toString(),
            scriptName,
            pkg: pkg,
          });
          continue;
        }

        copyManifestEntryTemplate("react", cacheSrcDir);

        // compile typescript if manifest pkg contains tsconfig.json file
        const compiledFiles = await compileTypescriptManifestPkg(
          buildInfo.dir,
          firstBuild
        );

        await installManifestPkgDependencies(
          manifestPkgInfo,
          toolConfig.pkgManager
        );
        // TODO: if no tsconfig.js file, then do a babel build
        // use the built assets from previous step, to create a webpack build
        await bundleManifestPkg(
          "development",
          true,
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
        // update cache
        updateBuildCache(buildCacheFile, buildInfo.dir, pkg);
      }
      cb(manifestPkgBundles);
    });
  });

  const port = (options && options.port) || 4003;
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
