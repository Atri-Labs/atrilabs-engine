import chokidar from "chokidar";
import { computeFSAndSend } from "./computeFSAndSend";
import { interpreter } from "../init";

export function watchManifestDirs(dirs: string[]) {
  const watcher = chokidar.watch(dirs, { ignoreInitial: true });
  watcher.on("add", () => {
    computeFSAndSend(interpreter, dirs);
  });
  watcher.on("unlink", () => {
    computeFSAndSend(interpreter, dirs);
  });
  return watcher;
}
