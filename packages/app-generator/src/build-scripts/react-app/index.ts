import { ToolConfig } from "@atrilabs/core";
import { createForest, Forest } from "@atrilabs/forest";
import { createForestMgr } from "../../create-forest-mgr";
import {
  AppBuildOptions,
  ComponentGeneratorFunction,
  ComponentGeneratorOptions,
  ComponentGeneratorOutput,
  PropsGeneratorFunction,
  PropsGeneratorOptions,
  PropsGeneratorOutput,
} from "../../types";
import { getComponentFromManifest, getForestDef } from "../../utils";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

export default async function buildReactApp(
  toolConfig: ToolConfig,
  options: AppBuildOptions
) {
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
  const controllersDir = options.controllers.python.dir;
  const serverFile = path.resolve(controllersDir, "server.py");
  if (!fs.existsSync(serverFile)) {
    console.log(
      `Module Not Found. server.py file doesn't exist in controller directory ${controllersDir}`
    );
    return;
  }

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
        });
        componentGeneratorOutput = {
          ...componentGeneratorOutput,
          ...currentOutput,
        };
      } catch (err) {
        console.log(err);
      }
    });
    propsGeneratorFunctions.forEach(({ fn, options }) => {
      try {
        const currentOutput = fn({
          forestDef,
          forest,
          custom: options,
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
    compIds.map((compId) => {
      if (propsGeneratorOutput[compId]) {
        const alias = componentGeneratorOutput[compId].alias;
        const props = propsGeneratorOutput[compId].props;
        pageState[alias] = props;
      } else {
        console.log(`WARNING: props not found for ${compId}`);
      }
    });
    // console.log(pageState);
    // console.log(pages[pageId].route);
    if (pages[pageId].route === "/darshita/boston") {
      exec(
        `python -m server compute --route '${
          pages[pageId].route || "/"
        }' --state '${JSON.stringify(pageState)}'`,
        { cwd: controllersDir },
        (err, stdout, stderr) => {
          if (err) {
            console.log("Failed to run server.py");
          }
          if (stdout) {
            console.log(stdout);
          }
          if (stderr) {
            console.log("Error while running server.py:\n", stderr);
          }
        }
      );
    }
  });
}
