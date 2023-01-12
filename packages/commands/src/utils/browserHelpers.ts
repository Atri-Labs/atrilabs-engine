/**
 * This file has been copied/inspired from
 * https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/browsersHelper.js
 */
import prompts from "prompts";
import chalk from "chalk";
import browserslist from "browserslist";
import os from "os";
import pkgUp from "pkg-up";
import fs from "fs";

export const defaultBrowsers = {
	production: [">0.2%", "not dead", "not op_mini all"],
	development: [
		"last 1 chrome version",
		"last 1 firefox version",
		"last 1 safari version",
	],
};

/**
 * prompts if defaultBrowsers should be set
 */
function shouldSetBrowsers(isInteractive: boolean) {
	if (!isInteractive) {
		return Promise.resolve(true);
	}

	const question = {
		type: "confirm" as "confirm",
		name: "shouldSetBrowsers",
		message:
			chalk.yellow("We're unable to detect target browsers.") +
			`\n\nWould you like to add the defaults to your ${chalk.bold(
				"package.json"
			)}?`,
		initial: true,
	};

	return prompts(question).then((answer) => answer.shouldSetBrowsers);
}

/**
 * This function checks if browser list has been
 * provided in the package.json/.browserlistrc file.
 *
 * If this function can't find the browser list, then
 * it will add defaultBrowsers to package.json as browserlist.
 *
 * This function will retry one more time if the
 * retry argument is true.
 *
 * @param dir directory whose nearest package.json will be used for browserlist
 * @param isInteractive true if user should be prompted
 * @param retry retry once if any error occurs
 */
export function checkBrowsers(
	dir: string,
	isInteractive: boolean,
	retry = true
): Promise<any> {
	const current = browserslist.loadConfig({ path: dir });
	if (current != null) {
		return Promise.resolve(current);
	}

	if (!retry) {
		return Promise.reject(
			new Error(
				chalk.red("You must specify targeted browsers.") +
					os.EOL +
					`Please add a ${chalk.underline(
						"browserslist"
					)} key to your ${chalk.bold("package.json")}.`
			)
		);
	}

	return shouldSetBrowsers(isInteractive).then((shouldSetBrowsers) => {
		if (!shouldSetBrowsers) {
			return checkBrowsers(dir, isInteractive, false);
		}

		return (
			pkgUp({ cwd: dir })
				.then((filePath) => {
					if (filePath == null) {
						return Promise.reject();
					}
					const pkg = JSON.parse(
						fs.readFileSync(filePath).toString()
					);
					pkg["browserslist"] = defaultBrowsers;
					fs.writeFileSync(
						filePath,
						JSON.stringify(pkg, null, 2) + os.EOL
					);

					browserslist.clearCaches();
					console.log();
					console.log(
						`${chalk.green("Set target browsers:")} ${chalk.cyan(
							JSON.stringify(defaultBrowsers, null, 2)
						)}`
					);
					console.log();
				})
				// Swallow any error
				.catch(() => {})
				.then(() => checkBrowsers(dir, isInteractive, false))
		);
	});
}
