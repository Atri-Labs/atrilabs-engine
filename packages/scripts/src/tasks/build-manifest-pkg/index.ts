#!/usr/bin/env node
import { buildManifestPackage } from "../../shared/build-manifest-package";
import { getToolPkgInfo, importToolConfig } from "../../shared/utils";
import yargs from "yargs";

const args = yargs(process.argv.slice(2))
  .boolean("freeze")
  .alias("freeze", ["f"])
  .describe("freeze", "freeze the built manifest package for distribution")
  .parse() as {
  [x: string]: unknown;
  freeze: boolean | undefined;
  f: boolean | undefined;
  _: (string | number)[];
  $0: string;
};

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
    const freeze = args.freeze || false;
    buildManifestPackage(
      toolConfig.manifestDirs,
      toolConfig.pkgManager,
      toolConfig["services"]["manifestServer"]["options"]["port"],
      scriptName,
      freeze
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
