import { Configuration, ModuleOptions } from "webpack";
import { createCommonWebpackConfig } from "./common.webpack.config";
import { imageInlineSizeLimit, moduleFileExtensions } from "./utils";
const nodeExternals = require("webpack-node-externals");

export type ServerWerbpackConfigOptions = {
	paths: {
		serverEntry: string;
		serverOutput: string;
		// include app src & manifest packages
		includes: string[];
	};
	mode: Configuration["mode"];
	publicUrlOrPath: string;
	shouldUseSourceMap: boolean;
};

export default function createServerWebpackConfig(
	options: ServerWerbpackConfigOptions
) {
	const { shouldUseSourceMap } = options;
	const isEnvDevelopment = options.mode === "development";
	const isEnvProduction = options.mode === "production";
	const rules: ModuleOptions["rules"] = [];
	const { oneOf } = createCommonWebpackConfig({
		isEnvDevelopment,
		isEnvProduction,
		imageInlineSizeLimit,
		shouldUseSourceMap,
	});
	rules.push({
		oneOf: [
			...oneOf,
			{
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				include: options.paths.includes,
				loader: require.resolve("babel-loader"),
				options: {
					customize: require.resolve(
						"babel-preset-react-app/webpack-overrides"
					),
					presets: [
						[
							require.resolve("babel-preset-react-app"),
							{
								runtime: "automatic",
							},
						],
					],
					babelrc: false,
					configFile: false,
					sourceMaps: options.shouldUseSourceMap,
					inputSourceMap: options.shouldUseSourceMap,
				},
			},
		],
	});
	const webpackConfig: Configuration = {
		mode: options.mode,
		entry: {
			server: { import: options.paths.serverEntry },
		},
		target: "node",
		externals: [nodeExternals()],
		output: {
			path: options.paths.serverOutput,
			pathinfo: isEnvDevelopment,
			filename: isEnvProduction
				? "static/js/[name].[contenthash:8].js"
				: isEnvDevelopment
				? "static/js/bundle.js"
				: undefined,
			chunkFilename: isEnvProduction
				? "static/js/[name].[contenthash:8].chunk.js"
				: isEnvDevelopment
				? "static/js/[name].chunk.js"
				: undefined,
			assetModuleFilename: "static/media/[name].[hash][ext]",
			publicPath: options.publicUrlOrPath,
		},
		resolve: {
			extensions: moduleFileExtensions.map((ext) => `.${ext}`),
		},
		module: {
			rules,
		},
	};
	return webpackConfig;
}
