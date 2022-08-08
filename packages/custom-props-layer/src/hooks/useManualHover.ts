import { useCallback } from "react";
import { raiseHoverEvent } from "@atrilabs/canvas-runtime";
import { useTree } from "@atrilabs/core";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";

export const useManualHover = () => {
  const compTree = useTree(ComponentTreeId);
  const hoverManually = useCallback((compId: string) => {
    raiseHoverEvent(compId);
  }, []);
  const getComponents = useCallback(() => {
    return Object.keys(compTree.nodes)
      .filter((nodeId) => {
        return compTree.nodes[nodeId].state.alias;
      })
      .map((nodeId) => {
        return { compId: nodeId, alias: compTree.nodes[nodeId].state.alias };
      });
  }, [compTree]);
  return { hoverManually, getComponents };
};
