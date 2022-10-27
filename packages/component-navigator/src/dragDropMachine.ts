import { createMachine, interpret, assign } from "xstate";
import { NavigatorNode } from "./types";
import type { MouseEvent } from "react";
import { getHoverIndex, horizontalStepSize } from "./utils";

type DragDropMachineContext = {
  // assign before entering dragInProgress state
  rootNode?: NavigatorNode;
  flattendedNodes?: NavigatorNode[];
  containerRef?: React.MutableRefObject<HTMLDivElement | null>; // assuming ref won't change during transition
  draggedNode?: NavigatorNode;
  // assign after every successful drag in y/x direction
  // also assign before entering dragInProgress state
  draggedNodeIndexInFlattenedArray?: number;
  initialX?: number;
};

type MouseDownEvent = {
  type: "mouseDown";
  rootNode: NavigatorNode;
  flattenedNodes: NavigatorNode[];
  draggedNodeIndexInFlattenedArray: number;
  initialX: number;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
};
type MouseMoveEvent = { type: "mouseMove"; event: MouseEvent };
type MouseUpEvent = { type: "mouseUp" };
type ClosedNavigatorNodeEvent = {
  type: "closedNavigatorNodeEvent";
  rootNode: NavigatorNode;
  flattenedNodes: NavigatorNode[];
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  draggedNodeIndexInFlattenedArray: number;
};
type DragDropMachineEvent =
  | MouseDownEvent
  | MouseMoveEvent
  | MouseUpEvent
  | ClosedNavigatorNodeEvent;

// states
const idle = "idle";
const dragInProgress = "dragInProgress";
export const waitingForNodesToClose = "waitingForNodesToClose";

// actions
const onMouseDownAction = assign<DragDropMachineContext, MouseDownEvent>(
  (_context, event) => {
    const { draggedNodeIndexInFlattenedArray, flattenedNodes } = event;
    if (
      draggedNodeIndexInFlattenedArray !== undefined &&
      flattenedNodes !== undefined
    ) {
      const draggedNode = flattenedNodes[draggedNodeIndexInFlattenedArray];
      return { ...event, draggedNode };
    } else {
      // TODO: throw error. this should not happen.
      return {};
    }
  }
);

const onMouseMoveAction = assign<DragDropMachineContext, MouseMoveEvent>(
  (context, event) => {
    const { containerRef } = context;
    if (containerRef !== undefined && containerRef.current !== null) {
      // check vertical movement
      const { y } = containerRef.current.getBoundingClientRect();
      const netY = event.event.clientY - y + containerRef.current.scrollTop;
      const newIndex = Math.floor(netY / 24);
      if (
        newIndex !== context.draggedNodeIndexInFlattenedArray &&
        newIndex >= 0
      ) {
        // TODO: call callbacks for reposition
        context.initialX = event.event.clientX;
        context.draggedNodeIndexInFlattenedArray = newIndex;
        console.log("change position", newIndex);
      }

      // check horizontal movement on left direction
      else if (
        context.initialX !== undefined &&
        context.initialX - event.event.clientX >= horizontalStepSize
      ) {
        context.initialX = context.initialX - horizontalStepSize;
        console.log("move left");
        // TODO: call callbacks if possible to move left
      }

      // check horizontal movement on right direction
      else if (
        context.initialX !== undefined &&
        context.initialX - event.event.clientX <= -horizontalStepSize
      ) {
        context.initialX = context.initialX + horizontalStepSize;
        console.log("move right");
        // TODO: call callbacks if possible to move right
      }
    }
    return context;
  }
);

const onMouseUpAction = assign<DragDropMachineContext, MouseUpEvent>(() => {
  return {};
});

const onClosedNodeAction = assign<
  DragDropMachineContext,
  ClosedNavigatorNodeEvent
>((context, event) => {
  return { ...context, ...event };
});

// guards
const shouldNotBeOpen = (
  _context: DragDropMachineContext,
  event: MouseDownEvent
) => {
  const { flattenedNodes, draggedNodeIndexInFlattenedArray } = event;
  if (
    draggedNodeIndexInFlattenedArray !== undefined &&
    flattenedNodes !== undefined
  ) {
    const draggedNavNode = flattenedNodes[draggedNodeIndexInFlattenedArray];
    if (draggedNavNode.open && draggedNavNode.type === "acceptsChild") {
      return false;
    }
  }
  return true;
};

type WaitSubsriber = (context: DragDropMachineContext) => void;
const waitSubscribers: WaitSubsriber[] = [];
export function subscribeWait(cb: WaitSubsriber) {
  waitSubscribers.push(cb);
  return () => {
    const foundIndex = waitSubscribers.findIndex((value) => {
      return value === cb;
    });
    if (foundIndex >= 0) {
      waitSubscribers.splice(foundIndex, 1);
    }
  };
}
function callWaitSubscribers(context: DragDropMachineContext) {
  waitSubscribers.forEach((cb) => {
    cb(context);
  });
}

const navigatorDragDropMachine = createMachine<
  DragDropMachineContext,
  DragDropMachineEvent
>({
  id: "navigatorDragDropMachine",
  context: {},
  initial: idle,
  states: {
    [idle]: {
      on: {
        mouseDown: [
          {
            target: dragInProgress,
            actions: [onMouseDownAction],
            cond: shouldNotBeOpen,
          },
          { target: waitingForNodesToClose, actions: [onMouseDownAction] },
        ],
      },
    },
    [dragInProgress]: {
      on: {
        mouseMove: { target: dragInProgress, actions: [onMouseMoveAction] },
        mouseUp: { target: idle, actions: [onMouseUpAction] },
      },
    },
    [waitingForNodesToClose]: {
      on: {
        closedNavigatorNodeEvent: {
          target: dragInProgress,
          actions: [onClosedNodeAction],
        },
      },
      entry: (context) => {
        callWaitSubscribers(context);
      },
    },
  },
});

const service = interpret(navigatorDragDropMachine);
service.start();

export function sendMouseDownEvent(
  rootNode: NavigatorNode,
  flattenedNodes: NavigatorNode[],
  event: MouseEvent,
  containerRef: React.MutableRefObject<HTMLDivElement | null>
) {
  const hoverIndex = getHoverIndex(containerRef, event);
  if (hoverIndex !== undefined) {
    return service.send({
      type: "mouseDown",
      rootNode,
      flattenedNodes,
      draggedNodeIndexInFlattenedArray: hoverIndex!,
      initialX: event.clientX,
      containerRef,
    });
  }
}

export function sendMouseMoveEvent(event: MouseEvent) {
  return service.send({ type: "mouseMove", event });
}

export function sendMouseUpEvent() {
  return service.send({ type: "mouseUp" });
}

export function sendClosedNodeEvent(
  rootNode: NavigatorNode,
  flattenedNodes: NavigatorNode[],
  draggedNodeIndexInFlattenedArray: number,
  containerRef: React.MutableRefObject<HTMLDivElement | null>
) {
  return service.send({
    type: "closedNavigatorNodeEvent",
    rootNode,
    flattenedNodes,
    containerRef,
    draggedNodeIndexInFlattenedArray,
  });
}

export function getMachineState() {
  return { context: service.state.context, value: service.state.value };
}
