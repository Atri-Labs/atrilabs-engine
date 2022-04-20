#!/usr/bin/env node
import { webpack } from "webpack";
import WebpackDevServer from "webpack-dev-server";
import chalk from "chalk";
import { createGlobalModuleForLayer } from "../../shared/processLayer";
import {
  extractLayerEntries,
  getCorePkgInfo,
  getToolPkgInfo,
  importToolConfig,
} from "../../shared/utils";
import createWebpackConfig from "../../shared/webpack.config";
import { isInteractive, clearConsole } from "../../shared/terminal";
import addCompilerHooks from "./addCompilerHooks";
import forceRecompile from "./forceRecompile";

const toolPkgInfo = getToolPkgInfo();
const corePkgInfo = getCorePkgInfo();

importToolConfig(toolPkgInfo.configFile)
  .then(async (toolConfig) => {
    const layerEntries = await extractLayerEntries(toolConfig, toolPkgInfo);

    // create global module and symlink for each layer
    layerEntries.forEach((layerEntry) => {
      createGlobalModuleForLayer(layerEntry);
    });

    // force compile when tool.config.js file changes
    forceRecompile(corePkgInfo, toolPkgInfo);

    // create webpack config
    const webpackConfig = createWebpackConfig(
      corePkgInfo,
      toolPkgInfo,
      toolConfig,
      layerEntries
    );
    webpackConfig["watchOptions"] = {
      ignored: /node_modules/,
    };
    webpackConfig["mode"] = "development";

    // create compiler
    const compiler = webpack(webpackConfig);
    addCompilerHooks(compiler);

    // create dev server
    const devServer = new WebpackDevServer(
      { host: "localhost", port: 4000 },
      compiler
    );

    // launch WebpackDevServer
    devServer.startCallback(() => {
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan("Starting the development server...\n"));
    });

    ["SIGINT", "SIGTERM"].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close();
        process.exit();
      });
    });

    process.stdin.on("end", function () {
      devServer.close();
      process.exit();
    });
  })
  .catch((err) => {
    console.log(err);
  });
