/**
 * The code in this module is inspired from
 * https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js
 * https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/getProcessForPort.js
 */

import { isInteractive } from "./isInteractive";
const detect = require("detect-port-alt");
import isRoot from "is-root";
import { clearConsole } from "./consoleHelpers";
import chalk from "chalk";
import prompts from "prompts";
import find from "find-process";
import pidCwd from "pid-cwd";

export async function getProcessPort(port: number) {
	return find("port", port).then(async (list) => {
		if (!list.length) {
			return undefined;
		} else {
			const { pid } = list[0];
			const directory = await pidCwd(pid);
			return { ...list[0], directory };
		}
	});
}

export async function getProcessStringPort(port: number) {
	return getProcessPort(port).then(async (processDetails) => {
		if (processDetails === undefined) {
			console.log(`Port ${port} is free now.`);
			return undefined;
		} else {
			const { cmd, pid, directory } = processDetails;
			return (
				chalk.cyan(cmd) +
				chalk.grey(" (pid " + pid + ")\n") +
				chalk.blue("  in ") +
				chalk.cyan(directory)
			);
		}
	});
}

export function choosePort(host: string, defaultPort: number) {
	return detect(defaultPort, host).then(
		(port: number) =>
			new Promise(async (resolve) => {
				if (port === defaultPort) {
					return resolve(port);
				}
				const message =
					process.platform !== "win32" &&
					defaultPort < 1024 &&
					!isRoot()
						? `Admin permissions are required to run a server on a port below 1024.`
						: `Something is already running on port ${defaultPort}.`;
				if (isInteractive()) {
					clearConsole();
					const existingProcess = await getProcessStringPort(
						defaultPort
					);
					const question = {
						type: "confirm" as "confirm",
						name: "shouldChangePort",
						message:
							chalk.yellow(
								message +
									`${
										existingProcess
											? ` Probably:\n  ${existingProcess}`
											: ""
									}`
							) +
							"\n\nWould you like to run the app on another port instead?",
						initial: true,
					};
					prompts(question).then((answer) => {
						if (answer.shouldChangePort) {
							resolve(port);
						} else {
							resolve(null);
						}
					});
				} else {
					console.log(chalk.red(message));
					resolve(null);
				}
			}),
		(err: Error) => {
			throw new Error(
				chalk.red(
					`Could not find an open port at ${chalk.bold(host)}.`
				) +
					"\n" +
					("Network error message: " + err.message || err) +
					"\n"
			);
		}
	);
}
