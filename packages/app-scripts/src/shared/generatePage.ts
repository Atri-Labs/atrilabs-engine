import fs from "fs";
import path from "path";
import { GeneratePageOptions, ServerInfo, SSGOptions } from "./types";
import fse from "fs-extra";

export function generatePage(pageRoute: string, options: GeneratePageOptions) {
  if (options?.reload) {
    delete require.cache[options.paths.getAppText];
  }
  const getAppText = require(path.resolve(options.paths.getAppText))[
    "getAppText"
  ]["getAppText"];
  const appHtmlContent = fs.readFileSync(options.paths.appDistHtml).toString();
  const finalText = getAppText(pageRoute, appHtmlContent);
  return finalText;
}

export function copyPublicDirectory(serverInfo: ServerInfo, destDir: string) {
  if (fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fse.copySync(serverInfo.publicDir, destDir);
}

export function buildPages(
  serverInfo: ServerInfo,
  options: GeneratePageOptions & SSGOptions
) {
  const pageRoutes = Object.keys(serverInfo.pages);
  pageRoutes.forEach((pageRoute) => {
    const finalText = generatePage(pageRoute, options);
    const dir = path.join(options.outputDir, pageRoute);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, "index.html"), finalText);
  });
}
