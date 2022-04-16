export default {
  modulePath: "./index",
  requires: {
    menu: {
      BaseHeaderMenu: "BaseHeaderMenu",
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
