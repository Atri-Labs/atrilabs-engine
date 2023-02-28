import path from "path";
import recursive from "recursive-readdir";
import { toUnix } from "upath";
import mimetypes from "mime-types";
import fs from "fs";

export const PUBLIC_DIR = path.resolve("public");
const ASSETS_DIR = path.resolve("public", "assets");

function createAssetsDir() {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }
}

createAssetsDir();

function createUrl(assetPath: string) {
  const prefixRemovedPath = assetPath.replace(PUBLIC_DIR, "");
  return process.platform === "win32"
    ? toUnix(prefixRemovedPath)
    : prefixRemovedPath;
}

export function saveAssets(
  files: {
    name: string;
    data: ArrayBuffer;
    size: number;
    mime: string;
  }[]
): Promise<string[]> {
  return Promise.all(
    files.map((file) => {
      return new Promise<string>((res, rej) => {
        const filepath = path.resolve(ASSETS_DIR, file.name);
        fs.createWriteStream(filepath).write(file.data, (err) => {
          if (err) {
            rej(err);
          } else {
            res(createUrl(filepath));
          }
        });
      });
    })
  );
}

export function getAllAssetsInfo(): Promise<{
  [name: string]: { url: string; mime: string };
}> {
  return recursive(ASSETS_DIR).then((files) => {
    return files.reduce((curr, file) => {
      const url = createUrl(file);
      const mime = mimetypes.lookup(file) || "application/octet-stream";
      curr[url] = { url, mime };
      return curr;
    }, {} as { [name: string]: { url: string; mime: string } });
  });
}
