#!/usr/bin/env node
import { buildManifestPackage } from "../../shared/build-manifest-package";
import { getToolPkgInfo, importToolConfig } from "../../shared/utils";

const toolPkgInfo = getToolPkgInfo();

importToolConfig(toolPkgInfo.configFile).then(async (toolConfig) => {
  if (
    toolConfig["services"] &&
    toolConfig["services"]["manifestServer"] &&
    toolConfig["services"]["manifestServer"]["options"] &&
    toolConfig["services"]["manifestServer"]["options"]["port"] &&
    typeof toolConfig["services"]["manifestServer"]["options"]["port"] ===
      "number"
  ) {
    const scriptName = "manifestscript";
    buildManifestPackage(
      toolConfig.manifestDirs,
      toolConfig.pkgManager,
      toolConfig["services"]["manifestServer"]["options"]["port"],
      scriptName
    )
      .then(() => {
        console.log(
          `Successfully built manifest packages:\n${toolConfig.manifestDirs
            .map((dir) => dir.pkg)
            .join("\n")}`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log(
      `Missing toolConfig.services.manifestServer.options.port field.`
    );
  }
});
