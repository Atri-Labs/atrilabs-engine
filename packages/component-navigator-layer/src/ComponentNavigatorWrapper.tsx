import { ComponentNavigator } from "./components/ComponentNavigator";
import { useGetFlattenedNodes } from "./hooks/useGetFlattenedNodes";
import { useRef, useCallback, MouseEvent, useEffect } from "react";
import {
  sendMouseDownEvent,
  sendMouseMoveEvent,
  sendMouseUpEvent,
  subscribeDragEnd,
  subscribeReposition,
  subscribeWait,
} from "./dragDropMachine";
import { CANVAS_ZONE_ROOT_ID } from "@atrilabs/atri-app-core/src/api";
import { canvasApi, componentApi } from "@atrilabs/pwa-builder-manager";

export function ComponentNavigatorWrapper(props: {
  openClose: {
    openOrCloseMap: { [compId: string]: boolean };
    canvasOpenOrCloseMap: { [canvasZoneId: string]: boolean };
  };
}) {
  const { flattenedNodes, toggleNode, repositionNavNode, patchCb } =
    useGetFlattenedNodes(props.openClose);
  const componentNavigatorRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      sendMouseDownEvent(flattenedNodes, event, componentNavigatorRef);
    },
    [flattenedNodes]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (componentNavigatorRef.current) {
        const { y } = componentNavigatorRef.current.getBoundingClientRect();
        const netY =
          event.clientY - y + componentNavigatorRef.current.scrollTop;
        const hoverIndex = Math.floor(netY / 24);
        if (
          hoverIndex < flattenedNodes.length &&
          hoverIndex >= 0 &&
          flattenedNodes[hoverIndex].type !== "canvasZone"
        ) {
          canvasApi.raiseHoverEvent(flattenedNodes[hoverIndex].id);
        }
        sendMouseMoveEvent(event, flattenedNodes);
      }
    },
    [flattenedNodes]
  );

  const onMouseUp = useCallback((_event: MouseEvent) => {
    sendMouseUpEvent();
  }, []);

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (componentNavigatorRef.current) {
        const { y } = componentNavigatorRef.current.getBoundingClientRect();
        const netY =
          event.clientY - y + componentNavigatorRef.current.scrollTop;
        const hoverIndex = Math.floor(netY / 24);
        if (
          hoverIndex < flattenedNodes.length &&
          hoverIndex >= 0 &&
          flattenedNodes[hoverIndex].type !== "canvasZone"
        ) {
          canvasApi.raiseSelectEvent(flattenedNodes[hoverIndex].id);
        }
      }
    },
    [flattenedNodes]
  );

  useEffect(() => {
    const unsub = subscribeWait((context) => {
      const { draggedNode } = context;
      if (draggedNode?.open) {
        toggleNode(draggedNode);
      }
    });
    return unsub;
  }, [props, toggleNode]);

  useEffect(() => {
    const unsub = subscribeReposition(
      (id, parentNavNode, index, oldNavIndex, movement) => {
        // TODO: call repositionNavNode
        repositionNavNode(id, parentNavNode, index, oldNavIndex, movement);
      }
    );
    return unsub;
  }, [props, repositionNavNode]);

  useEffect(() => {
    const unsub = subscribeDragEnd((draggedNode) => {
      const parentId = draggedNode.parentNode!.id;
      const parentType = draggedNode.parentNode!.type;
      function getFractionalIndex() {
        if (draggedNode.index === 0) {
          const draggedNodesNextSibling = draggedNode.parentNode!.children![1];
          if (draggedNodesNextSibling !== undefined) {
            const fractionalIndex =
              componentApi.getComponentNode(draggedNodesNextSibling.id).state
                .parent.index / 2;
            return fractionalIndex;
          } else {
            const fractionalIndex = 1;
            return fractionalIndex;
          }
        } else if (
          draggedNode.index ===
          draggedNode.parentNode!.children!.length - 1
        ) {
          const draggedNodesPrevSibling =
            draggedNode.parentNode!.children![draggedNode.index - 1];
          const fractionalIndex =
            componentApi.getComponentNode(draggedNodesPrevSibling.id).state
              .parent.index * 2;
          return fractionalIndex;
        } else {
          const draggedNodesPrevSibling =
            draggedNode.parentNode!.children![draggedNode.index - 1];
          const draggedNodesNextSibling =
            draggedNode.parentNode!.children![draggedNode.index + 1];
          const fractionalIndex =
            (componentApi.getComponentNode(draggedNodesPrevSibling.id).state
              .parent.index +
              componentApi.getComponentNode(draggedNodesNextSibling.id).state
                .parent.index) /
            2;
          return fractionalIndex;
        }
      }
      function getCanvasZone() {
        let currNode = draggedNode;
        while (
          currNode.parentNode &&
          currNode.parentNode.type !== "canvasZone"
        ) {
          currNode = currNode.parentNode;
        }
        return currNode.parentNode?.id;
      }
      const canvasZoneId = getCanvasZone();
      if (canvasZoneId) {
        const newParent = {
          id: parentType === "canvasZone" ? CANVAS_ZONE_ROOT_ID : parentId,
          index: getFractionalIndex(),
          canvasZoneId,
        };
        patchCb(draggedNode.id, newParent);
      }
    });
    return unsub;
  }, [patchCb]);

  return (
    <ComponentNavigator
      ref={componentNavigatorRef}
      flattenedNodes={flattenedNodes}
      onToggleOpen={toggleNode}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onClick={onClick}
    />
  );
}
