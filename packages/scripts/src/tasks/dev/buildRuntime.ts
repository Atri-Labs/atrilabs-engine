import { RuntimeEntry } from "../../shared/types";
import { buildRuntime } from "../../shared/build-packages";

/**
 * Build runtimes that are not inside node_modules
 * @param runtimeEntry
 */
export default function (runtimeEntry: RuntimeEntry) {
  if (runtimeEntry.runtimePath.match(/node_modules/)) {
    return;
  }
  try {
    const cwd = runtimeEntry.runtimePath;
    buildRuntime(cwd);
  } catch (err) {
    console.log(err);
  }
}
