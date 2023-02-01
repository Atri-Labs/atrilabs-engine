import chokidar from "chokidar";
import { computeFSAndSend } from "./computeManifestIR";

export function watchManifestDirs(dirs: string[]) {
  const watcher = chokidar.watch(dirs);
  watcher.on("add", computeFSAndSend);
  watcher.on("unlink", computeFSAndSend);
  return watcher;
}
