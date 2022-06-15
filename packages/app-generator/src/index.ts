import { ToolConfig } from "@atrilabs/core";
import { createForest, Forest } from "@atrilabs/forest";
import { createForestMgr } from "./create-forest-mgr";
import {
  AppGeneratorOptions,
  ComponentGeneratorFunction,
  ComponentGeneratorOptions,
  ComponentGeneratorOutput,
  PropsGeneratorFunction,
  PropsGeneratorOptions,
  PropsGeneratorOutput,
  PythonStubGeneratorFunction,
  PythonStubGeneratorOptions,
  PythonStubGeneratorOutput,
} from "./types";
import { createReactAppTemplateManager } from "./react-app-template-manager";
import {
  getComponentFromManifest,
  getForestDef,
  getManifest,
  getReactAppDestPath,
  pythonAppTemplatePath,
  reactAppTemplatePath,
} from "./utils";
import { createPythonAppTemplateManager } from "./python-app-template-manager";

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

  const reactTemplateManager = createReactAppTemplateManager(
    {
      reactAppTemplate: reactAppTemplatePath,
      reactAppDest: reactAppDestPath,
    },
    options.rootComponentId
  );

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
  pageIds.forEach((pageId) => {
    const forest = pageForestMap[pageId];
    let componentGeneratorOutput: ComponentGeneratorOutput = {};
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
    reactTemplateManager.addComponents(pages[pageId], componentGeneratorOutput);
  });

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
    const forest = pageForestMap[pageId];
    let propsGeneratorOutput: PropsGeneratorOutput = {};
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
    reactTemplateManager.addProps(pages[pageId], propsGeneratorOutput);
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
  reactTemplateManager.flushPages();
  // update store using editor events
  reactTemplateManager.flushStore();

  const pythonGeneratorFunctions: {
    fn: PythonStubGeneratorFunction;
    options: PythonStubGeneratorOptions;
  }[] = [];
  for (let i = 0; i < options.controllers.python.stubGenerators.length; i++) {
    const pythonGeneratorModulePath =
      options.controllers.python.stubGenerators[i]!.modulePath;
    const mod = await import(pythonGeneratorModulePath);
    const defaultFn = mod["default"];
    if (typeof defaultFn === "function") {
      pythonGeneratorFunctions.push({
        fn: defaultFn,
        options: options.controllers.python.stubGenerators[i]!.options,
      });
    }
  }
  const pythonAppTemplateManager = createPythonAppTemplateManager(
    {
      controllers: options.controllers.python.dir,
      pythonAppTemplate: pythonAppTemplatePath,
    },
    Object.values(pages)
  );
  pythonAppTemplateManager.copyTemplate();
  pageIds.forEach((pageId) => {
    const page = pages[pageId];
    const forest = pageForestMap[pageId];
    let pythonGeneratorOutput: PythonStubGeneratorOutput = { vars: {} };
    pythonGeneratorFunctions.forEach(({ fn, options }) => {
      try {
        const currentOutput = fn({
          forestDef,
          forest,
          getManifest,
          custom: options,
        });
        pythonGeneratorOutput["vars"] = {
          ...pythonGeneratorOutput["vars"],
          ...currentOutput["vars"],
        };
      } catch (err) {
        console.log(err);
      }
    });
    pythonAppTemplateManager.addVariables(page.name, pythonGeneratorOutput);
  });
  pythonAppTemplateManager.flushAtriPyFiles();
}
