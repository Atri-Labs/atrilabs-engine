import chokidar from "chokidar";
import { LayerEntry, RuntimeEntry } from "../../shared/types";
import buildLayer from "./buildLayer";
import buildRuntime from "./buildRuntime";

const watcher = chokidar.watch([]);
const watchedLayerSrcDirs: { [key: string]: LayerEntry } = {};
const watchedRuntimeSrcDirs: { [key: string]: RuntimeEntry } = {};

watcher.on("change", (path) => {
  let changeWasInLayer = false;
  const layerSrcDirs = Object.keys(watchedLayerSrcDirs);
  layerSrcDirs.forEach((srcDir) => {
    if (path.includes(srcDir)) {
      changeWasInLayer = true;
      buildLayer(watchedLayerSrcDirs[srcDir]!);
    }
  });
  // check if the changes were in a runtime package
  if (!changeWasInLayer) {
    const runtimeSrcDirs = Object.keys(watchedRuntimeSrcDirs);
    runtimeSrcDirs.forEach((srcDir) => {
      if (path.includes(srcDir)) {
        buildRuntime(watchedRuntimeSrcDirs[srcDir]!);
      }
    });
  }
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
