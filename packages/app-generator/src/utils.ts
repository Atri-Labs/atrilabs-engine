import path from "path";
import fs from "fs";
import { ToolConfig } from "@atrilabs/core";
import { ForestDef, TreeDef } from "@atrilabs/forest";
import { generateModuleId } from "@atrilabs/scripts";

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
export function getComponentFromManifest(meta: { pkg: string; key: string }) {
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
        manifestConfigPath,
        manifestConfig["componentMap"][meta.key]["modulePath"]
      ),
    };
  }
}

export const reactAppTemplatePath = path.resolve(
  __dirname,
  "..",
  "templates",
  "react-app"
);

export function getReactAppDestPath(outputDir: string) {
  return path.resolve(outputDir, "app");
}

export function getForestDef(toolConfig: ToolConfig, appForestPkgId: string) {
  // create tree def and forest def from toolConfig
  const appForestEntry = toolConfig.forests[appForestPkgId];
  if (appForestEntry === undefined) {
    console.log(
      `appForestPkgId not found in toolConfig\nappForestPkgId: ${appForestPkgId}\nforestConfigs: ${JSON.stringify(
        toolConfig.forests,
        null,
        2
      )}`
    );
    return;
  }
  const treeDefs: TreeDef[] = appForestEntry.map((treeDef) => {
    return {
      defFn: require(treeDef.modulePath).default,
      id: generateModuleId(treeDef.modulePath),
      modulePath: treeDef.modulePath,
    };
  });
  const forestDef: ForestDef = {
    id: appForestPkgId,
    pkg: appForestPkgId,
    trees: treeDefs,
  };
  return forestDef;
}
