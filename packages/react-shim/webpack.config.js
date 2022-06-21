const path = require("path");

module.exports = {
  mode: "production",
  entry: "./lib/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    library: "manifestcomps",
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            use: [
              {
                loader: require.resolve("babel-loader"),
                options: {
                  presets: ["@babel/preset-env"],
                  babelrc: false,
                  configFile: false,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
};
