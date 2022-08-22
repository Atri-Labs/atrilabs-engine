const cssTree = require("css-tree");

const ast = cssTree.parse(`@font-face {
  font-family: Roboto;
  font-style: italic;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TzBic3CsTYl4BOQ3o.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}`);
cssTree.walk(ast, {
  enter: (node) => {
    if (node.type === "Atrule" && node.name === "font-face") {
      const currentFontImport = {};
      cssTree.walk(node, {
        enter: () => {
          cssTree.walk(node, {
            enter: (node) => {
              if (
                node.type === "Declaration" &&
                node.property === "font-family"
              ) {
                if (
                  node.value &&
                  node.value.children &&
                  node.value.children.head &&
                  node.value.children.head.data &&
                  node.value.children.head.data.value
                ) {
                  currentFontImport.fontFamily =
                    node.value.children.head.data.value;
                } else {
                  cssTree.walk(node, {
                    visit: "Identifier",
                    enter: (identifierNode) => {
                      currentFontImport.fontFamily = identifierNode.name;
                    },
                  });
                }
              }
              if (
                node.type === "Declaration" &&
                node.property === "font-weight"
              ) {
                if (
                  node.value &&
                  node.value.children &&
                  node.value.children.head &&
                  node.value.children.head.data &&
                  node.value.children.head.data.value
                ) {
                  if (node.value.children.head.data.type === "String")
                    currentFontImport.fontWeight =
                      node.value.children.head.data.value;
                  else if (node.value.children.head.data.type === "Number") {
                    currentFontImport.fontWeight = parseInt(
                      node.value.children.head.data.value
                    );
                  }
                } else {
                  cssTree.walk(node, {
                    visit: "Identifier",
                    enter: (identifierNode) => {
                      currentFontImport.fontWeight = identifierNode.name;
                    },
                  });
                }
              }
              if (
                node.type === "Declaration" &&
                node.property === "font-style"
              ) {
                cssTree.walk(node, {
                  visit: "Identifier",
                  enter: (identifierNode) => {
                    currentFontImport.fontStyle = identifierNode.name;
                  },
                });
              }
            },
          });
        },
      });
      console.log(JSON.stringify(currentFontImport, null, 2));
    }
  },
});
