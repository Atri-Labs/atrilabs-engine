import { exec } from "child_process";
import chokidar from "chokidar";
import chalk from "chalk";
import path from "path";
import { CorePkgInfo } from "../../shared/types";

/**
 * Watch core package src directory only if it's not inside node_modules.
 */
export default function watchCorePkg(corePkgInfo: CorePkgInfo) {
  const watcher = chokidar.watch([]);
  const srcDir = path.resolve(corePkgInfo.dir, "src");
  if (srcDir.match(/node_modules/) === null) {
    watcher.add(`${srcDir}/**/*`);
  }
  watcher.on("change", (path) => {
    if (path.includes(srcDir)) {
      try {
        exec("tsc", { cwd: corePkgInfo.dir }, (err, stdout, stderr) => {
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
  });
}
