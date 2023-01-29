import { Request } from "express";
import { matchRoutes } from "react-router-dom";
import chalk from "chalk";
import path from "path";
import { SERVER_DIR } from "../../consts";

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

/**
 *
 * @param filepath segments of filepath
 * @returns
 */
export function getPageHtml(filepath: string[]) {
  // @ts-ignore
  delete __non_webpack_require__.cache[
    // @ts-ignore
    __non_webpack_require__.resolve(path.resolve(SERVER_DIR, ...filepath))
  ];
  // @ts-ignore
  const mod = __non_webpack_require__(path.resolve(SERVER_DIR, ...filepath));
  const { renderPage } = mod.default;
  return renderPage();
}
