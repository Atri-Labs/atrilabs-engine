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
  Div: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Flex: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Input: {
    onChange: {
      handlers: [],
      actions: [{ type: "controlled", selector: ["custom", "value"] }],
    },
    onPressEnter: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  TextBox: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Image: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
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
    onFinish: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Step: {},
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
  LineChart: {},
  AreaChart: {},
  BarChart: {},
  CandleStick: {},
  HistogramChart: {},
  PieChart: {},
  ScatterChart: {},
  Checkbox: {
    onChange: {
      handlers: [],
      actions: [{ type: "controlled", selector: ["custom", "checked"] }],
    },
  },
  Dropdown: {
    onChange: {
      handlers: [],
      actions: [{ type: "controlled", selector: ["custom", "selectedValue"] }],
    },
  },
  Table: {
    onSelectionChange: {
      handlers: [],
      actions: [{ type: "controlled", selector: ["custom", "selection"] }],
    },
  },
  Modal: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Overlay: {},
  UnorderedList: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Testimonial: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Rating: {},
  VerticalMenu: {
    onClick: {
      handlers: [],
      actions: [{ type: "controlled", selector: ["custom", "open"] }],
    },
  },
  Icon: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Form: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  CountUp: {},
  Cascader: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Breadcrumb: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
  Alert: {
    onClick: {
      handlers: [],
      actions: [{ type: "do_nothing" }],
    },
  },
};
