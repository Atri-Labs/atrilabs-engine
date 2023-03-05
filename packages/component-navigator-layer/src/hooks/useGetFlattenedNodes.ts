import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { flattenNavigatorNodes, transformTreeToNavigatorNode } from "../utils";
import { subscribeEditorMachine } from "@atrilabs/pwa-builder-manager";
import { BrowserForestManager } from "@atrilabs/core";
import { useEffect, useState, useCallback } from "react";
import { NavigatorNode } from "../types";

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

  return { flattenedNodes, nodeMap, toggleNode };
}
