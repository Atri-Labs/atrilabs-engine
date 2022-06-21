module.exports = {
  modulePath: "./index",
  requires: {
    menu: {
      PageMenu: "PageMenu",
    },
    containers: {
      Drop: "Drop",
    },
  },
  exposes: {},
  decorators: [],
  runtime: { pkg: "@atrilabs/canvas-runtime" },
  manifestSchema: [{ pkg: "@atrilabs/component-icon-manifest-schema" }],
};
