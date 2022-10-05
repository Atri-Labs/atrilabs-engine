import { ToolConfig } from "@atrilabs/core";
import { createForest, Forest } from "@atrilabs/forest";
import { createForestMgr } from "./create-forest-mgr";
import {
  AppGeneratorOptions,
  ComponentGeneratorFunction,
  ComponentGeneratorOptions,
  ComponentGeneratorOutput,
  AppInfo,
  PropsGeneratorFunction,
  PropsGeneratorOptions,
  PropsGeneratorOutput,
} from "./types";
import { getAllInfos, getComponentFromManifest, getForestDef } from "./utils";

export async function getAppInfo(
  toolConfig: ToolConfig,
  options: AppGeneratorOptions
) {
  // get/create forest def
  const forestDef = getForestDef(toolConfig, options.appForestPkgId);
  if (forestDef === undefined) {
    throw Error("forestDef not defined/found in tool.config.js");
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
      pageForestMap[pageId].handleEvents({
        events: [event],
        meta: { agent: "server-sent" },
        name: "",
      });
    });
  });

  const componentGeneratorFunctions: {
    fn: ComponentGeneratorFunction;
    options: ComponentGeneratorOptions;
  }[] = [];
  for (let i = 0; i < options.components.length; i++) {
    const componentGeneratorModulePath = options.components[i]!.modulePath;
    const mod = await import(componentGeneratorModulePath);
    const defaultFn = mod["default"];
    if (typeof defaultFn === "function") {
      componentGeneratorFunctions.push({
        fn: defaultFn,
        options: options.components[i]!.options,
      });
    }
  }
  const propsGeneratorFunctions: {
    fn: PropsGeneratorFunction;
    options: PropsGeneratorOptions;
  }[] = [];
  for (let i = 0; i < options.props.length; i++) {
    const propsGeneratorModulePath = options.props[i]!.modulePath;
    const mod = await import(propsGeneratorModulePath);
    const defaultFn = mod["default"];
    if (typeof defaultFn === "function") {
      propsGeneratorFunctions.push({
        fn: defaultFn,
        options: options.components[i]!.options,
      });
    }
  }
  const infos = getAllInfos(options.outputDir);

  const result: AppInfo = { pages: {} };
  pageIds.forEach((pageId) => {
    // create props for state
    let componentGeneratorOutput: ComponentGeneratorOutput = {};
    let propsGeneratorOutput: PropsGeneratorOutput = {};
    const forest = pageForestMap[pageId];
    componentGeneratorFunctions.forEach(({ fn, options }) => {
      try {
        const currentOutput = fn({
          forestDef,
          forest,
          getComponentFromManifest,
          custom: options,
          infos,
        });
        componentGeneratorOutput = {
          ...componentGeneratorOutput,
          ...currentOutput,
        };
      } catch (err) {
        console.log(err);
      }
    });
    // We need props generator output as initial state
    propsGeneratorFunctions.forEach(({ fn, options }) => {
      try {
        const currentOutput = fn({
          forestDef,
          forest,
          custom: options,
          infos,
        });
        propsGeneratorOutput = {
          ...propsGeneratorOutput,
          ...currentOutput,
        };
      } catch (err) {
        console.log(err);
      }
    });
    const compIds = Object.keys(componentGeneratorOutput);
    const pageState: { [alias: string]: any } = {};
    compIds.forEach((compId) => {
      if (propsGeneratorOutput[compId]) {
        const alias = componentGeneratorOutput[compId].alias;
        const props = propsGeneratorOutput[compId].props;
        pageState[alias] = props;
      } else {
        console.log(`WARNING: props not found for ${compId}`);
      }
    });
    result.pages[pageId] = {
      ...pages[pageId],
      componentGeneratorOutput,
      propsGeneratorOutput,
    };
  });
  return result;
}
