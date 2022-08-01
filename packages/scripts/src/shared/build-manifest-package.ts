import { ToolConfig } from "@atrilabs/core";
import path from "path";
import fs from "fs";
import { ManifestPkgBundle, Cache } from "@atrilabs/core";
import {
  bundleManifestPkg,
  compileTypescriptManifestPkg,
  copyManifestEntryTemplate,
  extractManifestPkgBuildInfo,
  getFiles,
  getManifestPkgCacheDir,
  getManifestPkgInfo,
  getToolPkgInfo,
  installManifestPkgDependencies,
} from "./utils";
import { ManifestPkgInfo } from "./types";

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
  pkg: string,
  freeze: boolean
) {
  // create cache file if not already exist - default value {}
  if (!fs.existsSync(buildCacheFile)) {
    fs.writeFileSync(buildCacheFile, "{}");
  }
  // read cache file as Cache
  const cache: Cache = JSON.parse(fs.readFileSync(buildCacheFile).toString());
  // re/write timestamp for all files in the manifest directory of pkg
  const files = getFiles(manifestDir);
  cache[pkg] = {
    files: {},
    freeze: freeze,
  };
  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    const stat = await fs.promises.stat(file);
    const timestamp = stat.mtime;
    cache[pkg]!.files[path.relative(manifestDir, file)] = { timestamp };
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
      if (cache[arg.pkg]?.freeze) {
        return true;
      }
      const currentFiles = getFiles(arg.manifestDir)
        .map((filename) => path.relative(arg.manifestDir, filename))
        .sort();
      const cachedFiles = Object.keys(cache[arg.pkg]!.files).sort();
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
            new Date(cache[arg.pkg]!.files[cacheFile]!.timestamp).getTime()
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

// Inside docker container, compiled typescript files does not get created on disk
// hence, we will do check thrice in certain intervals to validate all files got created
async function validateTSOutput(compiledFiles: string[]) {
  return new Promise<void>((res, rej) => {
    let retryCount = 0;
    const validateFn = () => {
      for (let i = 0; i < compiledFiles.length; i++) {
        const file = compiledFiles[i]!;
        if (!fs.existsSync(file)) {
          retryCount++;
          if (retryCount <= 3) {
            setTimeout(validateFn, 1000);
            return;
          } else {
            rej();
          }
        }
      }
      // will reach this line of code only after successful checks
      res();
    };
    validateFn();
  });
}

export async function buildManifestPackage(
  manifestDirs: ToolConfig["manifestDirs"],
  pkgManager: ToolConfig["pkgManager"],
  port: number,
  scriptName: string,
  freeze: boolean
) {
  const manifestPkgBundles: ManifestPkgBundle[] = [];
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
    // NOTE: freeze flag has to be changed manually in the cache.json file in a hit case
    if (hit) {
      manifestPkgBundles.push({
        src: fs.readFileSync(path.resolve(finalBuild, "bundle.js")).toString(),
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
    const relativeCompiledFiles = compiledFiles.map((file) => {
      return path
        .relative(getToolPkgInfo()["nodeModule"], file)
        .replace(/\\/g, "/");
    });

    try {
      await validateTSOutput(compiledFiles);
    } catch {
      // TODO: exit properly
      throw Error(
        `Some typscript compiled output files are missing after 600ms.`
      );
    }

    await installManifestPkgDependencies(manifestPkgInfo, pkgManager);
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
      relativeCompiledFiles,
      path
        .relative(getToolPkgInfo()["nodeModule"], shimsPath)
        .replace(/\\/g, "/"),
      // ignore putting import {Shims} from "path/to/shims.js"
      // in all files from cache src dir
      cacheSrcDir
    );
    manifestPkgBundles.push({
      src: fs.readFileSync(path.resolve(finalBuild, "bundle.js")).toString(),
      scriptName,
      pkg: pkg,
    });
    // update cache
    updateBuildCache(buildCacheFile, buildInfo.dir, pkg, freeze);
  }
  return manifestPkgBundles;
}
