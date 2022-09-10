import { ToolConfig } from "@atrilabs/core";
import { createReactAppTemplateManager } from "./react-app-template-manager";
import {
  atriAppIndexHtmlTemplateFilepath,
  getAllInfos,
  getAtriAppIndexHtmlDestFilepath,
  getReactAppDestPath,
  getReactAppNodeDestPath,
  getReactAppServerDestPath,
  getReactPackageJSONDestPath,
  reactAppNodeTemplatePath,
  reactAppPackageJSON,
  reactAppRootTemplate,
  reactAppServerTemplatePath,
  reactAppTemplatePath,
  reactAppToCopyToRoot,
} from "./utils";

// A helper function to create react app template manager.
export function getReactAppTemplateManager(options: {
  outputDir: string;
  rootComponentId: string;
  assetManager: ToolConfig["assetManager"];
}) {
  const reactAppDestPath = getReactAppDestPath(options.outputDir);
  const reactAppServerDestPath = getReactAppServerDestPath(options.outputDir);
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
    options.assetManager,
    infos
  );
  return reactTemplateManager;
}
