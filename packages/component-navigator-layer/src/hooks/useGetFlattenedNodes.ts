import { Id as ComponentTreeId } from "@atrilabs/app-design-forest/src/componentTree";
import { flattenNavigatorNodes, transformTreeToNavigatorNode } from "../utils";
import { api, subscribeEditorMachine } from "@atrilabs/pwa-builder-manager";
import { BrowserForestManager } from "@atrilabs/core";
import { useEffect, useState, useCallback } from "react";
import { NavigatorNode } from "../types";
import { PatchEvent } from "@atrilabs/forest";

function compute(props: {
  openOrCloseMap: { [compId: string]: boolean };
  canvasOpenOrCloseMap: { [canvasZoneId: string]: boolean };
}) {
  const tree = BrowserForestManager.currentForest.tree(ComponentTreeId)!;
  return transformTreeToNavigatorNode(
    tree,
    props.openOrCloseMap,
    props.canvasOpenOrCloseMap
  );
}

export function useGetFlattenedNodes(props: {
  openOrCloseMap: { [compId: string]: boolean };
  canvasOpenOrCloseMap: { [canvasZoneId: string]: boolean };
}) {
  const [flattenedNodes, setFlattenedNodes] = useState<NavigatorNode[]>([]);
  const [nodeMap, setNodeMap] = useState<{
    [compId: string]: NavigatorNode;
  }>({});

  const setAllStates = useCallback(() => {
    const { canvasZoneNavigatorNodes, nodeMap } = compute({
      openOrCloseMap: props.openOrCloseMap,
      canvasOpenOrCloseMap: props.canvasOpenOrCloseMap,
    });
    setFlattenedNodes(flattenNavigatorNodes(canvasZoneNavigatorNodes, true));
    setNodeMap(nodeMap);
  }, [props.canvasOpenOrCloseMap, props.openOrCloseMap]);

  useEffect(() => {
    setAllStates();
  }, [setAllStates]);

  useEffect(() => {
    return subscribeEditorMachine("after_app_load", () => {
      setAllStates();
    });
  }, [setAllStates]);

  useEffect(() => {
    return BrowserForestManager.currentForest.subscribeForest((update) => {
      if (
        update.treeId === ComponentTreeId &&
        (update.type === "rewire" ||
          update.type === "wire" ||
          update.type === "dewire")
      ) {
        setAllStates();
      } else if (
        update.treeId === ComponentTreeId &&
        update.type === "change"
      ) {
        // check if alias has changed
        const tree = BrowserForestManager.currentForest.tree(ComponentTreeId)!;
        const node = tree.nodes[update.id];
        if (
          update.oldState.alias &&
          update.oldState.alias !== node.state.alias &&
          nodeMap[node.id]
        ) {
          setFlattenedNodes((value) => {
            nodeMap[node.id].name = node.state.alias;
            return [...value];
          });
        }
      }
    });
  }, [setAllStates, nodeMap]);

  const toggleNode = useCallback(
    (navigatorNode: NavigatorNode) => {
      if (navigatorNode.type === "canvasZone") {
        props.canvasOpenOrCloseMap[navigatorNode.id] =
          props.canvasOpenOrCloseMap[navigatorNode.id] === undefined
            ? true
            : !props.canvasOpenOrCloseMap[navigatorNode.id];
        setAllStates();
      }
      if (navigatorNode.type === "acceptsChild") {
        props.openOrCloseMap[navigatorNode.id] =
          props.openOrCloseMap[navigatorNode.id] === undefined
            ? true
            : !props.openOrCloseMap[navigatorNode.id];
        setAllStates();
      }
    },
    [props.canvasOpenOrCloseMap, props.openOrCloseMap, setAllStates]
  );

  /**
   * This function repositions a node in the navigator tree
   */
  const repositionNavNode = useCallback(
    (
      id: string,
      parentNavNode: NavigatorNode,
      index: number,
      oldNavIndex: number,
      movement: 2 | 1 | 0 | -1 | -2
    ) => {
      // update following nav nodes: old parent, dragged nav node and new parent
      const navNode = nodeMap[id];
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
    },
    [nodeMap]
  );

  /**
   * This function repositions a node in the component tree to a new index
   */
  const patchCb = useCallback(
    (
      nodeId: string,
      newParent: { id: string; index: number; canvasZoneId: string }
    ) => {
      const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
      const forestId = BrowserForestManager.currentForest.forestId;
      const slice = {
        parent: newParent,
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

  return { flattenedNodes, nodeMap, toggleNode, repositionNavNode, patchCb };
}
