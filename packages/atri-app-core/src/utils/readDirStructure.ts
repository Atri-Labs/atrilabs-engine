import path from "path";
import recursive from "recursive-readdir";
import type { Stats } from "fs";
import { toUnix } from "upath";

export function readDirStructure(dir: string) {
  if (!path.isAbsolute(dir)) {
    const err = Error();
    err.name = "ValueError";
    err.message =
      "The readDirStructure function expects absolute path to the directory.";
  }

  // replace any trailing slashes /a/b/c///// -> /a/b/c
  const sanitizedDir = path.resolve(dir);

  function ignoreFunc(file: string, stats: Stats) {
    return stats.isDirectory()
      ? false
      : file.match(/(.js|.jsx|.ts|.tsx)$/) === null;
  }

  return recursive(sanitizedDir, [ignoreFunc]).then((files) => {
    return files.map((file) => {
      const prefixRemovedPath = file.replace(sanitizedDir, "");
      return process.platform === "win32"
        ? toUnix(prefixRemovedPath)
        : prefixRemovedPath;
    });
  });
}
