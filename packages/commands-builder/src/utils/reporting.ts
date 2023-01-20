import webpack from "webpack";
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages";
import chalk from "chalk";
import FileSizeReporter from "react-dev-utils/FileSizeReporter";

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
