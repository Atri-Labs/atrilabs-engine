import fs from "fs";
import path from "path";
import { Server } from "socket.io";
import { ToolConfig } from "@atrilabs/core";
import {
  getManifestPkgInfo,
  getManifestPkgCacheDir,
  extractManifestPkgBuildInfo,
  compileTypescriptManifestPkg,
  bundleManifestPkg,
  copyManifestEntryTemplate,
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

export default function (
  toolConfig: ToolConfig,
  options: ManifestServerOptions
) {
  const manifestDirs = toolConfig.manifestDirs;
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >({ cors: { origin: "*" } });

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
        const cacheDir = getManifestPkgCacheDir(manifestPkgInfo);
        const cacheSrcDir = path.resolve(cacheDir, "src");
        const firstBuild = path.resolve(cacheDir, "first-build");
        const finalBuild = path.resolve(cacheDir, "final-build");
        const entryPoint = path.resolve(cacheSrcDir, "index.js");
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
        await compileTypescriptManifestPkg(buildInfo.dir, firstBuild);
        // TODO: if no tsconfig.js file, then do a babel build
        // use the built assets from previous step, to create a webpack build
        await bundleManifestPkg(
          entryPoint,
          { path: finalBuild, filename: "bundle.js" },
          scriptName,
          `http://localhost:${port}/assets/${encodeURI(pkg)}`
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
  io.listen(port);
}
