module.exports = {
  forests: {
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
  },
  layers: [
    { pkg: "@atrilabs/base-layer" },
    { pkg: "@atrilabs/app-design-layer" },
    { pkg: "@atrilabs/atri-icon-layer" },
  ],
  output: "lib",
};
