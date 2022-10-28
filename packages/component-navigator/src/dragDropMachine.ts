import { createMachine, interpret, assign } from "xstate";
import { NavigatorNode } from "./types";
import type { MouseEvent } from "react";
import { getHoverIndex, horizontalStepSize } from "./utils";

type DragDropMachineContext = {
  // assign before entering dragInProgress state
  containerRef?: React.MutableRefObject<HTMLDivElement | null>; // assuming ref won't change during transition
  draggedNode?: NavigatorNode;
  // assign after every successful drag in y/x direction
  // also assign before entering dragInProgress state
  draggedNodeIndexInFlattenedArray?: number;
  initialX?: number;
};

type MouseDownEvent = {
  type: "mouseDown";
  flattenedNodes: NavigatorNode[];
  draggedNodeIndexInFlattenedArray: number;
  initialX: number;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
};
type MouseMoveEvent = {
  type: "mouseMove";
  event: MouseEvent;
  flattenedNodes: NavigatorNode[];
};
type MouseUpEvent = { type: "mouseUp" };
type ClosedNavigatorNodeEvent = {
  type: "closedNavigatorNodeEvent";
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
const dragStarted = "dragStarted";
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
      console.log(
        "The fields from event should not be undefined.",
        draggedNodeIndexInFlattenedArray,
        flattenedNodes
      );
      return {};
    }
  }
);

type RepositionSubscriber = (
  id: string,
  parentId: string,
  index: number
) => void;

const repositionSubscribers: RepositionSubscriber[] = [];

export function subscribeReposition(cb: RepositionSubscriber) {
  repositionSubscribers.push(cb);
  return () => {
    const foundIndex = repositionSubscribers.findIndex((val) => val === cb);
    if (foundIndex >= 0) {
      repositionSubscribers.splice(foundIndex, 1);
    }
  };
}

function callRepositionSubscribers(
  id: string,
  parentId: string,
  index: number
) {
  repositionSubscribers.forEach((cb) => {
    cb(id, parentId, index);
  });
}

const onMouseMoveAction = assign<DragDropMachineContext, MouseMoveEvent>(
  (context, event) => {
    const { containerRef } = context;
    const { flattenedNodes } = event;
    if (containerRef !== undefined && containerRef.current !== null) {
      // check vertical movement
      const { y } = containerRef.current.getBoundingClientRect();
      const netY = event.event.clientY - y + containerRef.current.scrollTop;
      const newIndex = Math.floor(netY / 24);
      const isDraggedNodeAlreadyAtNewIndex =
        flattenedNodes![newIndex].id === context.draggedNode!.id;
      if (
        newIndex !== context.draggedNodeIndexInFlattenedArray &&
        newIndex >= 0 &&
        !isDraggedNodeAlreadyAtNewIndex
      ) {
        // TODO: call callbacks for reposition
        const oldIndexInFlattenedArray =
          context.draggedNodeIndexInFlattenedArray!;
        const movingUp = oldIndexInFlattenedArray - newIndex > 0 ? true : false;
        const movingDown =
          oldIndexInFlattenedArray - newIndex < 0 ? true : false;
        const newIndexIsSibling =
          flattenedNodes![newIndex]!.parentNode!.id ===
          context.draggedNode!.parentNode!.id
            ? true
            : false;
        const newIndexIsParent =
          flattenedNodes![newIndex]!.id === context.draggedNode!.parentNode!.id;
        const newIndexIsSomeOpenParent =
          flattenedNodes![newIndex]!.type === "acceptsChild" &&
          flattenedNodes![newIndex]!.open;
        const newIndexisLastChild =
          flattenedNodes![newIndex]!.parentNode?.children &&
          flattenedNodes![newIndex]!.index ===
            flattenedNodes![newIndex]!.parentNode!.children!.length - 1;
        if (movingUp && newIndexIsSibling) {
          callRepositionSubscribers(
            context.draggedNode!.id,
            context.draggedNode!.parentNode!.id,
            context.draggedNode!.index - 1
          );
        } else if (movingUp && newIndexIsParent) {
          callRepositionSubscribers(
            context.draggedNode!.id,
            context.draggedNode!.parentNode!.parentNode!.id,
            context.draggedNode!.parentNode!.index
          );
        } else if (movingUp && newIndexisLastChild) {
          callRepositionSubscribers(
            context.draggedNode!.id,
            flattenedNodes![newIndex]!.parentNode!.id,
            flattenedNodes![newIndex]!.parentNode!.children!.length - 1
          );
        } else if (
          movingDown &&
          newIndexIsSibling &&
          !newIndexIsSomeOpenParent
        ) {
          callRepositionSubscribers(
            context.draggedNode!.id,
            context.draggedNode!.parentNode!.id,
            context.draggedNode!.index + 1
          );
        } else if (movingDown && newIndexIsSomeOpenParent) {
          callRepositionSubscribers(
            context.draggedNode!.id,
            flattenedNodes![newIndex]!.id,
            0
          );
        } else {
          console.log("None of the conditions match for reposition");
        }

        context.initialX = event.event.clientX;
        context.draggedNodeIndexInFlattenedArray = newIndex;
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
  context: DragDropMachineContext,
  event: MouseMoveEvent
) => {
  const { draggedNodeIndexInFlattenedArray } = context;
  const { flattenedNodes } = event;
  if (
    draggedNodeIndexInFlattenedArray !== undefined &&
    flattenedNodes !== undefined
  ) {
    const draggedNavNode = flattenedNodes[draggedNodeIndexInFlattenedArray];
    if (draggedNavNode.open && draggedNavNode.type === "acceptsChild") {
      return false;
    }
  } else {
    console.log(
      "The fields from context should not be undefined",
      draggedNodeIndexInFlattenedArray,
      flattenedNodes
    );
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
        mouseDown: {
          target: dragStarted,
          actions: [onMouseDownAction],
        },
      },
    },
    [dragStarted]: {
      on: {
        mouseMove: [
          {
            target: dragInProgress,
            actions: [onMouseMoveAction],
            cond: shouldNotBeOpen,
          },
          { target: waitingForNodesToClose },
        ],
        mouseUp: { target: idle, actions: [onMouseUpAction] },
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
  flattenedNodes: NavigatorNode[],
  event: MouseEvent,
  containerRef: React.MutableRefObject<HTMLDivElement | null>
) {
  const hoverIndex = getHoverIndex(containerRef, event);
  if (hoverIndex !== undefined) {
    return service.send({
      type: "mouseDown",
      flattenedNodes,
      draggedNodeIndexInFlattenedArray: hoverIndex!,
      initialX: event.clientX,
      containerRef,
    });
  }
}

export function sendMouseMoveEvent(
  event: MouseEvent,
  flattenedNodes: NavigatorNode[]
) {
  return service.send({ type: "mouseMove", event, flattenedNodes });
}

export function sendMouseUpEvent() {
  return service.send({ type: "mouseUp" });
}

export function sendClosedNodeEvent(
  flattenedNodes: NavigatorNode[],
  draggedNodeIndexInFlattenedArray: number,
  containerRef: React.MutableRefObject<HTMLDivElement | null>
) {
  return service.send({
    type: "closedNavigatorNodeEvent",
    flattenedNodes,
    containerRef,
    draggedNodeIndexInFlattenedArray,
  });
}

export function getMachineState() {
  return { context: service.state.context, value: service.state.value };
}
