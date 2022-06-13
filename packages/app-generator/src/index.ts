import { ToolConfig } from "@atrilabs/core";
import { createForest, Forest, ForestDef, TreeDef } from "@atrilabs/forest";
import { createForestMgr } from "./create-forest-mgr";
import { AppGeneratorOptions } from "./types";
import path from "path";
import { createReactAppTemplateManager } from "./react-app-template-manager";
import {
  getForestDef,
  getReactAppDestPath,
  reactAppTemplatePath,
} from "./utils";

export default async function (
  toolConfig: ToolConfig,
  options: AppGeneratorOptions
) {
  // paths
  const reactAppDestPath = getReactAppDestPath(options.outputDir);
  // get/create forest def
  const forestDef = getForestDef(toolConfig, options.appForestPkgId);
  if (forestDef === undefined) {
    return;
  }
  const forestManager = createForestMgr(toolConfig);
  const eventManager = forestManager.getEventManager(options.appForestPkgId);
  // create forest for each page
  // get all pages
  const pages = eventManager.pages();
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
    reactTemplateManager.addPageToApp(pages[pageId]);
  });
  // install packages or update package.json

  // fill pages in app
  reactTemplateManager.flushAppJSX();
  // fill each page
  // update store from python as well as editor events
}
