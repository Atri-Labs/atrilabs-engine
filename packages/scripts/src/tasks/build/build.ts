#!/usr/bin/env node
import { webpack } from "webpack";
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
      toolEnv
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
