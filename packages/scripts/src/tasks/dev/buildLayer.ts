import { exec } from "child_process";
import chalk from "chalk";
import { LayerEntry } from "../../shared/types";

/**
 * Build layers that are not inside node_modules
 * @param layerEntry
 */
export default function buildLayer(layerEntry: LayerEntry) {
  if (layerEntry.layerPath.match(/node_modules/)) {
    return;
  }
  try {
    exec("tsc", { cwd: layerEntry.layerPath }, (err, stdout, stderr) => {
      let hasError = false;
      if (err) {
        hasError = true;
        console.log(chalk.red(err.message));
      }
      if (stderr) {
        hasError = true;
        console.log(chalk.red(`stderr: ${stderr}`));
      }
      if (stdout && hasError) {
        console.log(chalk.red(stdout));
      }
    });
  } catch (err) {
    console.log(err);
  }
}
