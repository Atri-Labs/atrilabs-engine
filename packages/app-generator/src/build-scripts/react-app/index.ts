import { ToolConfig } from "@atrilabs/core";
import { AppBuildOptions, PropsGeneratorOutput } from "../../types";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { createReactAppTemplateManager } from "../../react-app-template-manager";
import { getReactAppTemplateManager } from "../../getReactTemplateManager";

function installDependencies(reactAppRootDest: string) {
  exec("yarn install", { cwd: reactAppRootDest }, (err, stdout, stderr) => {
    if (err) {
      console.log("Installing packages failed with error\n", err);
    }
    if (stderr) {
      console.log("Installing packages stderr\n", stderr);
    }
    if (stdout) {
      console.log("Installed packages\n", stdout);
    }
  });
}

function buildServer(reactAppRootDest: string) {
  exec(
    "yarn run buildServer",
    { cwd: reactAppRootDest },
    (err, stdout, stderr) => {
      if (err) {
        console.log("Build server failed with error\n", err);
      }
      if (stderr) {
        console.log("Build server stderr\n", stderr);
      }
      if (stdout) {
        console.log("Server built\n", stdout);
      }
    }
  );
}

function updateAppStoreWithControllerProps(
  options: AppBuildOptions,
  reactTemplateManager: ReturnType<typeof createReactAppTemplateManager>
) {
  const pages = options.appInfo.pages;
  const pageIds = Object.keys(pages);
  pageIds.forEach((pageId) => {
    const componentGeneratorOutput =
      options.appInfo.pages[pageId].componentGeneratorOutput;
    reactTemplateManager.addComponents(pages[pageId], componentGeneratorOutput);
    const compIds = Object.keys(componentGeneratorOutput);
    const newProps: PropsGeneratorOutput = {};
    compIds.forEach((compId) => {
      const comp = componentGeneratorOutput[compId];
      newProps[compId] = {
        props: newProps[comp.alias],
      };
    });
    reactTemplateManager.addProps(pages[pageId], newProps);
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
    installDependencies(path.resolve(options.outputDir));
  }
  // run tsc if dist/server if missing
  if (!fs.existsSync(path.resolve(options.outputDir, "dist", "server"))) {
    buildServer(path.resolve(options.outputDir));
  }
  // update props from controller
  updateAppStoreWithControllerProps(options, reactTemplateManager);
  reactTemplateManager.flushStore();
}
