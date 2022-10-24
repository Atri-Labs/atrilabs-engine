import { useEffect } from "react";
import { createMachine, assign, Action, interpret } from "xstate";

import { getCoords } from "@atrilabs/canvas-runtime/src/utils";

import {
  DragData,
  NavigatorNode,
  StartDragArgs,
  START_DRAG_CALLED,
  MOUSE_MOVE,
  MOUSE_UP,
  DROPPED,
  DragDropMachineEvent,
  DragDropMachineContext,
  idle,
  DRAG_START,
  DRAG,
} from "../types";
import { getNavigatorNodeDomId } from "../utils";

// actions for xstate

// reset the xstate to remove ht information about a drga item
const resetContextAction: Action<DragDropMachineContext, any> = assign({
  startDragArgs: (_context, _event) => null,
});

// updates the last y coordinate of the mouse.
// This is important for tracking if the mouse if moving up or moving down
const updateLastYAction: Action<DragDropMachineContext, any> = assign({
  lastY: (_context, event) => event.args.lastY,
});

// when the drag is started, this action sets the drag information
const onStartDragCalled: Action<
  DragDropMachineContext,
  {
    type: "START_DRAG_CALLED";
    args: StartDragArgs;
  }
> = assign({
  startDragArgs: (_context, event) => {
    return event.args;
  },
});

// when a drop is initiated during the drag.
// this action updates the information of drag start as the old drag start information is invalid.
const onDrop: Action<
  DragDropMachineContext,
  {
    type: "DROPPED";
    args: StartDragArgs;
  }
> = assign({
  startDragArgs: (_context, event) => {
    return event.args;
  },
});

//xstate machine states
const dragDropMachine = createMachine<
  DragDropMachineContext,
  DragDropMachineEvent
>({
  id: "componentNavigatorDragDropMachine",
  context: { startDragArgs: null, lastY: null },
  initial: idle,
  states: {
    // from idle position the machine can go into drag start
    [idle]: {
      on: {
        [START_DRAG_CALLED]: {
          target: DRAG_START,
          actions: [onStartDragCalled],
        },
      },
    },
    // from drag start the drag can happen when move moves.
    // When mouse is released, the drag stops and go back to idle
    [DRAG_START]: {
      on: {
        [MOUSE_MOVE]: { target: DRAG, actions: [updateLastYAction] },
        [MOUSE_UP]: { target: idle, actions: [resetContextAction] },
      },
    },
    // during a drag, either the item can be dropped or keep on dragging.
    // When mouse is released the drag stops and go back to idle
    [DRAG]: {
      on: {
        [DROPPED]: { target: DRAG, actions: [onDrop] },
        [MOUSE_MOVE]: { target: DRAG, actions: [updateLastYAction] },
        [MOUSE_UP]: { target: idle, actions: [resetContextAction] },
      },
    },
  },
});

//xstate service to interact with the xstate machine
const service = interpret(dragDropMachine);

//API function to update the xstate
function startDrag(dragData: DragData, lastY: number) {
  service.send({ type: START_DRAG_CALLED, args: { dragData, lastY } });
}

function updateMousePosition(lastY: number) {
  service.send({ type: MOUSE_MOVE, args: { lastY } });
}

function dropDuringDrag(dragData: DragData, lastY: number) {
  service.send({ type: DROPPED, args: { dragData, lastY } });
}

function stopDrag() {
  service.send({ type: MOUSE_UP });
}

function isNewDropInProgress() {
  return service.state.value !== idle;
}

// =============== hook used in Component Navigator to enable drag & drop mechanism ==
/**
 * useDragDrop hook enabled to drag and drop the nodes inside navigator
 * @param rootParentNode the root node of the component navigator. Expected it to be `body`
 * @param openOrCloseMap open/close state of the navigator nodes that acceepts children
 * @param patchCb the patch function to send the patch event to canvas to update the nodes
 * @param setSelectedNode to set the selected node. This is used to set and reset the node selection during dragging
 */
