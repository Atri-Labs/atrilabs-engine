import { Request } from "express";
import { matchRoutes } from "react-router-dom";
import { getRouteObjects } from "./routeObjects";
import chalk from "chalk";

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
    !req.originalUrl.startsWith("/static") &&
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
    req.method.toLowerCase() === "get" &&
    req.originalUrl.startsWith("/static/js")
  );
}

export function isJSONRequest(req: Request) {
  return (
    req.originalUrl.toLowerCase() === "get" &&
    req.headers.accept?.startsWith("application/json")
  );
}

export function matchUrlPath(originalUrl: string) {
  return matchRoutes(getRouteObjects(), originalUrl);
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
