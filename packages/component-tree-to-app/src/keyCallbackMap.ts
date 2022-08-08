export const keyCallbackMap: {
  [key: string]: {
    [callbackName: string]: {
      /**
       * handlers are collected from callbackHandlerTree & defaultCallbackHandlers
       */
      handlers: any[];
      /**
       * actions come directly from the manifest
       */
      actions: any[];
    };
  };
} = {
  Button: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Flex: {},
  Input: {
    onChange: {
      handlers: [],
      actions: [{ type: "controlled", selector: ["custom", "value"] }],
    },
  },
  Image: {},
  Upload: {
    onChange: {
      handlers: [],
      actions: [{ type: "file_input", selector: ["io", "files"] }],
    },
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Accordion: {
    onTitleClick: {
      handlers: [],
      actions: [{ type: "controlled", selector: ["custom", "open"] }],
    },
  },
  Carousel: {},
  Countdown: {},
  Link: {},
  Radio: {
    onChange: {
      handlers: [],
      actions: [{ type: "controlled", selector: ["custom", "checked"] }],
    },
  },
  Slider: {
    onChange: {
      handlers: [],
      actions: [{ type: "controlled", selector: ["custom", "value"] }],
    },
  },
  Step: {},
  TextBox: {},
  Toggle: {
    onChange: {
      handlers: [],
      actions: [{ type: "controlled", selector: ["custom", "active"] }],
    },
  },
  Menu: {
    onClick: {
      handlers: [],
      actions: [{ type: "controlled", selector: ["custom", "open"] }],
    },
  },
};
