const path = require("path");

const appForestPkgId = "@atrilabs/app-design-forest";

const forestsConfig = {
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

// path pointing to process.cwd
const compileAppOutputDir = process.cwd();
const defaultTemplateDir = "./templates";
const userTemplateDir = "atri_templates";
const resourceDir = "./localdb/resources";

const EVENT_SERVER_PORT = process.env["EVENT_SERVER_PORT"]
  ? parseInt(process.env["EVENT_SERVER_PORT"])
  : 4001;
const FILE_SERVER_PORT = process.env["FILE_SERVER_PORT"]
  ? parseInt(process.env["FILE_SERVER_PORT"])
  : 4002;
const FILE_SERVER_CLIENT = `http://localhost:${FILE_SERVER_PORT}`;
const EVENT_SERVER_CLIENT = `http://localhost:${EVENT_SERVER_PORT}`;
const MANIFEST_SERVER_PORT = process.env["MANIFEST_SERVER_PORT"]
  ? parseInt(process.env["MANIFEST_SERVER_PORT"])
  : 4003;
const MANIFEST_SERVER_CLIENT = `http://localhost:${MANIFEST_SERVER_PORT}`;
const PUBLISH_SERVER_PORT = process.env["PUBLISH_SERVER_PORT"]
  ? parseInt(process.env["PUBLISH_SERVER_PORT"])
  : 4004;
const PUBLISH_SERVER_CLIENT = `http://localhost:${PUBLISH_SERVER_PORT}`;
const IPC_SERVER_PORT = process.env["IPC_SERVER_PORT"]
  ? parseInt(process.env["IPC_SERVER_PORT"])
  : 4006;
const IPC_SERVER_CLIENT = `http://localhost:${IPC_SERVER_PORT}`;

// mode can be component_development, development, production
const MODE = process.env["MODE"];
// INSIDE_EDITOR is use by components like Modal to have slightly
// different behavior inside & outside editor
const INSIDE_EDITOR = "true";

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
    { pkg: "@atrilabs/publish-app-layer" },
    { pkg: "@atrilabs/custom-props-layer" },
    { pkg: "@atrilabs/asset-manager-layer" },
    { pkg: "@atrilabs/app-template-layer" },
    { pkg: "@atrilabs/action-layer" },
    { pkg: "@atrilabs/resource-processor-layer" },
    { pkg: "@atrilabs/undo-redo-layer" },
    { pkg: "@atrilabs/component-navigator" },
    { pkg: "@atrilabs/services-status-layer" },
  ],
  output: "lib",
  services: {
    fileServer: {
      path: require.resolve("@atrilabs/server-client/lib/file-server"),
      options: {
        dir: path.resolve(__dirname, "..", "lib"),
        port: FILE_SERVER_PORT,
      },
    },
    eventServer: {
      path: require.resolve("@atrilabs/server-client/lib/websocket/server"),
      options: {
        port: EVENT_SERVER_PORT,
      },
    },
    manifestServer: {
      path: require.resolve("@atrilabs/server-client/lib/manifest/server"),
      options: {
        port: MANIFEST_SERVER_PORT,
      },
    },
    publishServer: {
      path: require.resolve("@atrilabs/server-client/lib/publish-app/server"),
      options: {
        port: PUBLISH_SERVER_PORT,
      },
    },
    ipcServer: {
      path: require.resolve("@atrilabs/server-client/lib/ipc-server/server"),
      options: {
        port: IPC_SERVER_PORT,
      },
    },
  },
  targets: [
    {
      targetName: "Web App",
      hint: "A React App that supports SSR",
      description: "A React App that supports SSR",
      tasksHandler: {
        modulePath: require.resolve("@atrilabs/app-generator/lib/index.js"),
      },
      options: {
        appForestPkgId,
        outputDir: `${compileAppOutputDir}/atri_app`,
        controllers: {
          python: {
            dir: `${compileAppOutputDir}/controllers`,
            stubGenerators: [
              {
                modulePath:
                  "@atrilabs/component-tree-to-app/lib/pythonStubGenerator.js",
                options: {},
              },
            ],
          },
        },
        rootComponentId: "body",
        components: [
          {
            modulePath:
              "@atrilabs/component-tree-to-app/lib/componentTreeToComponentDef.js",
            options: {},
          },
        ],
        props: [
          {
            modulePath:
              "@atrilabs/component-tree-to-app/lib/childTreeToProps.js",
            options: {},
          },
        ],
        callbacks: [
          {
            modulePath:
              "@atrilabs/component-tree-to-app/lib/handlerTreeToCallbacks.js",
            options: {},
          },
        ],
        resources: [
          {
            modulePath:
              "@atrilabs/component-tree-to-app/lib/resourceGenerator.js",
            options: {},
          },
        ],
      },
    },
  ],
  clients: {
    eventClient: {
      // needed in import format
      modulePath: "@atrilabs/server-client/lib/websocket/client",
    },
  },
  env: {
    EVENT_SERVER_CLIENT,
    MANIFEST_SERVER_CLIENT,
    PUBLISH_SERVER_CLIENT,
    IPC_SERVER_CLIENT,
    MODE,
    INSIDE_EDITOR,
  },
  runtimes: [{ pkg: "@atrilabs/canvas-runtime" }],
  manifestClient: {
    path: require.resolve("@atrilabs/server-client/lib/manifest/client"),
    devPath: require.resolve("@atrilabs/server-client/lib/manifest/devClient"),
  },
  manifestSchema: [
    { pkg: "@atrilabs/component-icon-manifest-schema" },
    { pkg: "@atrilabs/react-component-manifest-schema" },
  ],
  manifestDirs: [{ pkg: "@atrilabs/react-component-manifests" }],
  devServerProxy: {
    hostname: FILE_SERVER_CLIENT,
  },
  assetManager: {
    urlPath: "/app-assets",
    assetsDir: `${compileAppOutputDir}/assets`,
  },
  templateManager: {
    defaultDirs: [defaultTemplateDir],
    dirs: [userTemplateDir],
  },
  resources: {
    path: resourceDir,
  },
};
