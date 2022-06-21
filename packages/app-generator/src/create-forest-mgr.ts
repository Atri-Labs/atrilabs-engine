import { ToolConfig } from "@atrilabs/core";
import { ForestManager } from "@atrilabs/forest";

export function createForestMgr(toolConfig: ToolConfig) {
  const forestManager = require(toolConfig["forestManager"]["path"])["default"](
    toolConfig["forestManager"]["options"]
  );
  return forestManager as ForestManager;
}
