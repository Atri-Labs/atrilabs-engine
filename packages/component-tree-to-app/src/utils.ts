import { Forest, TreeNode } from "@atrilabs/forest";
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

export type ParentChildMap = { [parentId: string]: string[] };

/**
 * Filter out parent ids from lookup map that has been deleted
 * @param currentParentId
 * @param lookupMap
 * @param reverseMap
 */
function _createReverseMap(
  currentParentId: string,
  lookupMap: ParentChildMap,
  reverseMap: ParentChildMap
) {
  const childIds = reverseMap[currentParentId]!;
  childIds.forEach((childId) => {
    if (lookupMap[childId] !== undefined) {
      reverseMap[childId] = lookupMap[childId]!;
      _createReverseMap(childId, lookupMap, reverseMap);
    }
  });
}

export function createReverseMap(nodes: { [nodeId: string]: TreeNode }) {
  const nodeIds = Object.keys(nodes);
  // lookupMap helps to quickly find all the children of a parent
  // lookupMap can contain components that are children of a deleted component
  const lookupMap: ParentChildMap = { body: [] };
  // reverseMap does not contain components that are children of a deleted component
  const reverseMap: ParentChildMap = { body: [] };
  nodeIds.forEach((nodeId) => {
    const node = nodes[nodeId]!;
    const parentId = node.state.parent.id;
    // update lookup map
    if (lookupMap[parentId] === undefined) {
      lookupMap[parentId] = [nodeId];
    } else {
      lookupMap[parentId]!.push(nodeId);
    }
    // update reverse map with children of body only
    if (parentId === "body") {
      reverseMap["body"]!.push(node.id);
    }
  });
  _createReverseMap("body", lookupMap, reverseMap);
  return reverseMap;
}

export function getAllNodeIdsFromReverseMap(reverseMap: ParentChildMap) {
  const parentNodeIds = Object.keys(reverseMap);
  const childNodeIds = parentNodeIds
    .map((parentNodeId) => {
      return reverseMap[parentNodeId]!;
    })
    .flat();
  const nodeIds = new Set([...parentNodeIds, ...childNodeIds]);
  nodeIds.delete("body");
  return Array.from(nodeIds);
}
