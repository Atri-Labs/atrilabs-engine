export default function setJsxLoaders() {
  return [
    // Process any JS outside of the app with Babel.
    // Unlike the application JS, we only compile the standard ES features.
    {
      test: /\.(js|mjs)$/,
      exclude: /@babel(?:\/|\\{1,2})runtime/,
      loader: require.resolve("swc-loader"),
      options: {
        sync: true,
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    },
  ];
}
