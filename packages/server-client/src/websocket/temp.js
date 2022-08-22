const cssTree = require("css-tree");

const ast = cssTree.parse(`@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TzBic3CsTYl4BOQ3o.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}`);
cssTree.walk(ast, {
  enter: (node) => {
    if (node.type === "Atrule" && node.name === "font-face") {
      cssTree.walk(node, {
        enter: () => {
          console.log("subtree entered");
        },
      });
    }
  },
});
