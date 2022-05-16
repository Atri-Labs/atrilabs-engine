import { exec } from "child_process";
import commandExists from "command-exists";
import path from "path";
import fs from "fs";

/**
 * Strategy -
 * Find tsc in node_modules/typescript/bin/tsc.
 * If not found, then find if the command exists globally.
 */

function findLocal(): boolean {
  let found = true;
  try {
    // if throws error, then typscript isn't installed locally
    require.resolve(`typescript/bin/tsc`);
  } catch (err) {
    found = false;
  }
  return found;
}

function findGlobal(): boolean {
  return commandExists.sync("tsc");
}

/**
 *
 * @param cmd either output of require.resolve(typescript/bin/tsc) or tsc
 */
async function runTsc(cwd: string, cmd: string) {
  return new Promise<void>((res, rej) => {
    exec(cmd, { cwd: cwd }, (err, stdout, stderr) => {
      if (err) {
        console.log(`err:\n${err}`);
      }
      if (stderr) {
        console.log(`stderr:\n${stderr}`);
      }
      if (stdout) {
        console.log(`stdout:\n${stdout}`);
      }
      if (err === null || err.code === 0) {
        res();
      } else {
        rej(`tsc exited with with some error\n ${err}`);
      }
    });
  });
}

function readTsConfig(
  cwd: string
): { rootDir: string; outDir: string } | undefined {
  const rootDir = cwd;
  const tsconfigPath = path.resolve(rootDir, "tsconfig.json");
  if (fs.existsSync(tsconfigPath)) {
    const json = JSON.parse(fs.readFileSync(tsconfigPath).toString());
    return {
      rootDir: path.resolve(rootDir, json["compilerOptions"]["rootDir"]),
      outDir: path.resolve(rootDir, json["compilerOptions"]["outDir"]),
    };
  }
  return;
}

async function* getFiles(dir: string): AsyncGenerator<string, void, void> {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

async function _copyAssetsFromSrc(rootDir: string, outDir: string) {
  const assetRegex =
    /(\.avif$)|(\.bmp$)|(\.gif$)|(\.jpe?g$)|(\.png$)|(\.svg$)|(\.css$)|(\.(scss|sass)$)/g;
  // find files to copy
  const toBeCopied: string[] = [];
  for await (const f of getFiles(rootDir)) {
    if (f.match(assetRegex)) {
      toBeCopied.push(f);
    }
  }
  // copy files
  const copyPromises: Promise<void>[] = [];
  toBeCopied.forEach((f) => {
    const promise = fs.promises.readFile(f).then((buf) => {
      const dest = path.resolve(outDir, path.relative(rootDir, f));
      if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
      }
      return fs.promises.writeFile(dest, buf);
    });
    copyPromises.push(promise);
  });
  await Promise.all(copyPromises);
}

function copyAssetsFromSrc(cwd: string) {
  const tsconfig = readTsConfig(cwd);
  // by default we will put assets in outDir
  let outDir = path.resolve(cwd, "lib");
  let rootDir = path.resolve(cwd, "src");
  if (tsconfig) {
    rootDir = tsconfig.rootDir;
    outDir = tsconfig.outDir;
  }
  _copyAssetsFromSrc(rootDir, outDir);
}

export function buildLayer(cwd: string) {
  if (findLocal()) {
    const cmd = `node ${require.resolve("typescript/bin/tsc")}`;
    return runTsc(cwd, cmd)
      .then(() => {
        copyAssetsFromSrc(cwd);
      })
      .catch((err) => console.log(err));
  } else if (findGlobal()) {
    const cmd = "tsc";
    return runTsc(cwd, cmd)
      .then(() => {
        copyAssetsFromSrc(cwd);
      })
      .catch((err) => console.log(err));
  } else {
    throw Error(
      "'typescript' package is missing. Please install typescript package."
    );
  }
}

export function buildRuntime(cwd: string) {
  if (findLocal()) {
    const cmd = `node ${require.resolve("typescript/bin/tsc")}`;
    return runTsc(cwd, cmd)
      .then(() => {
        copyAssetsFromSrc(cwd);
      })
      .catch((err) => console.log(err));
  } else if (findGlobal()) {
    const cmd = "tsc";
    return runTsc(cwd, cmd)
      .then(() => {
        copyAssetsFromSrc(cwd);
      })
      .catch((err) => console.log(err));
  } else {
    throw Error(
      "'typescript' package is missing. Please install typescript package."
    );
  }
}
