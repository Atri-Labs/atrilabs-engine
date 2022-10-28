import { raiseHoverEvent, raiseSelectEvent } from "@atrilabs/canvas-runtime";
import { useCallback } from "react";
import { useNavigatorNodes } from "../hooks/useComponentNodes";
import { NavigatorNode } from "../types";
import { ComponentNavigator } from "./ComponentNavigator";
import { getComponentNode } from "@atrilabs/canvas-runtime-utils";

export const ComponentNavigatorWrapper = () => {
  const {
    rootNavigatorNode,
    toggleNode,
    repositionNavNode,
    patchCb,
    flattenedNodes,
  } = useNavigatorNodes();

  const onNavigatorNodeSelect = useCallback((compId: string) => {
    raiseSelectEvent(compId);
  }, []);

  const onNavigatorNodeHover = useCallback((compId: string) => {
    raiseHoverEvent(compId);
  }, []);

  const onChange = useCallback(
    (change: {
      id: string;
      parentId: string;
      index: number;
      oldNavIndex: number;
      movement: 1 | 0 | -1;
    }) => {
      // call reposition navigator node
      repositionNavNode(
        change.id,
        change.parentId,
        change.index,
        change.oldNavIndex,
        change.movement
      );
    },
    [repositionNavNode]
  );

  const onDragEnd = useCallback(
    (draggedNode: NavigatorNode) => {
      const parentId = draggedNode.parentNode!.id;

      if (draggedNode.index === 0) {
        const draggedNodesNextSibling = draggedNode.parentNode!.children![1];
        if (draggedNodesNextSibling !== undefined) {
          const fractionalIndex =
            getComponentNode(draggedNodesNextSibling.id).state.parent.index / 2;
          patchCb(draggedNode.id, parentId, fractionalIndex);
        } else {
          const fractionalIndex = 1;
          patchCb(draggedNode.id, parentId, fractionalIndex);
        }
      } else if (
        draggedNode.index ===
        draggedNode.parentNode!.children!.length - 1
      ) {
        const draggedNodesPrevSibling =
          draggedNode.parentNode!.children![draggedNode.index - 1];
        const fractionalIndex =
          getComponentNode(draggedNodesPrevSibling.id).state.parent.index * 2;
        patchCb(draggedNode.id, parentId, fractionalIndex);
      } else {
        const draggedNodesPrevSibling =
          draggedNode.parentNode!.children![draggedNode.index - 1];
        const draggedNodesNextSibling =
          draggedNode.parentNode!.children![draggedNode.index + 1];
        const fractionalIndex =
          (getComponentNode(draggedNodesPrevSibling.id).state.parent.index +
            getComponentNode(draggedNodesNextSibling.id).state.parent.index) /
          2;
        patchCb(draggedNode.id, parentId, fractionalIndex);
      }
    },
    [patchCb]
  );

  return (
    <>
      {rootNavigatorNode !== null ? (
        <ComponentNavigator
          flattenedNodes={flattenedNodes}
          onToggleOpen={toggleNode}
          onSelect={onNavigatorNodeSelect}
          onHover={onNavigatorNodeHover}
          onChange={onChange}
          onDragEnd={onDragEnd}
        />
      ) : null}
    </>
  );
};
