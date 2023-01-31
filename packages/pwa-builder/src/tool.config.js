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

module.exports = {
  forests,
  clients,
};