export const useDragDrop = (
  rootParentNode: NavigatorNode | null,
  openOrCloseMap: { [id: string]: boolean },
  patchCb: (
    nodeId: string,
    newParentId: string,
    newIndex: number,
    isMovingUp: boolean
  ) => void,
  setSelectedNode: (node: NavigatorNode | null) => void
) => {
  // start and end the service along with use drag drop hook
  useEffect(() => {
    service.start();
    return () => {
      service.stop();
    };
  }, []);

  // add the listeners to mouse down, mouse up, move move to track drags
  useEffect(() => {
    if (rootParentNode == null) {
      return () => {};
    }

    const mouseDown = mouseDownCb(
      rootParentNode,
      openOrCloseMap,
      setSelectedNode
    );
    const mouseUp = mouseUpCb(setSelectedNode);
    const mouseMove = mouseMoveCb(rootParentNode, openOrCloseMap, patchCb);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [rootParentNode, openOrCloseMap]);
  return {};
};

/**
 * mouseMoveCb returns a listerner to move move event.
 * This event will track the drag and initiates the drop if the node's position is changed
 * @param rootParentNode the root node of the component navigator. Expected it to be `body`
 * @param openOrCloseMap open/close state of the navigator nodes that acceepts children
 * @param patchCb the patch function to send the patch event to canvas to update the nodes
 * @returns the handler to listen to mouse move event
 */
const mouseMoveCb = (
  rootParentNode: NavigatorNode,
  openOrCloseMap: { [id: string]: boolean },
  patchCb: (
    nodeId: string,
    newParentId: string,
    newIndex: number,
    isMovingUp: boolean
  ) => void
) => {
  return (event: MouseEvent) => {
    if (isNewDropInProgress()) {
      const isMovingUp = event.pageY < (service.state.context.lastY || 0);
      const isMovingDown = event.pageY > (service.state.context.lastY || 0);
      updateMousePosition(event.pageY);
      if (!isMovingUp && !isMovingDown) {
        return;
      }
      const item = getNearestParentNode(event, rootParentNode, openOrCloseMap);
      const context = service.state.context.startDragArgs;
      if (
        !item ||
        !context ||
        item.id === context.dragData.id ||
        item.type !== "acceptsChild"
      ) {
        return;
      }
      const currentIndex = context.dragData.currentIndex;

      const toIndex = nearestNavigatorNodeIndex(event, item, isMovingUp);
      if (
        toIndex == null ||
        !item.children ||
        (item.id === context.dragData.parentId &&
          isMovingUp &&
          toIndex >= currentIndex) ||
        (item.id === context.dragData.parentId &&
          isMovingDown &&
          toIndex <= currentIndex)
      ) {
        return;
      }

      const newIndexItem = item.children[toIndex];
      if (!newIndexItem || newIndexItem.id === context.dragData.id) {
        return;
      }
      dropDuringDrag(
        {
          id: context.dragData.id,
          parentId: item.id,
          currentIndex: toIndex,
        },
        event.pageY
      );
      patchCb(context.dragData.id, item.id, toIndex, isMovingUp);
    }
  };
};

/**
 * mouseUpCb returns a listener to mouse up event. With this event we conclude a drag
 * @param setSelectedNode to set the selected node. This is used to reset the node selection during dragging
 * @returns the handler to listen to mouse up event
 */
const mouseUpCb = (setSelectedNode: (node: NavigatorNode | null) => void) => {
  return (_: MouseEvent) => {
    // if adrop is already in progress, stop the drag
    if (isNewDropInProgress()) {
      setSelectedNode(null);
      stopDrag();
    }
  };
};

/**
 * mouseDownCb returns a listener to mouse down event. With this event we start a drag
 * @param rootParentNode the root node of the component navigator. Expected it to be `body`
 * @param openOrCloseMap open/close state of the navigator nodes that acceepts children
 * @param setSelectedNode to set the selected node. This is used to set the node selection when dragging starts
 * @returns the handler to listen to mouse down event
 */
const mouseDownCb = (
  rootParentNode: NavigatorNode,
  openOrCloseMap: { [id: string]: boolean },
  setSelectedNode: (node: NavigatorNode | null) => void
) => {
  return (event: MouseEvent) => {
    // we will initiate a drag if and only if a drag not in progress
    if (!isNewDropInProgress()) {
      // we get the nearest parent node
      // if the node exists, we start the drag for the node
      const item = getNearestParentNode(
        event,
        rootParentNode,
        openOrCloseMap,
        true
      );
      if (item) {
        // we will set the selected node as the node that is being dragged.
        //This will enable to give differential coloring to the same and margin overlay for the component in canvas
        setSelectedNode(item);
        startDrag(
          {
            id: item.id,
            parentId: item.parentNode?.id || "",
            currentIndex: item.index,
          },
          event.pageY
        );
      }
    }
  };
};

/**
 * getNearestParentNode returns the deepest level parent node inside which the mouse is hovering
 * @param event mouse event to detect if the mouse inside a parent node in the navigator
 * @param parentNode the parent node. We assume, if the mouse will be always inside the root parent when this function is called
 * @param openOrCloseMap  open/close state of the navigator nodes that accepts children
 * @param considerNormalNode should we consider normal node as well. If false, we will only consider the nodes that accepts children
 * @returns
 */
function getNearestParentNode(
  event: MouseEvent,
  parentNode: NavigatorNode,
  openOrCloseMap: { [id: string]: boolean },
  considerNormalNode = false
): NavigatorNode | null {
  /*
   * if the normal mode is not enabled, then discard the node if it doesn't have any children
   * check if the parent node is valid
   * check if the mouse within the bounds of the parent node
   * If inside the parent node, then check if it inside any of the children by
   */
  // if the normal flag is not up, discard the ones that either doesn't have any children or the parent is not open
  if (
    !considerNormalNode &&
    (!parentNode.children ||
      parentNode.children.length == 0 ||
      !openOrCloseMap[parentNode.id])
  ) {
    return null;
  }

  //checking if the parent node is valid or not
  const element = document.getElementById(getNavigatorNodeDomId(parentNode.id));
  if (!element) {
    return null;
  }

  //checking if the mouse pointer is inside the parent node
  const rect = getCoords(element);
  const x = event.clientX,
    y = event.clientY;
  const inside = !(
    x <= rect.left ||
    x >= rect.left + rect.width ||
    y <= rect.top ||
    y >= rect.top + rect.height
  );
  if (!inside) {
    return null;
  }

  //if the mouse is indide the parent node and the node doesn't have any children , return the parent node
  if (inside && (!parentNode.children || parentNode.children.length === 0)) {
    return parentNode;
  }
  const children = parentNode.children;
  if (!children) {
    return parentNode;
  }

  //if children exists, check if the mouse is inside any of the children
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const insideChild = getNearestParentNode(
      event,
      child,
      openOrCloseMap,
      considerNormalNode
    );
    if (insideChild) {
      return insideChild;
    }
  }
  return parentNode;
}

