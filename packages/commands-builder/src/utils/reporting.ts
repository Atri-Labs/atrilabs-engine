import webpack from "webpack";
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages";
import chalk from "chalk";
import FileSizeReporter from "react-dev-utils/FileSizeReporter";
const bfj = require("bfj");

// These sizes are pretty large. We'll warn for bundles exceeding them.
export const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
export const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

export function reportWarningsOrSuccess(
  warnings: ReturnType<typeof formatWebpackMessages>["warnings"]
) {
  if (warnings.length) {
    console.log(chalk.yellow("Compiled with warnings.\n"));
    console.log(warnings.join("\n\n"));
    console.log(
      "\nSearch for the " +
        chalk.underline(chalk.yellow("keywords")) +
        " to learn more about each warning."
    );
    console.log(
      "To ignore, add " +
        chalk.cyan("// eslint-disable-next-line") +
        " to the line before.\n"
    );
  } else {
    console.log(chalk.green("Compiled successfully.\n"));
  }
}

export function reportFileSizeChange(
  stats: webpack.Stats,
  previousFileSizes: FileSizeReporter.OpaqueFileSizes,
  paths: { outputDir: string }
) {
  const { printFileSizesAfterBuild } = FileSizeReporter;

  console.log("File sizes after gzip:\n");
  printFileSizesAfterBuild(
    stats,
    previousFileSizes,
    paths.outputDir,
    WARN_AFTER_BUNDLE_GZIP_SIZE,
    WARN_AFTER_CHUNK_GZIP_SIZE
  );
}

export function collectWebpackMessages(options: {
  writeStats: boolean;
  outputDir: string;
  err: Error | undefined;
  stats: webpack.Stats | undefined;
}) {
  return new Promise<{
    stats: webpack.Stats | undefined;
    warnings: ReturnType<typeof formatWebpackMessages>["warnings"];
  }>((resolve, reject) => {
    const { writeStats, outputDir, err, stats } = options;

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
        .write(outputDir + "/bundle-stats.json", stats.toJson())
        .then(() => resolve(resolveArgs))
        .catch((error: any) => reject(new Error(error)));
    } else {
      resolve(resolveArgs);
    }
  });
}
