const appForestPkgId = "@atrilabs/app-design-forest/src/index.ts";

const forests = {
  [appForestPkgId]: [
    {
      modulePath: "@atrilabs/app-design-forest/src/componentTree",
    },
    {
      modulePath: "@atrilabs/app-design-forest/src/cssTree",
    },
    {
      modulePath: "@atrilabs/app-design-forest/src/customPropsTree",
    },
    {
      modulePath: "@atrilabs/app-design-forest/src/callbackHandlerTree",
    },
  ],
};

const clients = {
  eventClient: {
    // needed in import format
    modulePath: "@atrilabs/server-client/lib/websocket/client",
  },
};

const manifestSchema = [
  { pkg: "@atrilabs/component-icon-manifest-schema" },
  { pkg: "@atrilabs/react-component-manifest-schema" },
];

const layers = [
  { pkg: "@atrilabs/base-layer" },
  { pkg: "@atrilabs/app-design-layer" },
  { pkg: "@atrilabs/atri-icon-layer" },
  { pkg: "@atrilabs/app-page-layer" },
  { pkg: "@atrilabs/canvas-breakpoint-layer" },
  { pkg: "@atrilabs/component-list-layer" },
  { pkg: "@atrilabs/component-style-layer" },
  { pkg: "@atrilabs/custom-props-layer" },
  { pkg: "@atrilabs/asset-manager-layer" },
  { pkg: "@atrilabs/action-layer" },
  { pkg: "@atrilabs/resource-processor-layer" },
  { pkg: "@atrilabs/pwa-canvas-layer" },
];

const runtimes = [];

const manifestDirs = [{ pkg: "@atrilabs/react-component-manifests" }];

const shared = [{ pkg: "@atrilabs/shared-layer-lib" }];

module.exports = {
  forests,
  clients,
  manifestSchema,
  layers,
  runtimes,
  manifestDirs,
  shared,
};
