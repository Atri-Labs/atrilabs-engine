const appForestPkgId = "@atrilabs/app-design-forest";

const forests = {
  [appForestPkgId]: [
    {
      modulePath: "@atrilabs/app-design-forest/lib/componentTree.js",
    },
    {
      modulePath: "@atrilabs/app-design-forest/lib/cssTree.js",
    },
    {
      modulePath: "@atrilabs/app-design-forest/lib/customPropsTree.js",
    },
    {
      modulePath: "@atrilabs/app-design-forest/lib/callbackHandlerTree.js",
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
  { pkg: "@atrilabs/load-forest-data-layer" },
  { pkg: "@atrilabs/app-design-layer" },
  { pkg: "@atrilabs/atri-icon-layer" },
  { pkg: "@atrilabs/app-page-layer" },
  { pkg: "@atrilabs/canvas-breakpoint-layer" },
  { pkg: "@atrilabs/component-list-layer" },
  { pkg: "@atrilabs/manage-canvas-runtime-layer" },
  { pkg: "@atrilabs/component-style-layer" },
  { pkg: "@atrilabs/overlay-hints-layer" },
  { pkg: "@atrilabs/publish-app-layer" },
  { pkg: "@atrilabs/custom-props-layer" },
  { pkg: "@atrilabs/asset-manager-layer" },
  { pkg: "@atrilabs/app-template-layer" },
  { pkg: "@atrilabs/action-layer" },
  { pkg: "@atrilabs/resource-processor-layer" },
  { pkg: "@atrilabs/undo-redo-layer" },
  { pkg: "@atrilabs/component-navigator" },
  { pkg: "@atrilabs/services-status-layer" },
  { pkg: "@atrilabs/pwa-canvas-layer" },
];

const runtimes = [{ pkg: "@atrilabs/canvas-runtime" }];

const manifestDirs = [{ pkg: "@atrilabs/react-component-manifests" }];

module.exports = {
  forests,
  clients,
  manifestSchema,
  layers,
  runtimes,
  manifestDirs,
};
