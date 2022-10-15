import { useState, useEffect, useCallback } from "react";
import { api, BrowserForestManager, useTree } from "@atrilabs/core";
import { PatchEvent } from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { NavigatorNode } from "../types";
import { markAllNodesClosed, transformTreeToNavigatorNode } from "../utils";

export const useNavigatorNodes = () => {
  const [rootNavigatorNode, setRootNavigatorNode] =
    useState<NavigatorNode | null>(null);

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

    const rootnavigatorNode = transformTreeToNavigatorNode(
      compTree,
      newOpenOrCloseMap
    );

    setOpenOrCloseMap(newOpenOrCloseMap);
    setRootNavigatorNode(rootnavigatorNode);
  }, [compTree]);

  useEffect(() => {
    const unsub = BrowserForestManager.currentForest.subscribeForest(
      (update) => {
        if (update.treeId === ComponentTreeId) {
          const rootnavigatorNode = transformTreeToNavigatorNode(
            compTree,
            openOrCloseMap
          );
          setRootNavigatorNode(rootnavigatorNode);
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
    (nodeId: string, newParentId: string, newIndex: number) => {
      const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
      const forestId = BrowserForestManager.currentForest.forestId;
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
    []
  );

  return { rootNavigatorNode, toggleNode, patchCb };
};
