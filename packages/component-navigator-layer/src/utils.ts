import { manifestRegistryController } from "@atrilabs/core";
import { Tree } from "@atrilabs/forest";
import { componentApi } from "@atrilabs/pwa-builder-manager";
import { NavigatorNode } from "./types";
import type { MouseEvent } from "react";
import { CANVAS_ZONE_ROOT_ID } from "@atrilabs/atri-app-core/src/api";

export function markAllNodesClosed(
  nodeIds: string[],
  openOrCloseMap: { [id: string]: boolean }
) {
  nodeIds.forEach((nodeId) => {
    openOrCloseMap[nodeId] = false;
  });
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

function createNavigatorNodeForCanvasZone(options: {
  nodes: Tree["nodes"]; // all nodes of a page
  directChildIds: string[]; // direct children of the canvasZone
  openOrCloseMap: { [compId: string]: boolean };
  canvasOpenOrCloseMap: { [canvasZoneId: string]: boolean };
  canvasZoneId: string;
  parentChildMap: { [parentId: string]: string[] };
}): {
  canvasZoneNavigatorNode: NavigatorNode;
  nodeMap: { [compId: string]: NavigatorNode };
} {
  const {
    nodes,
    directChildIds,
    openOrCloseMap,
    canvasZoneId,
    canvasOpenOrCloseMap,
    parentChildMap,
  } = options;
  const canvasZoneNavigatorNode: NavigatorNode = {
    type: "canvasZone",
    id: canvasZoneId,
    name: canvasZoneId,
    open:
      canvasOpenOrCloseMap[canvasZoneId] !== undefined
        ? canvasOpenOrCloseMap[canvasZoneId]
        : false,
    children: [],
    index: 0,
    parentNode: null,
    depth: 0,
  };
  const nodeMap: { [id: string]: NavigatorNode } = {};
  const manifestRegistry = manifestRegistryController.readManifestRegistry();
  const toVisitNodeComponentNodes = [canvasZoneNavigatorNode];
  let currentIndex = 0;
  while (currentIndex < toVisitNodeComponentNodes.length) {
    const currentParentComponentNode = toVisitNodeComponentNodes[currentIndex];
    const currentChildIds =
      (currentParentComponentNode.type === "canvasZone"
        ? directChildIds
        : parentChildMap[currentParentComponentNode.id]) || [];

    currentChildIds.forEach((childId, index) => {
      const node = nodes[childId]!;
      const manifest = manifestRegistry[
        node.meta.manifestSchemaId
      ].manifests.find((curr) => {
        return (
          curr.pkg === node.meta.pkg && curr.manifest.meta.key === node.meta.key
        );
      });
      const acceptsChild = manifest?.manifest?.dev?.acceptsChild
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

    currentIndex++;
  }
  return { canvasZoneNavigatorNode, nodeMap };
}

/**
 *
 * @param tree
 * @param openOrCloseMap
 * @returns root navigator node
 */
export function transformTreeToNavigatorNode(
  tree: Tree,
  openOrCloseMap: { [compId: string]: boolean },
  canvasOpenOrCloseMap: { [canvasZoneId: string]: boolean }
): {
  canvasZoneNavigatorNodes: NavigatorNode[];
  nodeMap: { [compId: string]: NavigatorNode };
} {
  // arrange canvas zones in lexical fashion
  const compNodeIds = Object.keys(tree.nodes);
  const canvasZoneIdDirectChildrenMap: { [canvasZoneId: string]: string[] } =
    {};
  compNodeIds.forEach((compNodeId) => {
    if (
      tree.nodes[compNodeId].state.parent.id === CANVAS_ZONE_ROOT_ID &&
      tree.nodes[compNodeId].state.parent.canvasZoneId
    ) {
      canvasZoneIdDirectChildrenMap[
        tree.nodes[compNodeId]!.state.parent.canvasZoneId
      ]
        ? canvasZoneIdDirectChildrenMap[
            tree.nodes[compNodeId]!.state.parent.canvasZoneId
          ]!.push(compNodeId)
        : (canvasZoneIdDirectChildrenMap[
            tree.nodes[compNodeId]!.state.parent.canvasZoneId
          ] = [compNodeId]);
    }
  });
  // sort direct child
  Object.keys(canvasZoneIdDirectChildrenMap).forEach((canvasZoneId) => {
    canvasZoneIdDirectChildrenMap[canvasZoneId]!.sort((a, b) => {
      return (
        componentApi.getComponentNode(a).state.parent.index -
        componentApi.getComponentNode(b).state.parent.index
      );
    });
  });

  const sortedCanvasZoneIds = Object.keys(canvasZoneIdDirectChildrenMap).sort();

  const parentChildMap: { [parentId: string]: string[] } = Object.values(
    canvasZoneIdDirectChildrenMap
  )
    .flat()
    .reduce((prev, curr) => {
      return {
        ...prev,
        ...componentApi.createSortedParentChildMap(tree.nodes, curr),
      };
    }, {});

  const results = sortedCanvasZoneIds.map((canvasZoneId) => {
    return createNavigatorNodeForCanvasZone({
      nodes: tree.nodes,
      directChildIds: canvasZoneIdDirectChildrenMap[canvasZoneId],
      openOrCloseMap,
      canvasZoneId,
      canvasOpenOrCloseMap,
      parentChildMap,
    });
  });

  const canvasZoneNavigatorNodes = results.map(
    (result) => result.canvasZoneNavigatorNode
  );

  const nodeMap = results.reduce((prev, curr) => {
    return { ...prev, ...curr.nodeMap };
  }, {} as { [id: string]: NavigatorNode });

  return { canvasZoneNavigatorNodes, nodeMap };
}

function _flattenCanvasZoneNavigatorNode(
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
      _flattenCanvasZoneNavigatorNode(
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
export function flattenNavigatorNodes(
  canvasZoneNavigatorNodes: NavigatorNode[],
  respectOpenOrClose: boolean
) {
  return canvasZoneNavigatorNodes
    .map((canvasZoneNavigatorNode) => {
      const flattenNodes = [canvasZoneNavigatorNode];
      _flattenCanvasZoneNavigatorNode(
        flattenNodes,
        respectOpenOrClose,
        canvasZoneNavigatorNode,
        0
      );
      return flattenNodes;
    })
    .flat();
}
