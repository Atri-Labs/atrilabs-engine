#!/usr/bin/env node

import { extractParams, readEnvironmentVariables } from "../utils";
import { createDevNodeConfig } from "../configs/dev.node.lib.webpack.config";
import moduleFileExtensions from "../utils/moduleFileExtensions";
import webpack from "webpack";
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages";
import {
  collectWebpackMessages,
  reportFileSizeChange,
  reportWarningsOrSuccess,
} from "../utils/reporting";
import FileSizeReporter from "react-dev-utils/FileSizeReporter";

function build(params: ReturnType<typeof extractParams>) {
  const {
    paths,
    isEnvDevelopment,
    isEnvProduction,
    isEnvTest,
    isEnvProductionProfile,
    serverEnv,
    shouldUseSourceMap,
    entry,
    writeStats,
    useTypeScript,
    prepareConfig,
    outputFilename,
    additionalNodeModules,
    additionalInclude,
    allowlist,
    imageInlineSizeLimit,
  } = params;

  const webpackConfig = createDevNodeConfig({
    isEnvDevelopment,
    isEnvProduction,
    isEnvProductionProfile,
    isEnvTest,
    shouldUseSourceMap,
    useTypeScript,
    paths,
    serverEnv,
    entry,
    moduleFileExtensions,
    outputFilename,
    additionalNodeModules,
    additionalInclude,
    allowlist,
    imageInlineSizeLimit,
  });

  if (prepareConfig && typeof prepareConfig === "function") {
    prepareConfig(webpackConfig);
  }

  return new Promise<{
    stats: webpack.Stats | undefined;
    warnings: ReturnType<typeof formatWebpackMessages>["warnings"];
  }>((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      collectWebpackMessages({
        err,
        stats,
        writeStats,
        outputDir: paths.outputDir,
      })
        .then((resolveArgs) => {
          resolve(resolveArgs);
        })
        .catch((err) => {
          reject(err);
        });
    });

    ["SIGINT", "SIGTERM"].forEach(function (sig) {
      process.on(sig, function () {
        process.exit();
      });
    });

    if (process.env["CI"] !== "true") {
      // Gracefully exit when stdin ends
      process.stdin.on("end", function () {
        process.exit();
      });
    }
  });
}

async function main() {
  const params = extractParams();
  const { paths } = params;

  const { measureFileSizesBeforeBuild } = FileSizeReporter;
  const previousFileSizes = await measureFileSizesBeforeBuild(paths.outputDir);

  const { stats, warnings } = await build(params);

  reportWarningsOrSuccess(warnings);

  if (stats)
    reportFileSizeChange(stats, previousFileSizes, {
      outputDir: paths.outputDir,
    });
}

main().catch((err) => {
  if (err && err.message) {
    console.log(err.message);
    const { debugBuildTool } = readEnvironmentVariables();
    if (debugBuildTool) {
      console.log(err);
    }
  }
  process.exit(1);
});
