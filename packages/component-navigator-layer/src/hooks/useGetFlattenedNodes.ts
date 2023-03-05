import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { flattenNavigatorNodes, transformTreeToNavigatorNode } from "../utils";
import { subscribeEditorMachine } from "@atrilabs/pwa-builder-manager";
import { BrowserForestManager } from "@atrilabs/core";
import { useEffect, useState, useCallback } from "react";
import { NavigatorNode } from "../types";

function compute() {
  const tree = BrowserForestManager.currentForest.tree(ComponentTreeId)!;
  return transformTreeToNavigatorNode(tree, {}, {});
}

export function useGetFlattenedNodes() {
  const [flattenedNodes, setFlattenedNodes] = useState<NavigatorNode[]>([]);
  const [nodeMap, setNodeMap] = useState<{
    [compId: string]: NavigatorNode;
  }>({});

  const setAllStates = useCallback(() => {
    const { canvasZoneNavigatorNodes, nodeMap } = compute();
    setFlattenedNodes(flattenNavigatorNodes(canvasZoneNavigatorNodes, false));
    setNodeMap(nodeMap);
  }, []);

  useEffect(() => {
    const { canvasZoneNavigatorNodes } = compute();
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
          update.oldState.alias !== node.state.alias
        ) {
          setFlattenedNodes((value) => {
            nodeMap[node.id].name = node.state.alias;
            return [...value];
          });
        }
      }
    });
  }, [setAllStates, nodeMap]);
  return { flattenedNodes, nodeMap };
}
