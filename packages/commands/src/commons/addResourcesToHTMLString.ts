import fs from "fs";
import path from "path";
import recursiveReadDir from "recursive-readdir";
import { toUnix } from "upath";

export async function addResourcesToHTMLString(htmlString: string) {
  const resourcesDir = path.resolve("public", "resources");
  if (fs.existsSync(resourcesDir)) {
    const resources = await recursiveReadDir(resourcesDir);
    const hrefs = resources
      .filter((resource) => resource.endsWith(".css"))
      .map((resource) => {
        return `/resources/${toUnix(resource.replace(resourcesDir, "")).replace(
          /^(\/)/,
          ""
        )}`;
      });
    const tags = hrefs
      .map((href) => `<link rel="stylesheet" href="${href}">`)
      .join("\n");
    return htmlString.replace(`<head>`, `<head>\n${tags}`);
  }
  return htmlString;
}
