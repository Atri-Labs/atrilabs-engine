const pluginTester = require("babel-plugin-tester/pure");
const jsxReplacePlugin = require("../src/babel/jsx-replace-local-with-global");

function replaceAll(map) {
  function createSnippet(map, prefix) {
    `import {Menu, Container, Tab} from "@atrilabs/core"

        function SomeLayer(){
          let a = 5;
            return <>
              <Menu name="${prefix}${map["menu"]}"></Menu>
              <Container name={"${prefix}${map["containers"]}"}></Container>
              {a > 10 ? <Tab name="${prefix}${map["tabs"]}"></Tab> : null}
              </>
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
  tests: {
    replaceAll: replaceAll({
      menu: "AppMenu",
      containers: "Canvas",
      tabs: "PropertyTab",
    }),
  },
});
