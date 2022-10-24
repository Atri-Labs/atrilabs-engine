import { useEffect } from "react";
import { createMachine, assign, Action, interpret } from "xstate";

import { getCoords } from "@atrilabs/canvas-runtime/src/utils";

import { DragData, NavigatorNode, StartDragArgs, Location } from "../types";

const START_DRAG_CALLED = "START_DRAG_CALLED" as "START_DRAG_CALLED";
const MOUSE_MOVE = "MOUSE_MOVE" as "MOUSE_MOVE";
const MOUSE_UP = "MOUSE_UP" as "MOUSE_UP";
const DROPPED = "DROPPED" as "DROPPED";

// event type
type DragDropMachineEvent =
  | {
      type: "START_DRAG_CALLED";
      args: StartDragArgs;
    }
  | { type: "MOUSE_MOVE"; args: { lastY: number } }
  | { type: "MOUSE_UP" }
  | { type: "DROPPED"; args: StartDragArgs };

type DragDropMachineContext = {
  startDragArgs: StartDragArgs | null;
  lastY: number | null;
};

// states
const idle = "idle";
const DRAG_START = "DRAG_START";
const DRAG = "DRAG";

const resetContextAction: Action<DragDropMachineContext, any> = assign({
  startDragArgs: (_context, _event) => null,
});

const updateLastYAction: Action<DragDropMachineContext, any> = assign({
  lastY: (_context, event) => event.args.lastY,
});

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

const dragDropMachine = createMachine<
  DragDropMachineContext,
  DragDropMachineEvent
>({
  id: "componentNavigatorDragDropMachine",
  context: { startDragArgs: null, lastY: null },
  initial: idle,
  states: {
    [idle]: {
      on: {
        [START_DRAG_CALLED]: {
          target: DRAG_START,
          actions: [onStartDragCalled],
        },
      },
    },
    [DRAG_START]: {
      on: {
        [MOUSE_MOVE]: { target: DRAG, actions: [updateLastYAction] },
        [MOUSE_UP]: { target: idle, actions: [resetContextAction] },
      },
    },
    [DRAG]: {
      on: {
        [DROPPED]: { target: DRAG, actions: [onDrop] },
        [MOUSE_MOVE]: { target: DRAG, actions: [updateLastYAction] },
        [MOUSE_UP]: { target: idle, actions: [resetContextAction] },
      },
    },
  },
});

const service = interpret(dragDropMachine);

// ============ API exposed to layers ====================================
function startDrag(dragData: DragData, lastY: number) {
  service.send({ type: START_DRAG_CALLED, args: { dragData, lastY } });
}

function dropDuringDrag(dragData: DragData, lastY: number) {
  service.send({ type: DROPPED, args: { dragData, lastY } });
}

function stopDrag() {
  service.send({ type: MOUSE_UP });
}

type DropSubscriber = (
  args: StartDragArgs,
  loc: Location,
  caughtBy: string
) => void;
const dropSubscribers: DropSubscriber[] = [];
export function subscribeNewDrop(cb: DropSubscriber) {
  dropSubscribers.push(cb);
  return () => {
    const index = dropSubscribers.findIndex((curr) => curr === cb);
    if (index >= 0) {
      dropSubscribers.splice(index, 1);
    }
  };
}

type DragSubscriber = (
  args: StartDragArgs,
  loc: Location,
  caughtBy: string | null
) => void;
const dragSubscribers: DragSubscriber[] = [];
export function subscribeNewDrag(cb: DragSubscriber) {
  dragSubscribers.push(cb);
  return () => {
    const index = dragSubscribers.findIndex((curr) => curr === cb);
    if (index >= 0) {
      dragSubscribers.splice(index, 1);
    }
  };
}

export function isNewDropInProgress() {
  return service.state.value !== idle;
}

// =============== hook used in Canvas component to enable drag & drop mechanism ==
export const useDragDrop = (
  node: NavigatorNode | null,
  openOrCloseMap: { [id: string]: boolean },
  patchCb: (
    nodeId: string,
    newParentId: string,
    newIndex: number,
    isMovingUp: boolean
  ) => void,
  setSelectedNode: (node: NavigatorNode | null) => void
) => {
  // start and end the service alongwith canvas runtime
  useEffect(() => {
    service.start();
    return () => {
      service.stop();
    };
  }, []);

  useEffect(() => {
    if (node == null) {
      return () => {};
    }
    const mouseMoveCb = (event: MouseEvent) => {
      if (isNewDropInProgress()) {
        const isMovingUp = event.pageY < (service.state.context.lastY || 0);
        const isMovingDown = event.pageY > (service.state.context.lastY || 0);
        service.send({ type: MOUSE_MOVE, args: { lastY: event.pageY } });
        if (!isMovingUp && !isMovingDown) {
          return;
        }
        const item = isMouseInsideBounds(event, node, openOrCloseMap);
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

        const toIndex = aboveOrBelowChildChildIndex(event, item, isMovingUp);
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
    const mouseUpCb = (event: MouseEvent) => {
      if (isNewDropInProgress()) {
        setSelectedNode(null);
        stopDrag();
      }
    };
    const mouseDownCb = (event: MouseEvent) => {
      if (!isNewDropInProgress()) {
        const item = isMouseInsideBounds(event, node, openOrCloseMap, true);
        if (item) {
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
    window.addEventListener("mousedown", mouseDownCb);
    window.addEventListener("mouseup", mouseUpCb);
    window.addEventListener("mousemove", mouseMoveCb);
    return () => {
      window.removeEventListener("mousedown", mouseDownCb);
      window.removeEventListener("mouseup", mouseUpCb);
      window.removeEventListener("mousemove", mouseMoveCb);
    };
  }, [node, openOrCloseMap, setSelectedNode, patchCb]);
  return {};
};

function isMouseInsideBounds(
  event: MouseEvent,
  node: NavigatorNode,
  openOrCloseMap: { [id: string]: boolean },
  considerNormalNode = false
): NavigatorNode | null {
  if (
    !considerNormalNode &&
    (!node.children || node.children.length === 0 || !openOrCloseMap[node.id])
  ) {
    return null;
  }
  const element = document.getElementById(`comp-nav-${node.id}`);
  if (!element) {
    return null;
  }
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
  if (inside && (!node.children || node.children.length === 0)) {
    return node;
  }
  const children = node.children;
  if (!children) {
    return node;
  }
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childInside = isMouseInsideBounds(
      event,
      child,
      openOrCloseMap,
      considerNormalNode
    );
    if (childInside) {
      return childInside;
    }
  }
  return node;
}

function aboveOrBelowChildChildIndex(
  event: MouseEvent,
  node: NavigatorNode,
  above: boolean
): number | null {
  const element = document.getElementById(`comp-nav-${node.id}`);
  if (!element || !node.children || node.children.length === 0) {
    return null;
  }
  const y = event.pageY;
  const children = node.children.sort((a, b) => a.index - b.index);
  let start = children.length - 1,
    end = -1,
    update = -1;
  if (above) {
    start = 0;
    end = children.length;
    update = 1;
  }
  for (let i = start; above ? i < end : i > end; i += update) {
    const child = children[i];

    const element = document.getElementById(`comp-nav-${child.id}`);
    if (!element) {
      continue;
    }
    const rect = getCoords(element);
    const isAbove = y <= rect.top;
    const isBelow = y >= rect.top + rect.height;
    if (above && isAbove) {
      return i;
    }
    if (!above && isBelow) {
      return i;
    }
  }
  return above ? children.length - 1 : 0;
}
