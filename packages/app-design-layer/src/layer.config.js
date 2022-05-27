module.exports = {
  modulePath: "./index",
  requires: {
    menu: {
      BaseHeaderMenu: "BaseHeaderMenu",
    },
    containers: {
      BaseContainer: "BaseContainer",
      PlaygroundOverlayContainer: "PlaygroundOverlayContainer",
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
      Drop: "Drop",
    },
    tabs: { PropertiesTab: "PropertiesTab" },
  },
  decorators: [],
};
