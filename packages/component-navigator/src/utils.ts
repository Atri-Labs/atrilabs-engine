import { manifestRegistryController } from "@atrilabs/core";
import { Tree } from "@atrilabs/forest";
import { createSortedParentChildMap } from "@atrilabs/canvas-runtime-utils";
import { NavigatorNode } from "./types";
import type { MouseEvent } from "react";

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
): { rootNode: NavigatorNode; nodeMap: { [id: string]: NavigatorNode } } {
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
    depth: 0,
  };
  const nodeMap: { [id: string]: NavigatorNode } = {
    body: rootComponentNode,
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
        // this can happen when a new component is added to the canvas
        if (openOrCloseMap[node.id] === undefined) {
          openOrCloseMap[node.id] = false;
        }
        const componentNode: NavigatorNode = {
          type: acceptsChild,
          id: node.id,
          name: node.state.alias,
          open: openOrCloseMap[node.id],
          children: [],
          index: index,
          parentNode: currentParentComponentNode,
          depth: currentParentComponentNode.depth + 1,
        };
        nodeMap[componentNode.id] = componentNode;
        currentParentComponentNode.children?.push(componentNode);
        toVisitNodeComponentNodes.push(componentNode);
      });
    }

    currentIndex++;
  }
  return { rootNode: rootComponentNode, nodeMap: nodeMap };
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
): { rootNode: NavigatorNode; nodeMap: { [id: string]: NavigatorNode } } {
  // createSortedParentChildMap is an utiltiy function that
  // creates a map of parent id as key & array of child id as value
  const parentChildMap = createSortedParentChildMap(tree.nodes, "body");
  const result = _transformTreeToComponentNode(
    tree,
    openOrCloseMap,
    parentChildMap
  );
  return result;
}

function _flattenRootNavigatorNode(
  flattenNodes: NavigatorNode[],
  respectOpenOrClose: boolean,
  currentNode: NavigatorNode,
  currentTabs: number
) {
  const children = currentNode.children;
  const shouldTraverseChildren = respectOpenOrClose ? currentNode.open : true;
  if (children && shouldTraverseChildren) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      flattenNodes.push(child);
      _flattenRootNavigatorNode(
        flattenNodes,
        respectOpenOrClose,
        child,
        currentTabs + 1
      );
    }
  }
}

/**
 * Walks depth first and flattens all nodes in an array
 * @param rootComponentNode node to start walking from
 * @param respectOpenOrClose true if flatten node should node include closed nodes or its descendants
 * @returns array of all nodes in depth first
 */
export function flattenRootNavigatorNode(
  rootComponentNode: NavigatorNode,
  respectOpenOrClose: boolean
) {
  const flattenNodes = [rootComponentNode];
  _flattenRootNavigatorNode(
    flattenNodes,
    respectOpenOrClose,
    rootComponentNode,
    0
  );
  return flattenNodes;
}

export const tabbedContentHeight = 24;

export function getHoverIndex(
  ref: React.MutableRefObject<HTMLDivElement | null>,
  event: MouseEvent
) {
  if (ref.current) {
    const { y } = ref.current.getBoundingClientRect();
    const netY = event.clientY - y + ref.current.scrollTop;
    const hoverIndex = Math.floor(netY / tabbedContentHeight);
    if (hoverIndex < 0) {
      return 0;
    }
    return hoverIndex;
  }
}

export const horizontalStepSize = 10;
