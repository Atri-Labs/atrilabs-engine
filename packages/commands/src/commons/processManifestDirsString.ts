import path from "path";

export function processManifestDirsString(dirs: string[]) {
  const processedDirs = dirs.map((dir) => {
    if (dir.startsWith("#")) {
      return path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve(dir.replace("#", ""))
      );
    }
    return path.resolve(dir);
  });
  return processedDirs;
}
