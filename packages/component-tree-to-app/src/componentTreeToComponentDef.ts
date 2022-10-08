import type {
  ComponentGeneratorFunction,
  ComponentGeneratorOutput,
} from "@atrilabs/app-generator";
import { TreeNode } from "@atrilabs/forest";
import generateModuleId from "@atrilabs/scripts/build/babel/generateModuleId";

type ParentChildMap = { [parentId: string]: string[] };

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

function createReverseMap(nodes: { [nodeId: string]: TreeNode }) {
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

function getAllNodeIdsFromReverseMap(reverseMap: ParentChildMap) {
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

const componentTreeToComponentDef: ComponentGeneratorFunction = (options) => {
  const output: ComponentGeneratorOutput = {};
  const componentTreeId = generateModuleId(
    "@atrilabs/app-design-forest/lib/componentTree"
  );
  if (options.forestDef.trees[0]?.id === componentTreeId) {
    const forest = options.forest;
    const componentTree = forest.tree(componentTreeId);
    if (componentTree) {
      const nodes = componentTree.nodes;
      const reverseMap = createReverseMap(nodes);
      const nodeIds = getAllNodeIdsFromReverseMap(reverseMap);
      for (let i = 0; i < nodeIds.length; i++) {
        const nodeId = nodeIds[i]!;
        const node = nodes[nodeId]!;
        const key = node.meta["key"];
        const pkg = node.meta["pkg"];
        if (
          node.state["alias"] &&
          typeof node.state["alias"] === "string" &&
          key &&
          pkg
        ) {
          const alias = node.state["alias"];
          const component = options.getComponentFromManifest({ pkg, key });
          if (component)
            output[nodeId] = {
              alias,
              exportedVarName: component.exportedVarName,
              modulePath: component.modulePath,
              parent: node.state.parent,
            };
        }
      }
    }
  }
  return output;
};

export default componentTreeToComponentDef;
