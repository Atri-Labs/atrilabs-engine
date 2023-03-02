import path from "path";

export const PAGE_DIR = path.resolve("pages");
export const CONTROLLERS_DIR = path.resolve("controllers");
export const ROUTES_DIR = path.resolve(CONTROLLERS_DIR, "routes");

function resolvePage(relativePath: string[]) {
  return path.resolve(PAGE_DIR, ...relativePath);
}

export const ERROR_PAGE = resolvePage(["error"]);

export const SERVER_DIR = path.resolve("dist", "server");
