import { ToolConfig } from "@atrilabs/core";
import { createForest, Forest } from "@atrilabs/forest";
import { createForestMgr } from "../create-forest-mgr";
import {
  AppGeneratorOptions,
  CallbackGeneratorFunction,
  CallbackGeneratorOptions,
  CallbackGeneratorOutput,
  ComponentGeneratorFunction,
  ComponentGeneratorOptions,
  ComponentGeneratorOutput,
  PropsGeneratorFunction,
  PropsGeneratorOptions,
  PropsGeneratorOutput,
  PythonStubGeneratorFunction,
  PythonStubGeneratorOptions,
  PythonStubGeneratorOutput,
  ResourceGeneratorFunction,
} from "../types";
import { createReactAppTemplateManager } from "../react-app-template-manager";
import {
  atriAppIndexHtmlTemplateFilepath,
  getAllInfos,
  getAtriAppIndexHtmlDestFilepath,
  getComponentFromManifest,
  getForestDef,
  getManifest,
  getPackageVersion,
  getReactAppDestPath,
  getReactAppNodeDestPath,
  getReactAppServerDestPath,
  getReactPackageJSONDestPath,
  pythonAppTemplatePath,
  reactAppNodeTemplatePath,
  reactAppPackageJSON,
  reactAppRootTemplate,
  reactAppServerTemplatePath,
  reactAppTemplatePath,
  reactAppToCopyToRoot,
} from "../utils";
import { createPythonAppTemplateManager } from "../python-app-template-manager";

