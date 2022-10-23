import { useState, useEffect, useCallback } from "react";
import { api, BrowserForestManager, useTree } from "@atrilabs/core";
import { PatchEvent, TreeNode } from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { NavigatorNode } from "../types";
import { markAllNodesClosed, transformTreeToNavigatorNode } from "../utils";

export const useNavigatorNodes = () => {
  const [rootNavigatorNode, setRootNavigatorNode] =
    useState<NavigatorNode | null>(null);

  const [nodeMap, setNodeMap] = useState<{ [id: string]: NavigatorNode }>({});

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
        if (update.treeId === ComponentTreeId) {
          const { rootNode, nodeMap } = transformTreeToNavigatorNode(
            compTree,
            openOrCloseMap
          );
          setNodeMap(nodeMap);
          setRootNavigatorNode(rootNode);
        }
      }
    );
    return unsub;
  }, [compTree, openOrCloseMap]);

  const toggleNode = useCallback((id: string) => {
    setOpenOrCloseMap((openOrCloseMap) => {
      return { ...openOrCloseMap, [id]: !openOrCloseMap[id] };
    });
  }, []);

  const patchCb = useCallback(
    (
      nodeId: string,
      newParentId: string,
      newIndex: number,
      isMovingUp: boolean
    ) => {
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
      for (let i = node.index; i < newIndex + 1 && !isMovingUp; i++) {
        if (parent.children[i].id === nodeId) {
          continue;
        }
        const slice = {
          parent: { id: newParentId, index: i - 1 },
        };
        console.log(parent.children[i].name, i - 1);
        const patchEvent: PatchEvent = {
          type: `PATCH$$${ComponentTreeId}`,
          slice,
          id: parent.children[i].id,
        };
        api.postNewEvents(forestPkgId, forestId, {
          events: [patchEvent],
          meta: { agent: "browser" },
          name: "REPOSITION",
        });
      }
      for (let i = newIndex; i < parent.children.length && isMovingUp; i++) {
        if (parent.children[i].id === nodeId) {
          continue;
        }
        const slice = {
          parent: { id: newParentId, index: i + 1 },
        };
        console.log(parent.children[i].name, i + 1);
        const patchEvent: PatchEvent = {
          type: `PATCH$$${ComponentTreeId}`,
          slice,
          id: parent.children[i].id,
        };
        api.postNewEvents(forestPkgId, forestId, {
          events: [patchEvent],
          meta: { agent: "browser" },
          name: "REPOSITION",
        });
      }
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

  return { rootNavigatorNode, nodeMap, toggleNode, patchCb, openOrCloseMap };
};
