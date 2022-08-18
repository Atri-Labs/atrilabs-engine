/**
 *
 * IMPORTANT NOTE:
 *
 * Provide the unset value, not the default value.
 *
 */
// default CSS values for Layout
const Layout: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "flex-start",
  flexWrap: "nowrap",
  alignContent: "stretch",
  // NOTE: the default value is normal, but, we allow
  // values only in px. In such scenarios we will be setting
  // empty string as default value until we have a better approach.
  rowGap: "",
  columnGap: "",
};

// default CSS values for Flex Child
const FlexChild: React.CSSProperties = {
  alignSelf: "auto",
  flexGrow: "0",
  flexShrink: "1",
  order: "0",
};

// default CSS values for padding and margin
const SpacingOptions: React.CSSProperties = {
  marginTop: "0",
  marginBottom: "0",
  marginRight: "0",
  marginLeft: "0",
  paddingTop: "0",
  paddingBottom: "0",
  paddingRight: "0",
  paddingLeft: "0",
};

// default CSS values for width & height
const SizeOptions: React.CSSProperties = {
  // NOTE: The default value is auto,
  // but, we are setting empty string
  width: "",
  height: "",
  minWidth: "0",
  minHeight: "0",
  // NOTE: The default value is none,
  // but, we are setting empty string
  maxWidth: "",
  maxHeight: "",
};

// default CSS values for typography
const TypographyOptions: React.CSSProperties = {
  fontFamily: "",
  // NOTE: default value is normal
  fontWeight: 400,
  // NOTE: default value is medium
  fontSize: "",
  textAlign: "left",
  // NOTE: default value for color is not specified
  color: "",
  opacity: "1",
};

const BorderOptions: React.CSSProperties = {
  borderRadius: "0",
  // NOTE: default value is medium
  borderWidth: "",
  borderStyle: "none",
  // NOTE: default value is current color of the element
  borderColor: "",
};

const BackgroundOptions: React.CSSProperties = {
  backgroundImage: "",
  backgroundColor: "",
};

const PositionOptions: React.CSSProperties = {
  position: "static",
  float: "none",
  clear: "none",
  // NOTE: default value is auto
  top: "",
  // NOTE: default value is auto
  left: "",
  // NOTE: default value is auto
  bottom: "",
  // NOTE: default value is auto
  right: "",
  // NOTE: default value is auto
  zIndex: "",
};

export const FlexStyle: React.CSSProperties = {
  ...Layout,
  ...FlexChild,
  ...SpacingOptions,
  ...SizeOptions,
  ...TypographyOptions,
  ...BorderOptions,
  ...BackgroundOptions,
  ...PositionOptions,
};

export const FlexChildStyle: React.CSSProperties = {
  ...FlexChild,
  ...SpacingOptions,
  ...SizeOptions,
  ...TypographyOptions,
  ...BorderOptions,
  ...BackgroundOptions,
  ...PositionOptions,
};

