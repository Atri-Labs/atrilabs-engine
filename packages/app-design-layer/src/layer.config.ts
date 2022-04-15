export default {
  modulePath: "./index",
  exports: {
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
