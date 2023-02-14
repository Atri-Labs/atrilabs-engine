import path from "path";

export const PAGE_DIR = path.resolve("pages");

function resolvePage(relativePath: string[]) {
  return path.resolve(PAGE_DIR, ...relativePath);
}

export const ERROR_PAGE = resolvePage(["error"]);

export const SERVER_DIR = path.resolve("dist", "server");
