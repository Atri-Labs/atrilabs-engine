import { Forest } from "@atrilabs/forest";
import generateModuleId from "@atrilabs/scripts/build/babel/generateModuleId";
import { CallbackHandler } from "@atrilabs/app-design-forest/lib/callbackHandlerTree";

export function extractCallbackHandlers(forest: Forest, compId: string) {
  let handlers: { [callbackName: string]: CallbackHandler } = {};
  const callbackHandlerTreeId = generateModuleId(
    "@atrilabs/app-design-forest/lib/callbackHandlerTree.js"
  );
  const callbackTree = forest.tree(callbackHandlerTreeId);
  if (callbackTree) {
    const link = callbackTree.links[compId];
    if (link) {
      const callbackNodeId = link.childId;
      const callbackNode = callbackTree.nodes[callbackNodeId];
      if (
        callbackNode &&
        callbackNode.state &&
        callbackNode.state["property"] &&
        callbackNode.state["property"]["callbacks"]
      ) {
        handlers = callbackNode.state["property"]["callbacks"];
      }
    }
  }
  return handlers;
}
