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
        path.resolve(
          manifestPkgPath,
          manifestConfig["componentMap"][meta.key]["modulePath"]
        )
      ),
    };
  }
}

// replace src with lib
export function getManifestModulePath(pkg: string, modulePath: string) {
  const srcDir = path.dirname(require.resolve(`${pkg}/src/manifest.config.js`));
  let newModulePath = modulePath;
  const relativePath = path.relative(srcDir, modulePath);
  if (!relativePath.startsWith(".")) {
    const libDir = path.resolve(srcDir, "..", "lib");
    newModulePath = path.resolve(libDir, relativePath);
    // change extension to js
    newModulePath = newModulePath.replace(/((.ts)|(.tsx))$/, ".cjs");
  }
  return newModulePath;
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
    console.log("got path", compiledModulePath);
    if (fs.existsSync(compiledModulePath)) {
      console.log("path exists");
      try {
        console.log("module entire", require(compiledModulePath));
        return require(compiledModulePath)["default"];
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("compiled module not found", compiledModulePath);
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
