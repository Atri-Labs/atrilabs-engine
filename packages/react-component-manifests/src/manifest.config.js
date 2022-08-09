module.exports = {
  dir: "manifests",
  manifestSchema: [
    { pkg: "@atrilabs/react-component-manifest-schema" },
    { pkg: "@atrilabs/component-icon-manifest-schema" },
  ],
  componentMap: {
    Button: {
      modulePath: "./src/manifests/Button/Button.tsx",
      exportedVarName: "Button",
    },
    Flex: {
      modulePath: "./src/manifests/Flex/Flex.tsx",
      exportedVarName: "Flex",
    },
    Input: {
      modulePath: "./src/manifests/Input/Input.tsx",
      exportedVarName: "Input",
    },
    Image: {
      modulePath: "./src/manifests/Image/Image.tsx",
      exportedVarName: "Image",
    },
    Upload: {
      modulePath: "./src/manifests/Upload/Upload.tsx",
      exportedVarName: "Upload",
    },
    Accordion: {
      modulePath: "./src/manifests/Accordion/Accordion.tsx",
      exportedVarName: "Accordion",
    },
    Carousel: {
      modulePath: "./src/manifests/Carousel/Carousel.tsx",
      exportedVarName: "Carousel",
    },
    Countdown: {
      modulePath: "./src/manifests/Countdown/Countdown.tsx",
      exportedVarName: "Countdown",
    },
    Link: {
      modulePath: "./src/manifests/Link/Link.tsx",
      exportedVarName: "Link",
    },
    Radio: {
      modulePath: "./src/manifests/Radio/Radio.tsx",
      exportedVarName: "Radio",
    },
    Slider: {
      modulePath: "./src/manifests/Slider/Slider.tsx",
      exportedVarName: "Slider",
    },
    Step: {
      modulePath: "./src/manifests/Step/Step.tsx",
      exportedVarName: "Step",
    },
    TextBox: {
      modulePath: "./src/manifests/TextBox/TextBox.tsx",
      exportedVarName: "TextBox",
    },
    Toggle: {
      modulePath: "./src/manifests/Toggle/Toggle.tsx",
      exportedVarName: "Toggle",
    },
    Menu: {
      modulePath: "./src/manifests/Menu/Menu.tsx",
      exportedVarName: "Menu",
    },
    LineChart: {
      modulePath: "./src/manifests/charts/LineChart/LineChart.tsx",
      exportedVarName: "LineChart",
    },
    BarChart: {
      modulePath: "./src/manifests/charts/BarChart/BarChart.tsx",
      exportedVarName: "BarChart",
    },
  },
};
