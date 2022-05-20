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
} from "@atrilabs/scripts";
import {
  ClientToServerEvents,
  InterServerEvents,
  ManifestPkgBundle,
  ServerToClientEvents,
  SocketData,
} from "./types";

function getFiles(dir: string): string[] {
  const files: string[] = [];
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      files.push(...getFiles(path.resolve(dir, dirent.name)));
    } else {
      files.push(path.resolve(dir, dirent.name));
    }
  });
  return files;
}

function copyFileSync(src: string, destDir: string) {
  const filename = path.basename(src);
  const destPath = path.resolve(destDir, filename);
  fs.writeFileSync(destPath, fs.readFileSync(src));
}

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
        const entryPoint = path.resolve(cacheSrcDir, "index.ts");
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
        // get build info for the manifest package
        const buildInfo = await extractManifestPkgBuildInfo(manifestPkgInfo);
        // copy shim to cache directory
        if (buildInfo["buildType"] === "react") {
          const shimPath = path.dirname(
            require.resolve("@atrilabs/manifest-shims/package.json")
          );
          const reactShimDir = path.resolve(shimPath, "src", "react");
          const files = getFiles(reactShimDir);
          files.forEach((file) => {
            copyFileSync(file, cacheSrcDir);
          });
        }
        // compile typescript if manifest pkg contains tsconfig.json file
        await compileTypescriptManifestPkg(cacheSrcDir, firstBuild);
        // TODO: if no tsconfig.js file, then do a babel build
        // use the built assets from previous step, to create a webpack build
        await bundleManifestPkg(
          entryPoint,
          { path: finalBuild, filename: "bundle.js" },
          scriptName
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
