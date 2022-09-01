import { ToolConfig } from "@atrilabs/core";
import { AppBuildOptions, PropsGeneratorOutput } from "../../types";
import path from "path";
import fs from "fs";
import { fork } from "child_process";
import { createReactAppTemplateManager } from "../../react-app-template-manager";
import { getReactAppTemplateManager } from "../../getReactTemplateManager";
import { getPageStateAsCompIdMap } from "../../getPageState";
import { mergeWith } from "lodash";

function mergeStateCustomizer(obj: any, src: any) {
  // replace array instead of default merge
  if (Array.isArray(obj)) {
    return src;
  }
}

function installDependenciesWithNpm(reactAppRootDest: string) {
  return new Promise<void>((res) => {
    const runNpmInstallScriptPath = require.resolve("npm");
    const child_proc = fork(runNpmInstallScriptPath, ["install"], {
      cwd: reactAppRootDest,
      env: {
        PKG_EXECPATH: "PKG_INVOKE_NODEJS",
      },
    });
    child_proc.on("error", (err) => {
      if (err) {
        console.log("Build server failed with error\n", err);
      }
    });
    child_proc.on("close", (code) => {
      console.log("Generated app's server built with code", code);
      res();
    });
  });
}

function installDependencies(reactAppRootDest: string) {
  return new Promise<void>((res) => {
    const runYarnInstallScriptPath = require.resolve("yarn/bin/yarn.js");
    const child_proc = fork(runYarnInstallScriptPath, ["install"], {
      cwd: reactAppRootDest,
    });
    child_proc.on("error", (err) => {
      if (err) {
        console.log("Build server failed with error\n", err);
      }
    });
    child_proc.on("close", (code) => {
      console.log("Generated app's server built with code", code);
      res();
    });
  });
}

function buildServer(reactAppRootDest: string) {
  return new Promise<void>((res) => {
    const serverDestDirectoryPath = path.join(reactAppRootDest, "server");
    const tscPath = path.join(
      reactAppRootDest,
      "node_modules",
      "typescript",
      "bin",
      "tsc"
    );
    const child_proc = fork(tscPath, { cwd: serverDestDirectoryPath });
    child_proc.on("error", (err) => {
      if (err) {
        console.log("Build server failed with error\n", err);
      }
    });
    child_proc.on("close", (code) => {
      console.log("Generated app's server built with code", code);
      res();
    });
  });
}

function updateAppStoreWithControllerProps(
  options: AppBuildOptions,
  reactTemplateManager: ReturnType<typeof createReactAppTemplateManager>
) {
  const pages = options.appInfo.pages;
  const pageIds = Object.keys(pages);
  // if no controller props, then update props from app info
  const pageState = getPageStateAsCompIdMap(options.appInfo);
  pageIds.forEach((pageId) => {
    // add components
    const controllerPropsForPage = options.controllerProps[pageId]!;
    const componentGeneratorOutput =
      options.appInfo.pages[pageId].componentGeneratorOutput;
    reactTemplateManager.addComponents(pages[pageId], componentGeneratorOutput);
    // add props (maybe from controller or the old ones from app info)
    if (options && options.controllerProps && options.controllerProps[pageId]) {
      const compIds = Object.keys(componentGeneratorOutput);
      const newProps: PropsGeneratorOutput = {};
      compIds.forEach((compId) => {
        const comp = componentGeneratorOutput[compId];
        const oldProps =
          options.appInfo.pages[pageId].propsGeneratorOutput[compId].props;
        mergeWith(
          oldProps,
          controllerPropsForPage[comp.alias],
          mergeStateCustomizer
        );
        newProps[compId] = {
          ...options.appInfo.pages[pageId].propsGeneratorOutput[compId],
          props: oldProps,
        };
      });
      reactTemplateManager.addProps(pages[pageId], newProps);
    } else {
      console.log("found no props for pageId", pageId, "using app info");
      reactTemplateManager.addProps(pages[pageId], pageState[pageId]);
    }
  });
}

export default async function buildReactApp(
  toolConfig: ToolConfig,
  options: AppBuildOptions
) {
  const reactTemplateManager = getReactAppTemplateManager({
    outputDir: options.outputDir,
    rootComponentId: options.rootComponentId,
    assetManager: toolConfig.assetManager,
  });
  // install dependencies if node_modules is missing
  if (!fs.existsSync(path.resolve(options.outputDir, "node_modules"))) {
    await installDependencies(path.resolve(options.outputDir));
  }
  // run tsc if dist/server if missing
  if (!fs.existsSync(path.resolve(options.outputDir, "dist", "server"))) {
    await buildServer(path.resolve(options.outputDir));
  }
  // update props from controller if available
  updateAppStoreWithControllerProps(options, reactTemplateManager);
  reactTemplateManager.flushStore();
}
