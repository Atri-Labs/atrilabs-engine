import { webpack } from "webpack";
import createServerWebpackConfig from "./server.webpack.config";
import createWebpackConfig from "./webpack.config";

export const imageInlineSizeLimit = parseInt(
	process.env["IMAGE_INLINE_SIZE_LIMIT"] || "10000"
);

export const moduleFileExtensions = [
	"web.mjs",
	"mjs",
	"web.js",
	"js",
	"web.ts",
	"ts",
	"web.tsx",
	"tsx",
	"json",
	"web.jsx",
	"jsx",
];

export type BuildTypes = "development" | "production";

export type BuildAppOptions = {
	mode: BuildTypes;
	appEntry: string;
	appHtml: string;
	appOutput: string;
	includes: string[];
};

export function buildApp(options: BuildAppOptions) {
	const { mode, appEntry, appHtml, appOutput, includes } = options;

	process.env["NODE_ENV"] = mode;
	process.env["BABEL_ENV"] = mode;

	const webpackConfig = createWebpackConfig({
		paths: { appEntry, appHtml, appOutput, includes },
		mode,
		publicUrlOrPath: "/",
		shouldUseSourceMap: false,
	});

	webpack(webpackConfig, (err, stats) => {
		if (err) {
			console.log("Error\n", err);
		}
		if (stats?.hasErrors) {
			console.log(stats.toString());
		}
	});
}

export type BuildServerOptions = {
	mode: BuildTypes;
	serverEntry: string;
	serverOutput: string;
	includes: string[];
};

export function buildServer(options: BuildServerOptions) {
	const { mode, serverEntry, serverOutput, includes } = options;

	process.env["NODE_ENV"] = mode;
	process.env["BABEL_ENV"] = mode;

	const webpackConfig = createServerWebpackConfig({
		paths: { serverEntry, serverOutput, includes },
		mode,
		publicUrlOrPath: "/",
		shouldUseSourceMap: false,
	});

	webpack(webpackConfig, (err, stats) => {
		if (err) {
			console.log("Error\n", err);
		}
		if (stats?.hasErrors) {
			console.log(stats.toString());
		}
	});
}

export function getMode(): BuildTypes {
	const mode =
		process.env["MODE"] &&
		(process.env["MODE"] === "production" ||
			process.env["MODE"] === "development")
			? process.env["MODE"]
			: "development";
	return mode;
}

export function setNodeAndBabelEnv(mode: BuildTypes) {
	process.env["NODE_ENV"] = mode;
	process.env["BABEL_ENV"] = mode;
}
