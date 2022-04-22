module.exports = {
  modulePath: "./index",
  requires: {
    menu: {
      BaseHeaderMenu: "BaseHeaderMenu",
    },
    containers: {
      BaseContainer: "BaseContainer",
    },
  },
  exposes: {
    menu: {
      AppMenu: "AppMenu",
      PageMenu: "PageMenu",
      CanvasMenu: "CanvasMenu",
      PublishMenu: "PublishMenu",
    },
    containers: {
      Canvas: "Canvas",
    },
    tabs: { PropertiesTab: "PropertiesTab" },
  },
  decorators: [],
};
