const path = require("path");

const forestsConfig = {
  "@atrilabs/app-design-forest": [
    {
      modulePath: "@atrilabs/app-design-forest/lib/componentTree.js",
    },
    {
      modulePath: "@atrilabs/app-design-forest/lib/cssTree.js",
    },
  ],
};

module.exports = {
  pkgManager: "yarn",
  forests: forestsConfig,
  forestManager: {
    path: require.resolve(
      "@atrilabs/forest/lib/implementations/lowdb/LowDbForestManager"
    ),
    options: {
      forestDir: "localdb",
      forestsConfig: forestsConfig,
    },
  },
  layers: [
    { pkg: "@atrilabs/base-layer" },
    { pkg: "@atrilabs/load-forest-data-layer" },
    { pkg: "@atrilabs/app-design-layer" },
    { pkg: "@atrilabs/atri-icon-layer" },
    { pkg: "@atrilabs/app-page-layer" },
    { pkg: "@atrilabs/canvas-breakpoint-layer" },
    { pkg: "@atrilabs/component-list-layer" },
    { pkg: "@atrilabs/manage-canvas-runtime-layer" },
    { pkg: "@atrilabs/component-style-layer" },
    { pkg: "@atrilabs/overlay-hints-layer" },
  ],
  output: "lib",
  services: {
    fileServer: {
      path: require.resolve("@atrilabs/server-client/lib/file-server"),
      options: {
        dir: path.resolve("lib"),
      },
    },
    eventServer: {
      path: require.resolve("@atrilabs/server-client/lib/websocket/server"),
    },
    codeGenerators: [],
    manifestServer: {
      path: require.resolve("@atrilabs/server-client/lib/manifest/server"),
      options: {
        port: 4003,
      },
    },
  },
  clients: {
    eventClient: {
      modulePath: require.resolve(
        "@atrilabs/server-client/lib/websocket/client"
      ),
    },
  },
  env: {
    EVENT_SERVER_CLIENT: "http://localhost:4001",
    MANIFEST_SERVER_CLIENT: "http://localhost:4003",
  },
  runtimes: [{ pkg: "@atrilabs/canvas-runtime" }],
  manifestClient: {
    path: require.resolve("@atrilabs/server-client/lib/manifest/client"),
  },
  manifestSchema: [
    { pkg: "@atrilabs/component-icon-manifest-schema" },
    { pkg: "@atrilabs/react-component-manifest-schema" },
  ],
  manifestDirs: [{ pkg: "@atrilabs/react-component-manifests" }],
};
