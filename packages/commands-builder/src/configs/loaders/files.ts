export default function setFileLoaders() {
	return [
		{
			test: /\.(jpg|png|svg|gif|pdf)$/,
			loader: "file-loader",
			options: {
				name: "[path][name].[ext]",
			},
		},
	];
}
