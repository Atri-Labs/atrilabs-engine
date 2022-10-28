import { useState, useEffect, useCallback, useReducer } from "react";
import { api, BrowserForestManager, useTree } from "@atrilabs/core";
import { PatchEvent } from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { NavigatorNode } from "../types";
import {
  flattenRootNavigatorNode,
  markAllNodesClosed,
  transformTreeToNavigatorNode,
} from "../utils";

export const useNavigatorNodes = () => {
  const [, forceUpdate] = useReducer((c: number) => c + 1, 0);

  const [rootNavigatorNode, setRootNavigatorNode] =
    useState<NavigatorNode | null>(null);

  const [nodeMap, setNodeMap] = useState<{ [id: string]: NavigatorNode }>({});

  const [flattenedNodes, setFlattenedNodes] = useState<NavigatorNode[]>([]);
  useEffect(() => {
    if (rootNavigatorNode !== null) {
      const flattenedNodes = flattenRootNavigatorNode(rootNavigatorNode, true);
      setFlattenedNodes(flattenedNodes);
    }
  }, [rootNavigatorNode]);
  const reComputeFlattenedNodes = useCallback(() => {
    if (rootNavigatorNode === null) return;
    const flattenedNodes = flattenRootNavigatorNode(rootNavigatorNode, true);
    setFlattenedNodes(flattenedNodes);
  }, [rootNavigatorNode]);

  // keep a record of open/closed item
  const [openOrCloseMap, setOpenOrCloseMap] = useState<{
    [compId: string]: boolean;
  }>({});

  // compTree changes when user navigates from one page to another
  const compTree = useTree(ComponentTreeId);

  useEffect(() => {
    const newOpenOrCloseMap: { [id: string]: boolean } = {};
    // initially all nodes are closed
    const nodeIds = Object.keys(compTree.nodes);
    markAllNodesClosed(nodeIds, newOpenOrCloseMap);

    const { rootNode, nodeMap } = transformTreeToNavigatorNode(
      compTree,
      newOpenOrCloseMap
    );

    setNodeMap(nodeMap);
    setOpenOrCloseMap(newOpenOrCloseMap);
    setRootNavigatorNode(rootNode);
  }, [compTree]);

  useEffect(() => {
    const unsub = BrowserForestManager.currentForest.subscribeForest(
      (update) => {
        if (
          update.treeId === ComponentTreeId &&
          (update.type === "rewire" ||
            update.type === "wire" ||
            update.type === "dewire")
        ) {
          const { rootNode, nodeMap } = transformTreeToNavigatorNode(
            compTree,
            openOrCloseMap
          );
          setNodeMap(nodeMap);
          setOpenOrCloseMap({ ...openOrCloseMap });
          setRootNavigatorNode(rootNode);
        }
      }
    );
    return unsub;
  }, [compTree, openOrCloseMap]);

  const toggleNode = useCallback(
    (id: string) => {
      const navNode = nodeMap[id];
      navNode.open = !navNode.open;

      setOpenOrCloseMap((openOrCloseMap) => {
        return { ...openOrCloseMap, [id]: !openOrCloseMap[id] };
      });

      reComputeFlattenedNodes();
    },
    [nodeMap, reComputeFlattenedNodes]
  );

  /**
   * This function repositions a node in the component tree to a new index
   */
  const patchCb = useCallback(
    (nodeId: string, newParentId: string, newIndex: number) => {
      const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
      const forestId = BrowserForestManager.currentForest.forestId;
      const parent = nodeMap[newParentId];
      const node = nodeMap[nodeId];
      if (!parent || parent.type === "normal" || !node) {
        return;
      }
      if (!parent.children) {
        parent.children = [];
      }

      //finally update the node's index to the parent
      const slice = {
        parent: { id: newParentId, index: newIndex },
      };
      const patchEvent: PatchEvent = {
        type: `PATCH$$${ComponentTreeId}`,
        slice,
        id: nodeId,
      };
      api.postNewEvents(forestPkgId, forestId, {
        events: [patchEvent],
        meta: { agent: "browser" },
        name: "REPOSITION",
      });
    },
    [nodeMap]
  );

  /**
   * This function repositions a node in the navigator tree
   */
  const repositionNavNode = useCallback(
    (
      id: string,
      parentId: string,
      index: number,
      oldNavIndex: number,
      movement: 1 | 0 | -1
    ) => {
      // update following nav nodes: old parent, dragged nav node and new parent
      const navNode = nodeMap[id];
      const parentNavNode = nodeMap[parentId];
      if (parentNavNode.children === undefined) {
        parentNavNode.children = [];
      }
      navNode.parentNode?.children?.splice(navNode.index, 1);
      navNode.parentNode?.children?.forEach((node, index) => {
        node.index = index;
      });
      navNode.index = index;
      navNode.parentNode = parentNavNode;
      navNode.depth = parentNavNode.depth + 1;
      parentNavNode.children.splice(index, 0, navNode);
      parentNavNode.children.forEach((child, index) => {
        child.index = index;
      });

      // update flattendNodes
      setFlattenedNodes((old) => {
        const newFlatten = [...old];
        newFlatten.splice(oldNavIndex, 1);
        newFlatten.splice(oldNavIndex + movement, 0, navNode);
        return newFlatten;
      });
      forceUpdate();
    },
    [nodeMap]
  );

  return {
    rootNavigatorNode,
    nodeMap,
    flattenedNodes,
    toggleNode,
    patchCb,
    openOrCloseMap,
    repositionNavNode,
    reComputeFlattenedNodes,
  };
};
