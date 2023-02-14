export default function setAssetLoaders() {
	return [
		{
			// Exclude `js` files to keep "css" loader working as it injects
			// its runtime that would otherwise be processed through "file" loader.
			// Also exclude `html` and `json` extensions so they get processed
			// by webpacks internal loaders.
			exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
			type: "asset/resource",
		},
	];
}
