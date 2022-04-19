#!/usr/bin/env node
console.log("lern dev");
import { webpack } from "webpack";
import {
  extractLayerEntries,
  getToolPkgInfo,
  importToolConfig,
} from "../../shared/utils";
import { createGlobalModuleForLayer } from "../../shared/processLayer";
import createWebpackConfig from "../../shared/webpack.config";

const toolPkgInfo = getToolPkgInfo();

importToolConfig(toolPkgInfo.configFile)
  .then(async (toolConfig) => {
    const layerEntries = await extractLayerEntries(toolConfig, toolPkgInfo);

    // create global module for each layer
    layerEntries.forEach((layerEntry) => {
      createGlobalModuleForLayer(layerEntry);
    });

    // bundle ui
    const webpackConfig = createWebpackConfig(
      toolPkgInfo,
      toolConfig,
      layerEntries
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
        console.log(`Build completed!`);
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
