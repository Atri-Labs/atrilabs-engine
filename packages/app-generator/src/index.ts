import { ToolConfig } from "@atrilabs/core";
import { createForest, Forest, ForestDef, TreeDef } from "@atrilabs/forest";
import { createForestMgr } from "./create-forest-mgr";
import { AppGeneratorOptions } from "./types";
import path from "path";
import { getFiles } from "./utils";
import fs from "fs";
import { createReactAppTemplateManager } from "./react-app-template-manager";

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
  const reactAppDestPath = path.resolve(options.outputDir, "app");
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

  const reactTemplateManager = createReactAppTemplateManager({
    reactAppTemplate: reactAppTemplatePath,
    reactAppDest: reactAppDestPath,
  });
  // copy template to the output directory
  reactTemplateManager.copyTemplate();
  // create pages
  pageIds.forEach((pageId) => {
    const pageName = pages[pageId].name;
    reactTemplateManager.createPage(pageName);
  });
  // install packages or update package.json

  // fill pages in app
  reactTemplateManager.flushAppJSX();
  // fill each page
  // update store from python as well as editor events
}
