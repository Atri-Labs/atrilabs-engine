import path from "path";
import fs from "fs";

export function getFiles(dir: string): string[] {
  const files: string[] = [];
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      files.push(...getFiles(path.resolve(dir, dirent.name)));
    } else {
      files.push(path.resolve(dir, dirent.name));
    }
  });
  return files;
}

// create manifest registry from events pkg, key, manifestSchemaId
// search in the manifest pkg with key, get exportedVar
function getComponentFromManifest(meta: { pkg: string; key: string }) {
  const manifestConfigPath = require.resolve(
    `${meta.pkg}/src/manifest.config.js`
  );
  const manifestConfig = require(manifestConfigPath);
  if (
    manifestConfig["componentMap"] &&
    manifestConfig["componentMap"][meta.key] &&
    manifestConfig["componentMap"][meta.key]["modulePath"] &&
    manifestConfig["componentMap"][meta.key]["exportedVarName"]
  ) {
    return {
      exportedVarName:
        manifestConfig["componentMap"][meta.key]["exportedVarName"],
      // absolute module path
      modulePath: path.resolve(
        manifestConfig,
        manifestConfig["componentMap"][meta.key]["modulePath"]
      ),
    };
  }
}
