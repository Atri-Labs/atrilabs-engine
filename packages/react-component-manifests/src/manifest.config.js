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
  },
};
