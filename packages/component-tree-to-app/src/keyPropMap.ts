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
    custom: { value: "" },
  },
  Image: {
    styles: { ...FlexChildStyle },
    custom: { alt: "No preview available", src: "" },
  },
  Upload: {
    styles: { ...FlexChildStyle },
    custom: { multiple: false },
  },
};
