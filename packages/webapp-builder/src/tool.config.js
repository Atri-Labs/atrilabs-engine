module.exports = {
  forests: {
    page: [
      {
        pkg: "@atrilabs/web-app-canvas",
        modulePath: "./componentTree",
        name: "componentTree",
      },
      {
        pkg: "@atrilabs/web-app-css",
        modulePath: "./cssTree",
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
