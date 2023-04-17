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
    ...Object.keys(breakpoints)
      .sort((a, b) => parseFloat(b) - parseFloat(a))
      .map((breakpoint) =>
        createBreakpointString(cssSelector, breakpoints[breakpoint], breakpoint)
      ),
  ]);

  return cssStrs;
}
