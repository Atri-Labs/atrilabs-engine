import { LayerEntry } from "../../shared/types";
import { buildLayer } from "../../shared/build-packages";

/**
 * Build layers that are not inside node_modules
 * @param layerEntry
 */
export default function (layerEntry: LayerEntry) {
  if (layerEntry.layerPath.match(/node_modules/)) {
    return;
  }
  try {
    const cwd = layerEntry.layerPath;
    buildLayer(cwd);
  } catch (err) {
    console.log(err);
  }
}
