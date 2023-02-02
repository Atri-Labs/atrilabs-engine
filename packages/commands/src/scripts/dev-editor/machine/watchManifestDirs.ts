import chokidar from "chokidar";
import { computeFSAndSend } from "./computeManifestIR";
import { editorServerMachineInterpreter } from "./init";

export function watchManifestDirs(dirs: string[]) {
  const watcher = chokidar.watch(dirs);
  watcher.on("add", () => {
    computeFSAndSend(editorServerMachineInterpreter, dirs);
  });
  watcher.on("unlink", () => {
    computeFSAndSend(editorServerMachineInterpreter, dirs);
  });
  return watcher;
}
