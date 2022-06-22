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
import {
  getComponentFromManifest,
  getForestDef,
  getReactAppDestPath,
  getReactAppServerDestPath,
  getReactPackageJSONDestPath,
  reactAppPackageJSON,
  reactAppRootTemplate,
  reactAppServerTemplatePath,
  reactAppTemplatePath,
  reactAppToCopyToRoot,
} from "../../utils";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { createReactAppTemplateManager } from "../../react-app-template-manager";

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
  const reactAppDestPath = getReactAppDestPath(options.outputDir);
  const reactAppServerDestPath = getReactAppServerDestPath(options.outputDir);
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
    },
    options.rootComponentId
  );
  const pagePropsPromises: Promise<void>[] = [];
  pageIds.forEach((pageId) => {
    pagePropsPromises.push(
      new Promise((resolve) => {
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
        // We need props generator output as initial state
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
        compIds.forEach((compId) => {
          if (propsGeneratorOutput[compId]) {
            const alias = componentGeneratorOutput[compId].alias;
            const props = propsGeneratorOutput[compId].props;
            pageState[alias] = props;
          } else {
            console.log(`WARNING: props not found for ${compId}`);
          }
        });
        exec(
          `python -m server compute --route '${
            pages[pageId].route || "/"
          }' --state '${JSON.stringify(pageState)}'`,
          { cwd: controllersDir },
          (err, stdout, stderr) => {
            if (err) {
              console.log(
                `Failed to run server.py for route ${pages[pageId].route}`
              );
            }
            if (stdout) {
              try {
                const newProps = JSON.parse(stdout);
                if (
                  newProps &&
                  newProps["statusCode"] === 200 &&
                  newProps["state"]
                ) {
                  reactTemplateManager.addComponents(
                    pages[pageId],
                    componentGeneratorOutput
                  );
                  const newPropsOuputFormat: PropsGeneratorOutput = {};
                  compIds.forEach((compId) => {
                    const comp = componentGeneratorOutput[compId];
                    newPropsOuputFormat[compId] = {
                      props: newProps["state"][comp.alias],
                    };
                  });
                  reactTemplateManager.addProps(
                    pages[pageId],
                    newPropsOuputFormat
                  );
                }
              } catch (err) {
                console.log(
                  `JSON decode error for route ${pages[pageId].route}`
                );
              }
            }
            if (stderr) {
              console.log(
                `Error while running server.py for route ${pages[pageId].route}:\n`,
                stderr
              );
            }
            resolve();
          }
        );
      })
    );
  });
  await Promise.all(pagePropsPromises);
  reactTemplateManager.flushStore();
}
