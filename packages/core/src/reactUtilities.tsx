import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { load } from "cheerio";
import { Portals } from "./types";

export const GlobalContext = React.createContext<{
  // window can be undefined in NodeJS context
  window: Window | undefined;
  // portals can be undefined in browser's context
  portals: Portals | undefined;
}>({
  window,
  portals: undefined,
});

export function isRunningInBrowser() {
  return window !== undefined;
}

/**
 * This throws an error when used in the generated app
 * @returns
 */
export function isRunningInEditor() {
  try {
    return process.env["ATRI_TOOL_INSIDE_EDITOR"] === "true" ?? false;
  } catch (err) {
    return false;
  }
}
/**
 * Always render component immidiately if inside editor otherwise render after useEffect
 * @param node
 * @param window
 * @param selector
 * @param portals
 * @returns
 */
export function createPortal(
  node: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
  window: Window | undefined,
  selector: string,
  portals: Portals | undefined
) {
  if (window === undefined) {
    if (Array.isArray(portals)) portals.push({ node, selector });
    return null;
  }
  if (window.document.querySelector(selector) === null) {
    console.log(`Cannot find selector ${selector}`);
    return null;
  }
  const [renderPortals, setRenderPortals] = useState(false);
  useEffect(() => {
    setRenderPortals(true);
  }, []);

  return isRunningInEditor()
    ? ReactDOM.createPortal(node, window.document.querySelector(selector)!)
    : renderPortals
    ? ReactDOM.createPortal(node, window.document.querySelector(selector)!)
    : null;
}

export function addPortalsToHtml(html: string, portals: Portals) {
  const root = load(html);
  portals.forEach(({ node, selector }) => {
    root(selector).append(ReactDOMServer.renderToString(node));
  });
  return root.html();
}
