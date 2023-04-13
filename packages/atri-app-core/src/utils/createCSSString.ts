import type { TreeNode } from "@atrilabs/forest";
import postcss from "postcss";
const cssjs = require("postcss-js");

function jssToCss(jss: React.CSSProperties) {
  return postcss()
    .process(jss, { parser: cssjs, from: undefined })
    .then((code) => {
      return code.css + ";";
    });
}

async function createStyleString(
  cssSelector: string,
  styles: React.CSSProperties
) {
  const cssStr = await jssToCss(styles);
  return `${cssSelector} {\n${cssStr}\n}`;
}

async function createBreakpointString(
  cssSelector: string,
  styles: React.CSSProperties,
  breakpoint: string
) {
  return `@media only screen and (max-width: ${breakpoint}px) {\n${await createStyleString(
    cssSelector,
    styles
  )}\n}`;
}

/**
 * const a = {
              slice: {
                breakpoints: {
                  "1200": {
                    property: {
                      styles: {
                        background:
                          "linear-gradient(45deg, white 0%, red 100%)",
                      },
                    },
                  },
                },
              },
            };
 * @param styles 
 * @param breakpoints 
 */
export async function createCSSString(
  cssSelector: string,
  styles: React.CSSProperties,
  breakpoints: { [breakpoint: string]: React.CSSProperties }
) {
  const cssStrs = Promise.all([
    createStyleString(cssSelector, styles),
    ...Object.keys(breakpoints).map((breakpoint) =>
      createBreakpointString(cssSelector, breakpoints[breakpoint], breakpoint)
    ),
  ]);

  return cssStrs;
}

export async function extractStylesFromStyleNode(cssNode: TreeNode) {
  const breakpoints: { [breakpoint: string]: React.CSSProperties } = {};
  if (cssNode.state["property"]?.["breakpoints"]) {
    Object.keys(cssNode.state["property"]["breakpoints"]).forEach(
      (breakpoint) => {
        breakpoints[breakpoint] =
          cssNode.state["property"]["breakpoints"]["property"]["styles"];
      }
    );
  }

  return { styles: cssNode.state["property"]?.["styles"] || {}, breakpoints };
}
