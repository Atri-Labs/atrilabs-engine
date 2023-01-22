import { Compiler } from "webpack";
import { Application, Request } from "express";
import { matchRoutes } from "react-router-dom";
import { getRouteObjects } from "./routeObjects";
import { IRToUnixFilePath, routeObjectPathToIR } from "@atrilabs/atri-app-core";
import chalk from "chalk";
import { createAssetStore } from "./AssetStore";

export const requestedRouteObjectPaths: Set<string> = new Set([]);

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

function matchUrlPath(originalUrl: string) {
  return matchRoutes(getRouteObjects(), originalUrl);
}

function getRequestType(req: Request) {
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

function printRequest(req: Request) {
  const requestType = getRequestType(req);
  console.log(chalk.green(`${requestType} ${req.originalUrl}`));
}

export function handleRequest(
  app: Application,
  compiler: Compiler,
  assetStore: ReturnType<typeof createAssetStore>
) {
  assetStore.attachHooks(compiler);

  app.use((req, res, next) => {
    printRequest(req);
    if (isPageRequest(req)) {
      res.send("ok");
      const match = matchUrlPath(req.originalUrl);
      if (match === null) {
        // TODO: server error.tsx page
      } else {
        const filepath = IRToUnixFilePath(
          routeObjectPathToIR(match[0]!.route.path)
        );
        console.log("Filepath", filepath);
        if (requestedRouteObjectPaths.has(match[0]!.route.path)) {
          // TODO: build html server side
        } else {
          // TODO: add to entry
        }
      }
    } else {
      next();
    }
  });
}
