/**
 *
 * IMPORTANT NOTE:
 *
 * Provide the unset value, not the default value.
 *
 */
const Display: React.CSSProperties = {
  display: "",
};
// default CSS values for Layout
const Layout: React.CSSProperties = {
  display: "",
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
  alignSelf: "",
  flexGrow: "",
  flexShrink: "",
  order: "",
};

// default CSS values for padding and margin
const SpacingOptions: React.CSSProperties = {
  marginTop: "",
  marginBottom: "",
  marginRight: "",
  marginLeft: "",
  paddingTop: "",
  paddingBottom: "",
  paddingRight: "",
  paddingLeft: "",
};

// default CSS values for width & height
const SizeOptions: React.CSSProperties = {
  // NOTE: The default value is auto,
  // but, we are setting empty string
  width: "",
  height: "",
  minWidth: "",
  minHeight: "",
  // NOTE: The default value is none,
  // but, we are setting empty string
  maxWidth: "",
  maxHeight: "",
  overflow: "",
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
  opacity: "",
  fontStyle: "",
};

const BorderOptions: React.CSSProperties = {
  borderRadius: "",
  // NOTE: default value is medium
  borderWidth: "",
  borderStyle: "",
  // NOTE: default value is current color of the element
  borderColor: "",
};

const BackgroundOptions: React.CSSProperties = {
  backgroundImage: "",
  backgroundColor: "",
  backgroundClip: "",
  backgroundOrigin: "",
  backgroundAttachment: "",
  backgroundPositionX: "",
  backgroundPositionY: "",
  backgroundRepeat: "",
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

const MiscOptions: React.CSSProperties = {
  outlineStyle: "",
  outlineColor: "",
  outlineOffset: "",
  outlineWidth: "",
  cursor: "",
  boxSizing: "content-box",
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
  ...MiscOptions,
};

export const FlexChildStyle: React.CSSProperties = {
  ...FlexChild,
  ...SpacingOptions,
  ...SizeOptions,
  ...TypographyOptions,
  ...BorderOptions,
  ...BackgroundOptions,
  ...PositionOptions,
  ...MiscOptions,
};

export const keyPropMap: any = {
  Div: { styles: { ...Display, ...FlexChildStyle } },
  Flex: {
    styles: { ...FlexStyle },
  },
  Button: {
    styles: { ...FlexChildStyle },
    custom: { text: "" },
  },
  Input: {
    styles: { ...FlexChildStyle },
    custom: { value: "", placeholder: "", isPasswordField: false },
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
    custom: { name: "", label: "Radio", checked: false, radius: "" },
  },
  Slider: {
    styles: { ...FlexChildStyle },
    custom: { minValue: 0, maxValue: 100, value: 50 },
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
      options: {},
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
      options: {},
      toolTip: { show: false },
      legend: { show: false },
      keys: { value: "" },
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
    styles: { ...FlexChildStyle },
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
  Modal: {
    styles: { ...FlexStyle },
    custom: {
      modalSize: "",
      okButtonColor: "",
      okButtonBgColor: "",
      okButtonBorderColor: "",
      cancelButtonColor: "",
      cancelButtonBgColor: "",
      cancelButtonBorderColor: "",
      closeModalAfter: 3000,
      open: false,
      body: "",
      title: "",
    },
  },
  Overlay: {
    styles: { ...FlexStyle },
    custom: {
      closeModalAfter: 0,
      open: false,
    },
  },
  UnorderedList: {},
  Testimonial: {},
  Rating: {},
  VerticalMenu: {},
  Icon: {},
  Form: {},
  CountUp: {},
  Cascader: {},
  Breadcrumb: {},
  Alert: {},
};
