import path from "path";
import fs from "fs";
import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import type { ServerInfo } from "@atrilabs/core";

// create local cache directory if not already created
const localCache = path.resolve(__dirname, ".cache");
const pagesCache = path.resolve(localCache, "pages");
const gitIgnoreLocalCache = path.resolve(localCache, ".gitignore");
export function createIfNotExistLocalCache() {
  if (!fs.existsSync(localCache)) {
    fs.mkdirSync(localCache, { recursive: true });
  }
  if (!fs.existsSync(gitIgnoreLocalCache)) {
    fs.writeFileSync(gitIgnoreLocalCache, "*");
  }
}

function getPageDirPath(url: string) {
  return path.resolve(pagesCache, url.slice(1));
}

function getPageFilePath(url: string) {
  return path.resolve(getPageDirPath(url), "index.html");
}

export function storePageInCache(url: string, html: string) {
  const pageDirPath = getPageDirPath(url);
  const pageFilePath = getPageFilePath(url);
  if (!fs.existsSync(pageDirPath)) {
    fs.mkdirSync(pageDirPath, { recursive: true });
  }
  fs.writeFileSync(pageFilePath, html);
}

export function getPageFromCache(url: string): string | null {
  const pageFilePath = getPageFilePath(url);
  if (!fs.existsSync(pageFilePath)) {
    return null;
  }
  return fs.readFileSync(pageFilePath).toString();
}

let indexHtmlContent = "";
export const isDevelopment = process.argv.includes("--dev");
export function getIndexHtmlContent(appHtml: string) {
  if (indexHtmlContent === "" || isDevelopment) {
    if (fs.existsSync(appHtml)) {
      indexHtmlContent = fs.readFileSync(appHtml).toString();
    } else {
      console.log("ERROR: app's index.html file is missing");
    }
  }
  return indexHtmlContent;
}

export function findNearestNodeModulesDirectory(
  startDir: string,
  prevDir: string | null
): string {
  if (fs.existsSync(path.resolve(startDir, "node_modules"))) {
    return path.resolve(startDir, "node_modules");
  }
  // We are the root directory
  if (startDir === prevDir) {
    throw Error("Could not find node_modules directory");
  }
  return findNearestNodeModulesDirectory(
    path.resolve(startDir, ".."),
    startDir
  );
}

export function getServerInfo(startDir: string): ServerInfo {
  const nodeModulesPath = findNearestNodeModulesDirectory(startDir, null);
  const serverInfoPath = path.resolve(
    nodeModulesPath,
    "..",
    "atri-server-info.json"
  );
  const serverInfo = JSON.parse(fs.readFileSync(serverInfoPath).toString());
  return {
    port: parseInt(process.env["PORT"] || "") || serverInfo["port"],
    pythonPort: serverInfo["pythonPort"],
    publicDir: serverInfo["publicDir"],
    pages: serverInfo["pages"],
    publicUrlAssetMap: serverInfo["publicUrlAssetMap"],
    controllerHost: process.env["ATRI_CONTROLLER_HOST"],
  };
}

const wsSockets: WebSocket[] = [];
export function createWebSocketServer(server: Server) {
  const wsServer = new WebSocketServer({ server });
  wsServer.on("connection", (ws) => {
    wsSockets.push(ws);
    ws.on("close", () => {
      const index = wsSockets.findIndex((curr) => curr === ws);
      if (index >= 0) {
        wsSockets.splice(index, 1);
      }
    });
  });
}

export function sendReloadMessage() {
  wsSockets.forEach((ws) => {
    ws.send("reload", (err) => {
      if (err) {
        console.log("failed to send reload message\n", err);
      }
    });
  });
}
