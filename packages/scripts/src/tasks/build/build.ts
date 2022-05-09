#!/usr/bin/env node
import { webpack } from "webpack";
import path from "path";
import { copySync } from "fs-extra";
import {
  extractLayerEntries,
  getCorePkgInfo,
  getToolEnv,
  getToolPkgInfo,
  importToolConfig,
} from "../../shared/utils";
import { createGlobalModuleForLayer } from "../../shared/processLayer";
import createWebpackConfig from "../../shared/webpack.config";

const toolPkgInfo = getToolPkgInfo();
const corePkgInfo = getCorePkgInfo();
const toolEnv = getToolEnv();

importToolConfig(toolPkgInfo.configFile)
  .then(async (toolConfig) => {
    const layerEntries = await extractLayerEntries(toolConfig, toolPkgInfo);

    // create global module for each layer
    layerEntries.forEach((layerEntry) => {
      createGlobalModuleForLayer(layerEntry);
    });

    // bundle ui
    const webpackConfig = createWebpackConfig(
      corePkgInfo,
      toolPkgInfo,
      toolConfig,
      layerEntries,
      toolEnv,
      "production",
      false
    );
    webpack(webpackConfig, (err, stats) => {
      let buildFailed = false;
      if (err) {
        buildFailed = true;
        console.error(err);
      }
      if (stats?.hasErrors()) {
        buildFailed = true;
        console.log(stats?.toJson().errors);
      }
      if (!buildFailed) {
        console.log("Copying public directory");
        copyPublicDirectory();
        console.log(`Build completed!`);
      }
    });

    function copyPublicDirectory() {
      copySync(
        toolPkgInfo.publicDir,
        path.resolve(toolPkgInfo.dir, toolConfig.output),
        {
          dereference: true,
          filter: (file) => file !== toolPkgInfo.toolHtml,
        }
      );
    }
  })
  .catch((err) => {
    console.log(err);
  });
