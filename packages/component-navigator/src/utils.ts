import { manifestRegistryController } from "@atrilabs/core";
import { Tree } from "@atrilabs/forest";
import { createSortedParentChildMap } from "@atrilabs/canvas-runtime-utils";
import { ComponentNode } from "./types";

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
): ComponentNode {
  const rootNodeId = "body";
  const rootComponentNode: ComponentNode = {
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
        const componentNode: ComponentNode = {
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
 * @returns
 */
export function transformTreeToComponentNode(
  tree: Tree,
  openOrCloseMap: { [compId: string]: boolean }
): ComponentNode {
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

export function flattenRootNode(rootComponentNode: ComponentNode) {
  const flattenNodes = [rootComponentNode];
  let currentIndex = 0;
  while (currentIndex < flattenNodes.length) {
    const current = flattenNodes[currentIndex];
    const children = current.children;
    if (children) {
      flattenNodes.push(...children);
    }
    currentIndex++;
  }
  return flattenNodes;
}