export const keyPropMap: any = {
  Flex: {
    styles: { ...FlexStyle },
  },
  Button: {
    styles: { ...FlexChildStyle },
    custom: { text: "" },
  },
  Input: {
    styles: { ...FlexChildStyle },
    custom: { value: "", placeholder: "" },
  },
  Image: {
    styles: { ...FlexChildStyle },
    custom: { alt: "No preview available", src: "" },
  },
  Upload: {
    styles: { ...FlexStyle },
    custom: {
      multiple: false,
      showFilename: true,
      text: "Upload",
      disabled: false,
    },
  },
  Accordion: {
    styles: { ...FlexChildStyle },
    custom: { title: [], description: [], open: [] },
  },
  Carousel: {
    styles: { ...FlexChildStyle },
    custom: { items: [], startTile: 0, imageItems: [] },
  },
  Countdown: {
    styles: { ...FlexChildStyle },
    custom: {
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      frozen: true,
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
    },
  },
  Link: {
    styles: { ...FlexChildStyle },
    custom: { text: "Link", url: "/" },
  },
  Radio: {
    styles: { ...FlexStyle },
    custom: { name: "", label: "Radio", checked: false },
  },
  Slider: {
    styles: { ...FlexChildStyle },
    custom: { startValue: 0, endValue: 100, value: 50 },
  },
  Step: {
    styles: { ...FlexChildStyle },
    custom: { color: "#336699", current: 1, title: [], description: [] },
  },
  TextBox: {
    styles: { ...FlexChildStyle },
    custom: { text: "Your text Here!" },
  },
  Toggle: {
    styles: { ...FlexChildStyle },
    custom: { activeColor: "#2196f3", active: false, inactiveColor: "#CCCCCC" },
  },
  Menu: {
    styles: { ...FlexStyle },
    custom: {
      open: true,
      iconHeight: 24,
      iconWidth: 24,
      src: "",
      strokeColor: "",
      gap: 0,
      alignRight: false,
    },
  },
  AreaChart: {
    styles: { ...SizeOptions },
    custom: {
      cartesianGrid: { show: false, strokeDasharray: "" },
      data: [],
      xAxis: { show: false, key: "" },
      yAxis: { show: false },
      toolTip: { show: false },
      legend: { show: false },
      options: {},
    },
  },
  BarChart: {
    styles: { ...SizeOptions },
    custom: {
      cartesianGrid: { show: false, strokeDasharray: "" },
      data: [],
      xAxis: { show: false, key: "" },
      yAxis: { show: false },
      toolTip: { show: false },
      legend: { show: false },
      stacked: false,
      options: {},
    },
  },
  CandleStick: {
    styles: { ...SizeOptions },
    custom: {
      data: [],
      cartesianGrid: { show: false, strokeDasharray: "" },
      animate: false,
      options: {
        whisker: {
          fill: "",
          stroke: "",
          strokeWidth: "",
          strokeDasharray: "",
        },
        box: {
          fill: "",
        },
        dot: {
          fill: "",
          stroke: "",
        },
      },
      toolTip: { show: false },
      legend: { show: false },
      xAxis: { show: false },
      yAxis: { show: false },
    },
  },
  HistogramChart: {
    styles: { ...SizeOptions },
    custom: {
      cartesianGrid: { show: false, strokeDasharray: "" },
      data: [],
      xAxis: { show: false, key: "" },
      yAxis: { show: false, key: "" },
      options: { line: { type: "", strokeWidth: 0 } },
      toolTip: { show: false },
      legend: { show: false },
    },
  },
  LineChart: {
    styles: { ...SizeOptions },
    custom: {
      cartesianGrid: { show: false, strokeDasharray: "" },
      data: [],
      xAxis: { show: false, key: "" },
      yAxis: { show: false },
      toolTip: { show: false },
      legend: { show: false },
      options: {},
    },
  },
  PieChart: {
    styles: { ...SizeOptions },
    custom: {
      data: [],
      toolTip: { show: false },
      legend: { show: false },
      options: [],
      keys: { value: "" },
    },
  },
  ScatterChart: {
    styles: { ...SizeOptions },
    custom: {
      cartesianGrid: { show: false, strokeDasharray: "" },
      data: [],
      xAxis: { show: false, key: "", name: "", unit: "" },
      yAxis: { show: false, key: "", name: "", unit: "" },
      zAxis: { show: false, key: "", name: "", unit: "" },
      toolTip: { show: false },
      legend: { show: false },
      options: [],
    },
  },
  Checkbox: {
    styles: { ...FlexChild, ...PositionOptions, ...SpacingOptions },
    custom: {
      checked: false,
    },
  },
  Dropdown: {
    styles: { ...FlexChildStyle },
    custom: {
      values: [],
      selectedValue: "",
      displayedValues: [],
      disabled: false,
    },
  },
  Table: {
    styles: { ...FlexChildStyle },
    custom: {
      rows: [],
      cols: [],
      checkboxSelection: false,
      autoHeight: false,
      numRows: 10,
      rowHeight: 20,
      selection: [],
    },
  },
};