export default async function generateApp(
  toolConfig: ToolConfig,
  options: AppGeneratorOptions
) {
  // paths
  const reactAppDestPath = getReactAppDestPath(options.outputDir);
  const reactAppServerDestPath = getReactAppServerDestPath(options.outputDir);

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
      pageForestMap[pageId].handleEvents({
        events: [event],
        meta: { agent: "server-sent" },
        name: "",
      });
    });
  });

  // infos
  const infos = getAllInfos(options.outputDir);

  const reactTemplateManager = createReactAppTemplateManager(
    {
      reactAppTemplate: reactAppTemplatePath,
      reactAppDest: reactAppDestPath,
      reactAppServerTemplate: reactAppServerTemplatePath,
      reactAppServerDest: reactAppServerDestPath,
      reactAppRootDest: options.outputDir,
      toCopy: reactAppToCopyToRoot,
      reactAppRootTemplate,
      reactAppPackageJSON,
      reactAppPackageJSONDest: getReactPackageJSONDestPath(options.outputDir),
      reactAppNodeTemplatePath: reactAppNodeTemplatePath,
      reactAppNodeDestPath: getReactAppNodeDestPath(options.outputDir),
      reactAppIndexHtmlTemplate: atriAppIndexHtmlTemplateFilepath,
      reactAppIndexHtmlDest: getAtriAppIndexHtmlDestFilepath(options.outputDir),
    },
    options.rootComponentId,
    toolConfig.assetManager,
    infos
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
    componentGeneratorFunctions.forEach(({ fn, options: customOptions }) => {
      try {
        const currentOutput = fn({
          forestDef,
          forest,
          getComponentFromManifest,
          custom: customOptions,
          infos: JSON.parse(JSON.stringify(infos)),
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
          infos: JSON.parse(JSON.stringify(infos)),
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

  const callbackGeneratorFunctions: {
    fn: CallbackGeneratorFunction;
    options: CallbackGeneratorOptions;
  }[] = [];
  for (let i = 0; i < options.callbacks.length; i++) {
    const callbackGeneratorModulePath = options.callbacks[i]!.modulePath;
    const mod = await import(callbackGeneratorModulePath);
    const defaultFn = mod["default"];
    if (typeof defaultFn === "function") {
      callbackGeneratorFunctions.push({
        fn: defaultFn,
        options: options.components[i]!.options,
      });
    }
  }
  pageIds.forEach((pageId) => {
    const forest = pageForestMap[pageId];
    let callbackGeneratorOutput: CallbackGeneratorOutput = {};
    callbackGeneratorFunctions.forEach(({ fn, options }) => {
      try {
        const currentOutput = fn({
          forestDef,
          forest,
          custom: options,
          infos: JSON.parse(JSON.stringify(infos)),
        });
        callbackGeneratorOutput = {
          ...callbackGeneratorOutput,
          ...currentOutput,
        };
      } catch (err) {
        console.log(err);
      }
    });
    reactTemplateManager.addCallbacks(pages[pageId], callbackGeneratorOutput);
  });

  const resourceGeneratorFunctions: {
    fn: ResourceGeneratorFunction;
    options: any;
  }[] = [];
  for (let i = 0; i < options.callbacks.length; i++) {
    const resourceGeneratorModulePath = options.resources[i]!.modulePath;
    const mod = await import(resourceGeneratorModulePath);
    const defaultFn = mod["default"];
    if (typeof defaultFn === "function") {
      resourceGeneratorFunctions.push({
        fn: defaultFn,
        options: options.components[i]!.options,
      });
    }
  }
  resourceGeneratorFunctions.forEach(({ fn, options }) => {
    try {
      const currentOutput = fn({
        resourcesConfig: toolConfig.resources,
        custom: options,
      });
      reactTemplateManager.addResources(currentOutput);
    } catch (err) {
      console.log(err);
    }
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
  const deps: { [pkg: string]: string } = {};
  const devDeps: { [pkg: string]: string } = {};
  const manifestDirs = toolConfig["manifestDirs"];
  if (manifestDirs && Array.isArray(manifestDirs)) {
    manifestDirs.forEach((dir) => {
      const version = getPackageVersion(dir.pkg);
      console.log(version);
      if (version) {
        deps[dir.pkg] = `^${version}`;
      }
    });
  }
  // We will update all the @atrilabs/... dependencies with latest version
  const currDeps = reactTemplateManager.getDependencies();
  const atriDeps = Object.keys(currDeps).filter((dep) => {
    return dep.match("@atrilabs");
  });
  atriDeps.forEach((dep) => {
    const version = getPackageVersion(dep);
    if (version) {
      deps[dep] = `^${version}`;
    }
  });
  const currDevDeps = reactTemplateManager.getDevDependencies();
  const atriDevDeps = Object.keys(currDevDeps).filter((dep) => {
    return dep.match("@atrilabs");
  });
  atriDevDeps.forEach((dep) => {
    const version = getPackageVersion(dep);
    if (version) {
      devDeps[dep] = `^${version}`;
    }
  });
  reactTemplateManager.patchDependencies(deps);
  reactTemplateManager.patchDevDependencies(devDeps);

  // first flush index.html
  reactTemplateManager.flushIndexHtml();
  // replace with asset url prexfix if any
  reactTemplateManager.flushIndexJSX();
  // fill pages in app
  reactTemplateManager.flushAppJSX();
  // fill each page
  reactTemplateManager.flushPages();
  // update store using editor events
  reactTemplateManager.flushStore();
  reactTemplateManager.flushIoStore();
  reactTemplateManager.flushAtriBuildInfo(toolConfig["manifestDirs"]);
  reactTemplateManager.flushPatchedPackageJSON();
  reactTemplateManager.flushAtriServerInfo();
  reactTemplateManager.flushPageCbs();
  reactTemplateManager.flushAtriAppInfo();
  reactTemplateManager.createCustomCodeDirectories();
  await reactTemplateManager.flushPageCSS();

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
  // controllers directory might exist already if running inside docker container
  // because when we volume map a host path with container path, if the host path
  // doesn't exist, then docker run command creates that path on host machine.
  // Hence, we will not copy template only if controllers/server.py file doesn't exist.
  if (!pythonAppTemplateManager.serverPyExists())
    pythonAppTemplateManager.copyTemplate(false);
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
          infos: JSON.parse(JSON.stringify(infos)),
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
  // create main.py files if not already created
  pageIds.forEach((pageId) => {
    pythonAppTemplateManager.createMainPyRecursively(pages[pageId]);
    pythonAppTemplateManager.createInitPyRecursively(pages[pageId]);
  });
}
