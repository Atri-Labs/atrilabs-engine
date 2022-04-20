#!/usr/bin/env node
import { webpack } from "webpack";
import WebpackDevServer from "webpack-dev-server";
import chalk from "chalk";
import { getCorePkgInfo, getToolEnv, getToolPkgInfo } from "../../shared/utils";
import createWebpackConfig from "../../shared/webpack.config";
import { isInteractive } from "../../shared/terminal";
import addCompilerHooks from "./addCompilerHooks";
import forceRecompile from "./forceRecompile";
import { processToolConfig } from "./processToolConfig";

const toolPkgInfo = getToolPkgInfo();
const corePkgInfo = getCorePkgInfo();
const toolEnv = getToolEnv();

processToolConfig(toolPkgInfo)
  .then(async ({ toolConfig, layerEntries }) => {
    // force compile when tool.config.js file changes
    forceRecompile(corePkgInfo, toolPkgInfo);

    // create webpack config
    const webpackConfig = createWebpackConfig(
      corePkgInfo,
      toolPkgInfo,
      toolConfig,
      layerEntries,
      toolEnv
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
        // clearConsole();
      }
      console.log(chalk.cyan("Starting the development server...\n"));
    });

    // wait for kill signals
    ["SIGINT", "SIGTERM"].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close();
        process.exit();
      });
    });

    // wait for input on stdin (hold the terminal)
    process.stdin.on("end", function () {
      devServer.close();
      process.exit();
    });
  })
  .catch((err) => {
    console.log(err);
  });
