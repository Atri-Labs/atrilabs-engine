import chokidar from "chokidar";
import { LayerEntry, RuntimeEntry } from "../../shared/types";
import buildLayer from "./buildLayer";

const watcher = chokidar.watch([]);
const watchedLayerSrcDirs: { [key: string]: LayerEntry } = {};
const watchedRuntimeSrcDirs: { [key: string]: RuntimeEntry } = {};

watcher.on("change", (path) => {
  const srcDirs = Object.keys(watchedLayerSrcDirs);
  srcDirs.forEach((srcDir) => {
    if (path.match(srcDir)) {
      buildLayer(watchedLayerSrcDirs[srcDir]!);
    }
  });
});

/**
 * Watch src directory of layers not inside node_modules. It does nothing if the
 * src directory is already under watch.
 */
export function watchLayerSource(layerEntries: LayerEntry[]) {
  for (let i = 0; i < layerEntries.length; i++) {
    const layerEntry = layerEntries[i]!;
    const srcDir = layerEntry.layerSrcDir;
    if (
      watchedLayerSrcDirs[srcDir] === undefined &&
      srcDir.match(/node_modules/) === null
    ) {
      watcher.add(`${srcDir}/**/*`);
      watchedLayerSrcDirs[srcDir] = layerEntry;
    }
  }
}

/**
 * Watch src directory of runtimes not inside node_modules. It does nothing if the
 * src directory is already under watch.
 */
export function watchRuntimeSource(runtimeEntries: RuntimeEntry[]) {
  for (let i = 0; i < runtimeEntries.length; i++) {
    const runtimeEntry = runtimeEntries[i]!;
    const srcDir = runtimeEntry.runtimeSrcDir;
    if (
      watchedRuntimeSrcDirs[srcDir] === undefined &&
      srcDir.match(/node_modules/) === null
    ) {
      watcher.add(`${srcDir}/**/*`);
      watchedRuntimeSrcDirs[srcDir] = runtimeEntry;
    }
  }
}
