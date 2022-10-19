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
import getServerConfig from "./getServerConfig";
import watchCorePkg from "./watchCorePkg";
import buildLayer from "./buildLayer";
import buildRuntime from "./buildRuntime";

const toolPkgInfo = getToolPkgInfo();
const corePkgInfo = getCorePkgInfo();
const toolEnv = getToolEnv();
const serverConfig = getServerConfig();

// watch @atrilabs/core package if it's not inside node_modules
watchCorePkg(corePkgInfo);

processToolConfig(toolPkgInfo)
  .then(
    async ({
      toolConfig,
      layerEntries,
      runtimeEntries,
      manifestSchemaEntries,
    }) => {
      // force compile when tool.config.js file changes
      forceRecompile(corePkgInfo, toolPkgInfo);

      // build all layers once in the beginning
      // TODO: handle failed compilation.
      // failed compilation should lead to watching for changes so that
      // when error gets fixed, compilation resumes.
      layerEntries.forEach((layerEntry) => buildLayer(layerEntry));

      // build all runtimes once in the beginning
      // TODO: handle failed compilation.
      runtimeEntries.forEach((runtimeEntry) => buildRuntime(runtimeEntry));

      // create webpack config
      const webpackConfig = createWebpackConfig(
        corePkgInfo,
        toolPkgInfo,
        toolConfig,
        layerEntries,
        runtimeEntries,
        manifestSchemaEntries,
        toolEnv,
        "development",
        true
      );
      webpackConfig["watchOptions"] = {
        ignored: /node_modules/,
      };
      webpackConfig["mode"] = "development";
      webpackConfig["devServer"] = {
        client: {
          overlay: true,
        },
        hot: true,
        proxy: {
          [toolConfig.assetManager.urlPath]: {
            target: toolConfig.devServerProxy.hostname,
          },
          "/api": {
            target: toolConfig.devServerProxy.hostname,
          },
        },
      };

      // create compiler
      const compiler = webpack(webpackConfig);
      addCompilerHooks(compiler);

      // create dev server
      const devServer = new WebpackDevServer(
        { ...serverConfig, ...webpackConfig["devServer"] },
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
    }
  )
  .catch((err) => {
    console.log(err);
  });
