#!/usr/bin/env node

import { extractParams, readEnvironmentVariables } from "../utils";
import FileSizeReporter from "react-dev-utils/FileSizeReporter";
import { createNodeConfig } from "../configs/node.webpack.config";
import moduleFileExtensions from "../utils/moduleFileExtensions";
import webpack from "webpack";
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages";
import chalk from "chalk";
import {
  reportFileSizeChange,
  reportWarningsOrSuccess,
} from "../utils/reporting";
const bfj = require("bfj");

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
    applyPlugins,
    additionalNodeModules,
  } = params;

  const webpackConfig = createNodeConfig({
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
    additionalNodeModules,
  });

  if (prepareConfig && typeof prepareConfig === "function") {
    prepareConfig(webpackConfig);
  }

  const compiler = webpack(webpackConfig);

  if (applyPlugins && typeof applyPlugins === "function") {
    applyPlugins(compiler);
  }

  return new Promise<{
    stats: webpack.Stats | undefined;
    warnings: ReturnType<typeof formatWebpackMessages>["warnings"];
  }>((resolve, reject) => {
    compiler.run((err, stats) => {
      const messages: ReturnType<typeof formatWebpackMessages> = {
        errors: [],
        warnings: [],
      };

      if (err) {
        if (!err.message) {
          return reject(err);
        }

        let errMessage = err.message;

        const webpackMessages = formatWebpackMessages({
          errors: [errMessage],
          warnings: [],
        });
        messages.errors.push(...webpackMessages.errors);
        messages.warnings.push(...webpackMessages.warnings);
      } else {
        if (stats) {
          const webpackMessages = formatWebpackMessages(
            stats.toJson({
              all: false,
              warnings: true,
              errors: true,
            })
          );
          messages.errors.push(...webpackMessages.errors);
          messages.warnings.push(...webpackMessages.warnings);
        }
      }

      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join("\n\n")));
      }
      if (
        process.env["CI"] &&
        (typeof process.env["CI"] !== "string" ||
          process.env["CI"].toLowerCase() !== "false") &&
        messages.warnings.length
      ) {
        // Ignore sourcemap warnings in CI builds. See #8227 for more info.
        const filteredWarnings = messages.warnings.filter(
          (w) => !/Failed to parse source map/.test(w)
        );
        if (filteredWarnings.length) {
          console.log(
            chalk.yellow(
              "\nTreating warnings as errors because process.env.CI = true.\n" +
                "Most CI servers set it automatically.\n"
            )
          );
          return reject(new Error(filteredWarnings.join("\n\n")));
        }
      }

      const resolveArgs = {
        stats,
        warnings: messages.warnings,
      };

      if (writeStats && stats) {
        return bfj
          .write(paths.outputDir + "/bundle-stats.json", stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch((error: any) => reject(new Error(error)));
      }

      return resolve(resolveArgs);
    });
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
