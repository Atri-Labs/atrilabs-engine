export default {
  modulePath: "./index",
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
