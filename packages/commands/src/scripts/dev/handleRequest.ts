import { Compiler } from "webpack";
import { Application, Request } from "express";
import { matchRoutes } from "react-router-dom";
import { getRouteObjects } from "./routeObjects";

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
    req.originalUrl.startsWith("/static/js/pages")
  );
}

export function isJSONRequest(req: Request) {
  return (
    req.originalUrl.toLowerCase() === "get" &&
    req.headers.accept?.startsWith("application/json")
  );
}

function matchUrlPath(originalUrl: string) {
  return matchRoutes(getRouteObjects(), originalUrl);
}

export function handleRequest(app: Application, _compiler: Compiler) {
  app.use((req, _res, next) => {
    if (isPageRequest(req)) {
      const match = matchUrlPath(req.originalUrl);
      if (match === null) {
        // TODO: server error.tsx page
      } else {
        // TODO: build html server side
      }
    }
    next();
  });
}
