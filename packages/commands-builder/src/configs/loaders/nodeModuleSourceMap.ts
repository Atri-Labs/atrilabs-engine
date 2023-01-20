import { RuleSetRule } from "webpack";

export default function setNodeModuleSourceMapLoaders(options: {
	shouldUseSourceMap: boolean;
}): RuleSetRule[] {
	const { shouldUseSourceMap } = options;
	return shouldUseSourceMap // Handle node_modules packages that contain sourcemaps
		? [
				{
					enforce: "pre" as "pre",
					exclude: /@babel(?:\/|\\{1,2})runtime/,
					test: /\.(js|mjs|jsx|ts|tsx|css)$/,
					loader: require.resolve("source-map-loader"),
				},
		  ]
		: [];
}
