export const keyCallbackMap: {
  [key: string]: {
    [callbackName: string]: { handlers: any[]; actions: any[] };
  };
} = {
  Button: {
    onClick: {
      /**
       * handlers are collected from callbackHandlerTree & defaultCallbackHandlers
       */
      handlers: [],
      /**
       * actions come directly from the manifest
       */
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
  },
  Accordion: {},
  Carousel: {},
  Countdown: {},
  Link: {},
  Radio: {},
  Slider: {},
  Step: {},
  TextBox: {},
  Toggle: {},
};
