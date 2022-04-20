import chokidar from "chokidar";
import fs from "fs";
import { CorePkgInfo, ToolPkgInfo } from "../../shared/types";

/**
 * Webpack doesn't watch files that doesn't get resolved in the build process.
 * Hence, this is a trick to force compilation.
 */
export default function forceRecompile(
  corePkgInfo: CorePkgInfo,
  toolPkgInfo: ToolPkgInfo
) {
  chokidar.watch(toolPkgInfo.configFile).on("change", () => {
    const layersContent = fs.readFileSync(corePkgInfo.entryFile);
    fs.writeFileSync(corePkgInfo.entryFile, layersContent);
  });
}
