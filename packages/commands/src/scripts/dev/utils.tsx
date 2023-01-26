import { Request } from "express";
import { matchRoutes } from "react-router-dom";
import chalk from "chalk";
import { renderToString } from "react-dom/server";
import path from "path";
import { SERVER_DIR } from "../../consts";
import {
  Document,
  MainAppContext,
  AtriScriptsContext,
} from "@atrilabs/atri-app-core";

/**
 * This request arrives when a page is requested
 * in the browser's search bar.
 * @param req
 * @returns
 */
export function isPageRequest(req: Request) {
  return (
    req.method.toLowerCase() === "get" &&
    (req.headers["accept"]
      ? req.headers["accept"].includes("text/html")
      : true) &&
    !req.originalUrl.startsWith("/favicon.ico") &&
    !req.originalUrl.startsWith("/serviceWorker.js") &&
    !req.originalUrl.startsWith("/atri") &&
    !req.originalUrl.match("hot-update") &&
    !req.originalUrl.match(".map")
  );
}

/**
 * This request arrives when a backend call is made.
 * @param req
 * @returns
 */
export function isApiRequest(req: Request) {
  return req.originalUrl.startsWith("/api");
}

/**
 * This request arrives when a Link component is clicked.
 * @param req
 */
export function isJSRequest(req: Request) {
  return (
    req.method.toLowerCase() === "get" && req.originalUrl.startsWith("/atri/js")
  );
}

export function isJSONRequest(req: Request) {
  return (
    req.originalUrl.toLowerCase() === "get" &&
    req.headers.accept?.startsWith("application/json")
  );
}

export function matchUrlPath(
  routeObjects: { path: string }[],
  originalUrl: string
) {
  return matchRoutes(routeObjects, originalUrl);
}

export function getRequestType(req: Request) {
  if (isPageRequest(req)) {
    return "page";
  }
  if (isJSRequest(req)) {
    return "js";
  }
  if (isApiRequest(req)) {
    return "api";
  }
  if (isJSONRequest(req)) {
    return "json";
  }
  return "unknown";
}

export function printRequest(req: Request) {
  const requestType = getRequestType(req);
  console.log(chalk.green(`${requestType} ${req.originalUrl}`));
}

export function getPageHtml(filepath: string[]) {
  // @ts-ignore
  delete __non_webpack_require__.cache[
    // @ts-ignore
    __non_webpack_require__.resolve(path.resolve(SERVER_DIR, ...filepath))
  ];
  // @ts-ignore
  const mod = __non_webpack_require__(path.resolve(SERVER_DIR, ...filepath));
  if (filepath[filepath.length - 1] === "") {
    filepath[filepath.length - 1] = "index";
  }
  const ComponentFn = mod.default;
  const scriptSrcs: string[] = [
    `/atri/js/pages/runtime.js`,
    `/atri/js/pages/app.js`,
    `/atri/js/${filepath.join("/")}.js`,
  ];
  // @ts-ignore
  delete __non_webpack_require__.cache[
    // @ts-ignore
    __non_webpack_require__.resolve(path.resolve(SERVER_DIR, "pages", "_app"))
  ];
  // @ts-ignore
  const appMod = __non_webpack_require__(
    path.resolve(SERVER_DIR, "pages", "_app")
  );
  const AppFn = appMod.default;
  return renderToString(
    <AtriScriptsContext.Provider value={{ pages: scriptSrcs }}>
      <MainAppContext.Provider
        value={{
          App: (
            <AppFn>
              <ComponentFn />
            </AppFn>
          ),
        }}
      >
        <Document />
      </MainAppContext.Provider>
    </AtriScriptsContext.Provider>
  );
}
