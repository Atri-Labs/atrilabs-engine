import path from "path";
import fs from "fs";
import { ToolConfig } from "@atrilabs/core";
import { ForestDef, TreeDef } from "@atrilabs/forest";
import { generateModuleId } from "@atrilabs/scripts";
import { Infos } from "./types";

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

export const reactAppNodeTemplatePath = path.resolve(
  __dirname,
  "..",
  "templates",
  "react-app",
  "app-node"
);

export const reactAppToCopyToRoot: {
  path: string;
  // .gitignore .eslintrc.json files are not copied to published npm repo
  // hence, their name has been changed so that they get copied.
  outputFilename?: string;
}[] = [
  {
    path: path.resolve(reactAppRootTemplate, "eslint.config.json"),
    outputFilename: ".eslintrc.json",
  },
  { path: path.resolve(reactAppRootTemplate, "atri-app-env.d.ts") },
  {
    path: path.resolve(reactAppRootTemplate, "gitignore.txt"),
    outputFilename: ".gitignore",
  },
];

export function getReactAppDestPath(outputDir: string) {
  return path.resolve(outputDir, "app");
}

export function getReactAppServerDestPath(outputDir: string) {
  return path.resolve(outputDir, "server");
}

export function getReactAppNodeDestPath(outputDir: string) {
  return path.resolve(outputDir, "app-node");
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

export const atriAppInfoFilename = "atri-app-info.json";

export const atriAppInfoTemplateFilepath = path.resolve(
  reactAppRootTemplate,
  atriAppInfoFilename
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

export const atriAppIndexHtmlTemplateFilepath = path.resolve(
  reactAppTemplatePath,
  "public",
  "index.html"
);

export function getAtriAppIndexHtmlDestFilepath(outputDir: string) {
  return path.resolve(outputDir, "app", "public", "index.html");
}

export function getAllInfos(outputDir: string): Infos {
  let serverInfo = JSON.parse(
    fs.readFileSync(atriAppServerInfoTemplateFilepath).toString()
  );
  let buildInfo = JSON.parse(
    fs.readFileSync(atriAppBuildInfoTemplateFilepath).toString()
  );
  let appInfo = JSON.parse(
    fs.readFileSync(atriAppInfoTemplateFilepath).toString()
  );

  const destServerInfoPath = path.resolve(outputDir, atriAppServerInfoFilename);
  if (fs.existsSync(destServerInfoPath)) {
    serverInfo = JSON.parse(fs.readFileSync(destServerInfoPath).toString());
  }

  const destBuildInfoPath = path.resolve(outputDir, atriAppBuildInfoFilename);
  if (fs.existsSync(destBuildInfoPath)) {
    buildInfo = JSON.parse(fs.readFileSync(destBuildInfoPath).toString());
  }
  buildInfo.assetUrlPrefix = process.env["ASSET_URL_PREFIX"]
    ? process.env["ASSET_URL_PREFIX"]
    : buildInfo.assetUrlPrefix;

  const destAppInfoPath = path.resolve(outputDir, atriAppInfoFilename);
  if (fs.existsSync(destAppInfoPath)) {
    appInfo = JSON.parse(fs.readFileSync(destAppInfoPath).toString());
  }
  return { app: appInfo, server: serverInfo, build: buildInfo };
}
