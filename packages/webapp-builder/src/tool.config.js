const forestsConfig = {
  page: [
    {
      pkg: "@atrilabs/basic-trees",
      modulePath: "lib/componentTree.js",
      name: "componentTree",
    },
    {
      pkg: "@atrilabs/basic-trees",
      modulePath: "lib/cssTree.js",
      name: "cssTree",
    },
  ],
};

module.exports = {
  forests: forestsConfig,
  forestManager: {
    path: require.resolve(
      "@atrilabs/forest/lib/implementations/lowdb/LowDbForestManager"
    ),
    options: {
      forestDir: "",
      forestsConfig: forestsConfig,
    },
  },
  layers: [
    { pkg: "@atrilabs/base-layer" },
    { pkg: "@atrilabs/app-design-layer" },
    { pkg: "@atrilabs/atri-icon-layer" },
    { pkg: "@atrilabs/app-page-layer" },
  ],
  output: "lib",
  services: {
    eventServer: {
      path: require.resolve("@atrilabs/server-client/lib/websocket/server"),
    },
    codeGenerators: [],
  },
};