/**
 * nearestNavigatorNodeIndex gets the index of the nearest navigator node above or below mouse for a given parent node
 * @param event mouse event to check if the there any nodes below/above it
 * @param node parent navigator node for which the nearest child to mouse has to be found
 * @param above denotes if we have to find the nearest navigator node above or below the mouse pointer
 * @returns index of the nearest child node. Will return null of the parent node is invalid or children doesn't exist
 */
function nearestNavigatorNodeIndex(
  event: MouseEvent,
  node: NavigatorNode,
  above: boolean
): number | null {
  /*
   * First we will check if the given parent node id is valid or not by checking if a dom element exist for the same
   * Get the current mouse pointer's y location
   * Set the variables for looping over and check if the children of the given parent node are near to the mouse pointer
   * Iterate and check if the coordinates of the children elements are above or below the mouse pointer
   */
  // validating the dom element corresponding to the node
  const element = document.getElementById(getNavigatorNodeDomId(node.id));
  if (!element || !node.children || node.children.length === 0) {
    return null;
  }
  // getting the current mouse pointer y location
  const y = event.pageY;
  // sorting the children according to the index.
  // This will absorb the order issues in children array;
  // that happened due to the drops during the drag
  const children = node.children.sort((a, b) => a.index - b.index);

  // if we are checking nearest node below the mouse pointer
  // we start from the end child of the node
  let start = children.length - 1,
    end = -1,
    update = -1;
  // else we start from the first child to catch the first one
  if (above) {
    start = 0;
    end = children.length;
    update = 1;
  }
  for (let i = start; above ? i < end : i > end; i += update) {
    const child = children[i];

    const element = document.getElementById(getNavigatorNodeDomId(child.id));
    if (!element) {
      continue;
    }
    const rect = getCoords(element);
    // these will ensure we point to an index obly after the mouse completely above or below the node
    const isAbove = y <= rect.top;
    const isBelow = y >= rect.top + rect.height;
    if (above && isAbove) {
      return i;
    }
    if (!above && isBelow) {
      return i;
    }
  }
  // if no match is find the pointer is either in in the begging or end of the children
  return above ? children.length - 1 : 0;
}
