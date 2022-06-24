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
  const manifestPkgPath = path.dirname(
    require.resolve(`${meta.pkg}/package.json`)
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
      modulePath: getManifestModulePath(
        meta.pkg,
        manifestConfig["componentMap"][meta.key]["modulePath"]
      ),
    };
  }
}

// replace src with lib
export function getManifestModulePath(pkg: string, modulePath: string) {
  return path.join(pkg, modulePath).replace(/\\/g, "/");
}

export function getManifest(meta: { pkg: string; key: string }) {
  const manifestConfigPath = require.resolve(
    `${meta.pkg}/src/manifest.config.js`
  );
  const manifestPkgPath = path.dirname(
    require.resolve(`${meta.pkg}/package.json`)
  );
  const manifestConfig = require(manifestConfigPath);
  if (
    manifestConfig["componentMap"] &&
    manifestConfig["componentMap"][meta.key] &&
    manifestConfig["componentMap"][meta.key]["modulePath"] &&
    manifestConfig["componentMap"][meta.key]["exportedVarName"]
  ) {
    // absolute module path
    const modulePath = path.resolve(
      manifestPkgPath,
      manifestConfig["componentMap"][meta.key]["modulePath"]
    );
    const compiledModulePath = getManifestModulePath(meta.pkg, modulePath);
    try {
      console.log("compiled module path", require(compiledModulePath));
      return require(compiledModulePath)["default"];
    } catch (err) {
      console.log(err);
    }
  }
}

export const reactAppRootTemplate = path.resolve(
  __dirname,
  "..",
  "templates",
  "react-app"
);

export const reactAppPackageJSON = path.resolve(
  reactAppRootTemplate,
  "package.json"
);

export const reactAppTemplatePath = path.resolve(
  __dirname,
  "..",
  "templates",
  "react-app",
  "app"
);

export const reactAppServerTemplatePath = path.resolve(
  __dirname,
  "..",
  "templates",
  "react-app",
  "server"
);

export const reactAppToCopyToRoot = [
  path.resolve(reactAppRootTemplate, ".eslintrc.json"),
  path.resolve(reactAppRootTemplate, "atri-app-env.d.ts"),
];

export function getReactAppDestPath(outputDir: string) {
  return path.resolve(outputDir, "app");
}

export function getReactAppServerDestPath(outputDir: string) {
  return path.resolve(outputDir, "server");
}

export function getReactPackageJSONDestPath(outputDir: string) {
  return path.resolve(outputDir, "package.json");
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

export const pythonAppTemplatePath = path.resolve(
  __dirname,
  "..",
  "templates",
  "python-app"
);

export const atriAppBuildInfoFilename = "atri-build-info.json";

export const atriAppBuildInfoTemplateFilepath = path.resolve(
  reactAppRootTemplate,
  atriAppBuildInfoFilename
);

export const atriAppServerInfoFilename = "atri-server-info.json";

export const atriAppServerInfoTemplateFilepath = path.resolve(
  reactAppRootTemplate,
  atriAppServerInfoFilename
);

export function getPackageVersion(pkg: string): string | null {
  try {
    const pkgJSON = require.resolve(`${pkg}/package.json`);
    const version = require(pkgJSON)["version"];
    return version;
  } catch (err) {
    console.log(err);
  }
  return null;
}
