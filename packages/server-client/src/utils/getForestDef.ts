import { ToolConfig } from "@atrilabs/core";
import { ForestDef, TreeDef } from "@atrilabs/forest";
import { generateModuleId } from "@atrilabs/scripts";

export function getForestDef(toolConfig: ToolConfig, appForestPkgId: string) {
  // create tree def and forest def from toolConfig
  const appForestEntry = toolConfig.forests[appForestPkgId];
  if (appForestEntry === undefined) {
    console.log(
      `appForestPkgId not found in toolConfig\nappForestPkgId: ${appForestPkgId}\nforestConfigs: ${JSON.stringify(
        toolConfig.forests,
        null,
        2
      )}`
    );
    return;
  }
  const treeDefs: TreeDef[] = appForestEntry.map((treeDef) => {
    return {
      defFn: require(treeDef.modulePath).default,
      id: generateModuleId(treeDef.modulePath),
      modulePath: treeDef.modulePath,
    };
  });
  const forestDef: ForestDef = {
    id: appForestPkgId,
    pkg: appForestPkgId,
    trees: treeDefs,
  };
  return forestDef;
}
