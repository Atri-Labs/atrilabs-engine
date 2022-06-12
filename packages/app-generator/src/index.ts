import { ToolConfig } from "@atrilabs/core";
import { createForest, Forest, ForestDef, TreeDef } from "@atrilabs/forest";
import { createForestMgr } from "./create-forest-mgr";
import { AppGeneratorOptions } from "./types";
import path from "path";
import { getFiles } from "./utils";
import fs from "fs";

const reactAppTemplatePath = path.resolve(
  __dirname,
  "..",
  "templates",
  "react-app"
);

export default async function (
  toolConfig: ToolConfig,
  options: AppGeneratorOptions
) {
  // paths
  const reactDestPath = path.resolve(options.outputDir, "app");
  // create forests using forest manager
  const forestManager = createForestMgr(toolConfig);
  const eventManager = forestManager.getEventManager(options.appForestPkgId);
  // get all pages
  const pages = eventManager.pages();
  // create tree def and forest def from toolConfig
  const appForestEntry = toolConfig.forests[options.appForestPkgId];
  if (appForestEntry === undefined) {
    console.log(
      `appForestPkgId not found in toolConfig\nappForestPkgId: ${
        options.appForestPkgId
      }\nforestConfigs: ${JSON.stringify(toolConfig.forests, null, 2)}`
    );
    return;
  }
  const treeDefs: TreeDef[] = appForestEntry.map((treeDef) => {
    return {
      defFn: require(treeDef.modulePath).default,
      id: treeDef.modulePath,
      modulePath: treeDef.modulePath,
    };
  });
  const forestDef: ForestDef = {
    id: options.appForestPkgId,
    pkg: options.appForestPkgId,
    trees: treeDefs,
  };
  // create forest for each page
  const pageForestMap: { [pageId: string]: Forest } = {};
  const pageIds = Object.keys(pages);
  pageIds.forEach((pageId) => {
    pageForestMap[pageId] = createForest(forestDef);
  });
  // call handle event for each page
  pageIds.forEach((pageId) => {
    const events = eventManager.fetchEvents(pageId);
    events.forEach((event) => {
      pageForestMap[pageId].handleEvent(event);
    });
  });

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

  // copy template to the output directory
  const files = getFiles(reactAppTemplatePath);
  files.forEach((file) => {
    const dirname = path.dirname(file);
    const relativeDirname = path.relative(reactAppTemplatePath, dirname);
    const destDirname = path.resolve(reactDestPath, relativeDirname);
    const relativeFilename = path.relative(reactAppTemplatePath, file);
    const destFilename = path.resolve(reactDestPath, relativeFilename);
    if (!fs.existsSync(destDirname)) {
      fs.mkdirSync(destDirname, { recursive: true });
    }
    fs.writeFileSync(destFilename, fs.readFileSync(file));
  });
  // create pages directory
  const reactAppDestPagesDirectory = path.resolve(
    reactDestPath,
    "src",
    "pages"
  );
  if (!fs.existsSync(reactAppDestPagesDirectory)) {
    fs.mkdirSync(reactAppDestPagesDirectory);
  }
  // install packages or update package.json
  const reactAppPackageJSONPath = path.resolve(
    reactAppTemplatePath,
    "package.json"
  );
  const reactAppPackageJSON = require(reactAppPackageJSONPath);
  const reactAppDependencies = reactAppPackageJSON["dependencies"] || {};
  const reactAppDevDependencies = reactAppPackageJSON["devDependencies"] || {};

  // fill pages in app
  // create pages
  // fill each page
  // update store from python as well as editor events
}
