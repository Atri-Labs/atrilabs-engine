import path from "path";
import fs from "fs";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { ServerInfo } from "./types";

export function renderRoute(App: React.FC, route: string): string {
  const appStr = ReactDOMServer.renderToString(
    <StaticRouter location={route}>
      <App />
    </StaticRouter>
  );
  return appStr;
}

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
export function getIndexHtmlContent(appHtml: string) {
  if (indexHtmlContent === "") {
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
    port: serverInfo["port"],
    pythonPort: serverInfo["pythonPort"],
    publicDir: serverInfo["publicDir"],
    pages: serverInfo["pages"],
    publicUrlAssetMap: serverInfo["publicUrlAssetMap"],
  };
}
