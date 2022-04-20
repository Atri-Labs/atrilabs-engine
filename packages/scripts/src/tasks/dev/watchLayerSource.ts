import { exec } from "child_process";
import chokidar from "chokidar";
import { LayerEntry } from "../../shared/types";

const watcher = chokidar.watch([]);
const watchedSrcDirs: { [key: string]: string } = {};

watcher.on("change", (path) => {
  const srcDirs = Object.keys(watchedSrcDirs);
  srcDirs.forEach((srcDir) => {
    if (path.match(srcDir)) {
      try {
        exec("tsc", { cwd: watchedSrcDirs[srcDir] });
      } catch (err) {
        console.log(err);
      }
    }
  });
});

/**
 * Watch src directory of layers not inside node_modules. It does nothing if the
 * src directory is already under watch.
 */
export default function watchLayerSource(layerEntries: LayerEntry[]) {
  for (let i = 0; i < layerEntries.length; i++) {
    const layerEntry = layerEntries[i]!;
    const srcDir = layerEntry.layerSrcDir;
    if (
      watchedSrcDirs[srcDir] === undefined &&
      srcDir.match(/node_modules/) === null
    ) {
      watcher.add(`${srcDir}/**/*`);
      watchedSrcDirs[srcDir] = layerEntry.layerPath;
    }
  }
}
