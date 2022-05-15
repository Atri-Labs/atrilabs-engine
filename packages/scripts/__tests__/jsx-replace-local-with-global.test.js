const pluginTester = require("babel-plugin-tester/pure");
const jsxReplacePlugin = require("../src/babel/jsx-replace-local-with-global");

function replaceAll(map) {
  function createSnippet(map, prefix) {
    return `
    import { Menu, Container, Tab } from "@atrilabs/core";

    function SomeLayer() {
      let a = 5;
      return <>
            <Menu name="${prefix}${map["menu"]}"></Menu>
            <Container name={"${prefix}${map["containers"]}"}></Container>
            {a > 10 ? <Tab name="${prefix}${map["tabs"]}"></Tab> : null}
            </>;
    }`;
  }
  const code = createSnippet(map, "Local");
  const output = createSnippet(map, "Global");
  return { code, output };
}

function replaceAllLocalName(map) {
  function createSnippet(map, prefix) {
    return `
    import { Menu as SomeMenu, Container as SomeContainer, Tab } from "@atrilabs/core";

    function SomeLayer() {
      let a = 5;
      return <>
            <SomeMenu name="${prefix}${map["menu"]}"></SomeMenu>
            <SomeContainer name={"${prefix}${map["containers"]}"}></SomeContainer>
            {a > 10 ? <Tab name="${prefix}${map["tabs"]}"></Tab> : null}
            </>;
    }`;
  }
  const code = createSnippet(map, "Local");
  const output = createSnippet(map, "Global");
  return { code, output };
}

pluginTester.default({
  plugin: jsxReplacePlugin,
  pluginOptions: {
    getNameMap: () => {
      return {
        menu: { LocalAppMenu: "GlobalAppMenu" },
        containers: { LocalCanvas: "GlobalCanvas" },
        tabs: { LocalPropertyTab: "GlobalPropertyTab" },
      };
    },
  },
  snapshot: false,
  pluginName: "jsx-replace-local-with-global",
  tests: {
    replaceAll: replaceAll({
      menu: "AppMenu",
      containers: "Canvas",
      tabs: "PropertyTab",
    }),
    replaceAllLocalName: replaceAllLocalName({
      menu: "AppMenu",
      containers: "Canvas",
      tabs: "PropertyTab",
    }),
  },
  babelOptions: { plugins: ["@babel/plugin-syntax-jsx"] },
});
