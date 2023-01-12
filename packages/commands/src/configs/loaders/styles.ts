import MiniCssExtractPlugin from "mini-css-extract-plugin";
import getCSSModuleLocalIdent from "react-dev-utils/getCSSModuleLocalIdent";
import { RuleSetRule } from "webpack";

// common function to get style loaders
export function getStyleLoaders(
	cssOptions: any,
	options: {
		isEnvDevelopment?: boolean;
		isEnvProduction?: boolean;
		publicUrlOrPath: string;
		shouldUseSourceMap?: boolean;
		appSrc?: string;
		preProcessor?: string;
	}
): RuleSetRule[] {
	const {
		isEnvDevelopment,
		isEnvProduction,
		publicUrlOrPath,
		shouldUseSourceMap,
		appSrc,
		preProcessor,
	} = options;
	const loaders: RuleSetRule[] = [];

	if (isEnvDevelopment) {
		loaders.push({ loader: require.resolve("style-loader") });
	}

	if (isEnvProduction) {
		loaders.push({
			loader: MiniCssExtractPlugin.loader,
			// css is located in `static/css`, use '../../' to locate index.html folder
			// in production `publicUrlOrPath` can be a relative path
			options: publicUrlOrPath.startsWith(".")
				? { publicPath: "../../" }
				: {},
		});
	}

	loaders.push(
		...[
			{
				loader: require.resolve("css-loader"),
				options: cssOptions,
			},
			{
				// Options for PostCSS as we reference these options twice
				// Adds vendor prefixing based on your specified browser support in
				// package.json
				loader: require.resolve("postcss-loader"),
				options: {
					postcssOptions: {
						// Necessary for external CSS imports to work
						// https://github.com/facebook/create-react-app/issues/2677
						ident: "postcss",
						config: false,
						plugins: [
							"postcss-flexbugs-fixes",
							[
								"postcss-preset-env",
								{
									autoprefixer: {
										flexbox: "no-2009",
									},
									stage: 3,
								},
							],
							// Adds PostCSS Normalize as the reset css with default options,
							// so that it honors browserslist config in package.json
							// which in turn let's users customize the target behavior as per their needs.
							"postcss-normalize",
						],
					},
					sourceMap: isEnvProduction
						? shouldUseSourceMap
						: isEnvDevelopment,
				},
			},
		]
	);

	if (preProcessor) {
		loaders.push(
			{
				loader: require.resolve("resolve-url-loader"),
				options: {
					sourceMap: isEnvProduction
						? shouldUseSourceMap
						: isEnvDevelopment,
					root: appSrc,
				},
			},
			{
				loader: require.resolve(preProcessor),
				options: {
					sourceMap: true,
				},
			}
		);
	}
	return loaders;
}

export default function setStyleLoaders(options: {
	isEnvDevelopment: boolean;
	isEnvProduction: boolean;
	publicUrlOrPath: string;
	shouldUseSourceMap: boolean;
	appSrc: string;
}) {
	const {
		isEnvDevelopment,
		isEnvProduction,
		shouldUseSourceMap,
		publicUrlOrPath,
		appSrc,
	} = options;
	const cssRegex = /\.css$/;
	const cssModuleRegex = /\.module\.css$/;
	const sassRegex = /\.(scss|sass)$/;
	const sassModuleRegex = /\.module\.(scss|sass)$/;

	return [
		// "postcss" loader applies autoprefixer to our CSS.
		// "css" loader resolves paths in CSS and adds assets as dependencies.
		// "style" loader turns CSS into JS modules that inject <style> tags.
		// In production, we use MiniCSSExtractPlugin to extract that CSS
		// to a file, but in development "style" loader enables hot editing
		// of CSS.
		// By default we support CSS Modules with the extension .module.css
		{
			test: cssRegex,
			exclude: cssModuleRegex,
			use: getStyleLoaders(
				{
					importLoaders: 1,
					sourceMap: isEnvProduction
						? shouldUseSourceMap
						: isEnvDevelopment,
					modules: {
						mode: "icss",
					},
				},
				{
					isEnvDevelopment,
					isEnvProduction,
					shouldUseSourceMap,
					publicUrlOrPath,
					appSrc,
				}
			),
			// Don't consider CSS imports dead code even if the
			// containing package claims to have no side effects.
			// Remove this when webpack adds a warning or an error for this.
			// See https://github.com/webpack/webpack/issues/6571
			sideEffects: true,
		},
		// Adds support for CSS Modules (https://github.com/css-modules/css-modules)
		// using the extension .module.css
		{
			test: cssModuleRegex,
			use: getStyleLoaders(
				{
					importLoaders: 1,
					sourceMap: isEnvProduction
						? shouldUseSourceMap
						: isEnvDevelopment,
					modules: {
						mode: "local",
						getLocalIdent: getCSSModuleLocalIdent,
					},
				},
				{
					isEnvDevelopment,
					isEnvProduction,
					shouldUseSourceMap,
					publicUrlOrPath,
					appSrc,
				}
			),
		},
		// Opt-in support for SASS (using .scss or .sass extensions).
		// By default we support SASS Modules with the
		// extensions .module.scss or .module.sass
		{
			test: sassRegex,
			exclude: sassModuleRegex,
			use: getStyleLoaders(
				{
					importLoaders: 3,
					sourceMap: isEnvProduction
						? shouldUseSourceMap
						: isEnvDevelopment,
					modules: {
						mode: "icss",
					},
				},
				{
					preProcessor: "sass-loader",
					isEnvDevelopment,
					isEnvProduction,
					shouldUseSourceMap,
					publicUrlOrPath,
					appSrc,
				}
			),
			// Don't consider CSS imports dead code even if the
			// containing package claims to have no side effects.
			// Remove this when webpack adds a warning or an error for this.
			// See https://github.com/webpack/webpack/issues/6571
			sideEffects: true,
		},
		// Adds support for CSS Modules, but using SASS
		// using the extension .module.scss or .module.sass
		{
			test: sassModuleRegex,
			use: getStyleLoaders(
				{
					importLoaders: 3,
					sourceMap: isEnvProduction
						? shouldUseSourceMap
						: isEnvDevelopment,
					modules: {
						mode: "local",
						getLocalIdent: getCSSModuleLocalIdent,
					},
				},
				{
					preProcessor: "sass-loader",
					isEnvDevelopment,
					isEnvProduction,
					shouldUseSourceMap,
					publicUrlOrPath,
					appSrc,
				}
			),
		},
	];
}
