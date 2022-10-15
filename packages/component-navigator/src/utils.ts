import { manifestRegistryController } from "@atrilabs/core";
import { Tree } from "@atrilabs/forest";
import { createSortedParentChildMap } from "@atrilabs/canvas-runtime-utils";
import { NavigatorNode } from "./types";

export function markAllNodesClosed(
  nodeIds: string[],
  openOrCloseMap: { [id: string]: boolean }
) {
  nodeIds.forEach((nodeId) => {
    openOrCloseMap[nodeId] = false;
  });
}

function _transformTreeToComponentNode(
  tree: Tree,
  openOrCloseMap: { [compId: string]: boolean },
  parentChildMap: { [parentId: string]: string[] }
): NavigatorNode {
  const rootNodeId = "body";
  const rootComponentNode: NavigatorNode = {
    type: "acceptsChild",
    id: rootNodeId,
    name: "Root",
    open:
      openOrCloseMap[rootNodeId] !== undefined
        ? openOrCloseMap[rootNodeId]
        : false,
    children: [],
    index: 0,
    parentNode: null,
  };

  const manifestRegistry = manifestRegistryController.readManifestRegistry();

  const toVisitNodeComponentNodes = [rootComponentNode];
  let currentIndex = 0;
  while (currentIndex < toVisitNodeComponentNodes.length) {
    const currentParentComponentNode = toVisitNodeComponentNodes[currentIndex];
    const currentParentId = currentParentComponentNode.id;
    const currentChildIds = parentChildMap[currentParentId];
    if (currentChildIds) {
      currentChildIds.forEach((childId, index) => {
        const node = tree.nodes[childId]!;
        const manifest = manifestRegistry[
          node.meta.manifestSchemaId
        ].components.find((curr) => {
          return (
            curr.pkg === node.meta.pkg &&
            curr.component.meta.key === node.meta.key
          );
        });
        const acceptsChild = manifest?.component?.dev?.acceptsChild
          ? "acceptsChild"
          : "normal";
        const componentNode: NavigatorNode = {
          type: acceptsChild,
          id: node.id,
          name: node.state.alias,
          open:
            openOrCloseMap[node.id] !== undefined
              ? openOrCloseMap[node.id]
              : false,
          children: [],
          index: index,
          parentNode: currentParentComponentNode,
        };
        currentParentComponentNode.children?.push(componentNode);
        toVisitNodeComponentNodes.push(componentNode);
      });
    }

    currentIndex++;
  }
  return rootComponentNode;
}

/**
 *
 * @param tree
 * @param openOrCloseMap
 * @returns root navigator node
 */
export function transformTreeToNavigatorNode(
  tree: Tree,
  openOrCloseMap: { [compId: string]: boolean }
): NavigatorNode {
  // createSortedParentChildMap is an utiltiy function that
  // creates a map of parent id as key & array of child id as value
  const parentChildMap = createSortedParentChildMap(tree.nodes, "body");
  const rootComponentNode = _transformTreeToComponentNode(
    tree,
    openOrCloseMap,
    parentChildMap
  );
  return rootComponentNode;
}

function _flattenRootNavigatorNode(
  flattenNodes: NavigatorNode[],
  currentNode: NavigatorNode
) {
  const children = currentNode.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      flattenNodes.push(child);
      _flattenRootNavigatorNode(flattenNodes, child);
    }
  }
}

/**
 * Walks depth first and flattens all nodes in an array
 * @param rootComponentNode node to start walking from
 * @returns array of all nodes in depth first
 */
export function flattenRootNavigatorNode(rootComponentNode: NavigatorNode) {
  const flattenNodes = [rootComponentNode];
  _flattenRootNavigatorNode(flattenNodes, rootComponentNode);
  return flattenNodes;
}
