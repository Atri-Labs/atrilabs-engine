import {
  checkBrowsers,
  choosePort,
  clearConsole,
  isInteractive,
  extractParams,
  createConfig,
  createDevConfig,
  moduleFileExtensions,
} from "@atrilabs/commands-builder";
import {
  createCompiler,
  prepareUrls,
} from "react-dev-utils/WebpackDevServerUtils";
import fs from "fs";
import path from "path";
import webpack from "webpack";
import chalk from "chalk";
import openBrowser from "react-dev-utils/openBrowser";
import WebpackDevServer from "webpack-dev-server";
import Express from "express";

export default function startDevServer(
  params: ReturnType<typeof extractParams>
) {
  const {
    paths,
    isEnvDevelopment,
    isEnvProduction,
    isEnvTest,
    isEnvProductionProfile,
    clientEnv,
    shouldUseSourceMap,
    publicUrlOrPath,
    entry,
    host,
    port,
    protocol,
    sockHost,
    sockPath,
    sockPort,
    proxy,
    middlewares,
    useTypeScript,
    debugBuildTool,
    prepareConfig,
    applyPlugins,
    additionalInclude,
    additionalNodeModules,
    outputFilename,
  } = params;

  checkBrowsers(paths.appPath, isInteractive())
    .then(() => {
      return choosePort(host, port);
    })
    .then((port) => {
      if (port === null) {
        // port not found
        return;
      }
      const webpackConfig = createConfig({
        isEnvDevelopment,
        isEnvProduction,
        isEnvTest,
        isEnvProductionProfile,
        clientEnv,
        shouldUseSourceMap,
        entry,
        paths,
        publicUrlOrPath,
        moduleFileExtensions,
        imageInlineSizeLimit: 10,
        shouldInlineRuntimeChunk: true,
        useTypeScript,
        additionalInclude,
        additionalNodeModules,
        outputFilename,
      });

      if (prepareConfig && typeof prepareConfig === "function") {
        prepareConfig(webpackConfig);
      }

      // the type is wrong in react-dev-utils
      const urls = prepareUrls(
        protocol,
        host,
        port,
        // @ts-ignore
        publicUrlOrPath.slice(0, -1)
      );
      const appName = JSON.parse(
        fs.readFileSync(paths.appPackageJson).toString()
      ).name;
      const useYarn = fs.existsSync(path.resolve(paths.appPath, "yarn.lock"));

      const compiler = createCompiler({
        appName,
        config: webpackConfig,
        urls,
        useYarn,
        webpack,
        useTypeScript,
        devSocket: {
          errors: (_errors: string[]) => {},
          warnings: (_warnings: string[]) => {},
        },
      });

      if (applyPlugins && typeof applyPlugins === "function") {
        applyPlugins(compiler);
      }

      if (urls.lanUrlForConfig === undefined) {
        throw TypeError(
          "lanUrlForConfig is expected to be defined. Check if host, port is provided properly."
        );
      }

      function wrapMiddleware(app: Express.Application) {
        if (middlewares) middlewares(app, compiler, webpackConfig);
      }

      const devWebpackConfig = createDevConfig(
        urls.lanUrlForConfig,
        {
          appPublic: paths.appPublic,
          publicUrlOrPath,
          appSrc: paths.appSrc,
        },
        { hostname: sockHost, pathname: sockPath, port: sockPort },
        proxy,
        wrapMiddleware
      );

      const devServer = new WebpackDevServer(
        { ...devWebpackConfig, host, port },
        compiler
      );
      devServer.startCallback(() => {
        if (isInteractive()) {
          clearConsole();
        }

        console.log(chalk.cyan("Starting the development server...\n"));
        openBrowser(urls.localUrlForBrowser);
      });

      ["SIGINT", "SIGTERM"].forEach(function (sig) {
        process.on(sig, function () {
          devServer.close();
          process.exit();
        });
      });

      if (process.env["CI"] !== "true") {
        // Gracefully exit when stdin ends
        process.stdin.on("end", function () {
          devServer.close();
          process.exit();
        });
      }
    })
    .catch((err) => {
      if (err && err.message) {
        console.log(err.message);
        if (debugBuildTool) {
          console.log(err);
        }
      }
      process.exit(1);
    });
}
