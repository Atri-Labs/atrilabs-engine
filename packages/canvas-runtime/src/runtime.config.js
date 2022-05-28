module.exports = {
  modulePath: "./index",
  exposes: {},
  requires: {
    containers: {
      Canvas: "Canvas",
      PlaygroundOverlayContainer: "PlaygroundOverlayContainer",
    },
  },
  manifestSchema: [{ pkg: "@atrilabs/react-component-manifest-schema" }],
};
