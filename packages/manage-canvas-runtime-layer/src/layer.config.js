module.exports = {
  modulePath: "./index",
  requires: {},
  exposes: {
    menu: {
      BaseHeaderMenu: "BaseHeaderMenu",
      BaseFooterMenu: "BaseFooterMenu",
    },
    containers: {
      Logo: "Logo",
      BaseContainer: "BaseContainer",
      OverlayContainer: "OverlayContainer",
    },
  },
  decorators: [],
  runtime: { pkg: "@atrilabs/canvas-runtime" },
  manifestSchema: [{ pkg: "@atrilabs/react-component-manifest-schema" }],
};
