import { BrowserForestManager } from "@atrilabs/core";
import { Id as ComponentTreeId } from "@atrilabs/app-design-forest/src/componentTree";
import { componentApi } from "@atrilabs/pwa-builder-manager";

export function getAliasList() {
  const aliasDict: { [alias: string]: boolean } = {};
  const tree = BrowserForestManager.currentForest.tree(ComponentTreeId);
  if (tree) {
    const reverseMap = componentApi.createReverseMap(tree.nodes, "body");
    const nodeIds = componentApi.getAllNodeIdsFromReverseMap(
      reverseMap,
      "body"
    );
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
