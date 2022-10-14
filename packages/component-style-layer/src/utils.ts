import { BrowserForestManager } from "@atrilabs/core";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import {
  createReverseMap,
  getAllNodeIdsFromReverseMap,
} from "@atrilabs/canvas-runtime-utils";

export function getAliasList() {
  const aliasDict: { [alias: string]: boolean } = {};
  const tree = BrowserForestManager.currentForest.tree(ComponentTreeId);
  if (tree) {
    const reverseMap = createReverseMap(tree.nodes, "body");
    const nodeIds = getAllNodeIdsFromReverseMap(reverseMap, "body");
    nodeIds.forEach((nodeId) => {
      const node = tree.nodes[nodeId];
      if (node.state.alias) {
        aliasDict[node.state.alias] = true;
      }
    });
  } else {
    console.log("Expected component tree to exist");
  }
  return aliasDict;
}
