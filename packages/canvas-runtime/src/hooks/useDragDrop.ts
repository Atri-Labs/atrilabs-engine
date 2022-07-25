import React, { useEffect, useState } from "react";
import { createMachine, assign, Action, interpret } from "xstate";
import { findCatcher, getCoords } from "../utils";
import type { StartDragArgs, DragComp, DragData, Location } from "../types";
import {
  canvasComponentStore,
  canvasComponentTree,
} from "../CanvasComponentData";
import {
  cancelMachineLock,
  isMachineLocked,
  lockMachineForCompDrop,
  lockMachineForDataDrop,
  lockMachineForTemplateDrop,
  setDataDropTarget,
  unlockMachine,
  unsetDataDropTarget,
} from "../decorators/CanvasActivityDecorator";

type DragDropMachineContext = {
  startDragArgs: StartDragArgs | null;
};

// events
const START_DRAG_CALLED = "START_DRAG_CALLED" as "START_DRAG_CALLED";
const MOUSE_MOVE = "MOUSE_MOVE" as "MOUSE_MOVE";
const MOUSE_UP = "MOUSE_UP" as "MOUSE_UP";
const RESTART = "RESTART" as "RESTART"; // event emitted to signal that we can start over

// event type
type DragDropMachineEvent =
  | {
      type: "START_DRAG_CALLED";
      args: StartDragArgs;
    }
  | { type: "MOUSE_MOVE"; loc: Location }
  | { type: "MOUSE_UP"; loc: Location }
  | { type: "RESTART" };

// states
const idle = "idle";
const DRAG_START = "DRAG_START";
const DRAG = "DRAG";
const DRAG_END = "DRAG_END";

// actions
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

const resetContextAction: Action<DragDropMachineContext, any> = assign({
  startDragArgs: (_context, _event) => null,
});

const dragDropMachine = createMachine<
  DragDropMachineContext,
  DragDropMachineEvent
>({
  id: "dragDropMachine",
  context: { startDragArgs: null },
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
      on: { [MOUSE_MOVE]: { target: DRAG } },
    },
    [DRAG]: {
      on: {
        [MOUSE_UP]: { target: DRAG_END },
      },
    },
    [DRAG_END]: {
      on: {
        [RESTART]: { target: idle, actions: [resetContextAction] },
      },
    },
  },
});

const service = interpret(dragDropMachine);

// ============ API exposed to layers ====================================
export function startDrag(dragComp: DragComp, dragData: DragData) {
  service.send({ type: START_DRAG_CALLED, args: { dragComp, dragData } });
  if (dragData.type === "component") {
    lockMachineForCompDrop(dragData.data.id);
  }
  if (dragData.type === "src") {
    // For data drop, the target is known during drag & drop only
    lockMachineForDataDrop();
  }
  if (dragData.type === "template") {
    lockMachineForTemplateDrop(dragData.data.newTemplateRootId);
  }
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
export const useDragDrop = (containerRef: React.RefObject<HTMLElement>) => {
  // start and end the service alongwith canvas runtime
  useEffect(() => {
    service.start();
    return () => {
      service.stop();
    };
  }, []);

  useEffect(() => {
    const mouseMoveCb = (event: MouseEvent) => {
      service.send({ type: "MOUSE_MOVE", loc: event });
    };
    const mouseUpCb = (event: MouseEvent) => {
      service.send({ type: "MOUSE_UP", loc: event });
    };
    service.onTransition((state) => {
      if (state.changed) {
        if (state.value === DRAG_START) {
          window.addEventListener("mousemove", mouseMoveCb);
          window.addEventListener("mouseup", mouseUpCb);
        }
        if (state.value === idle) {
          window.removeEventListener("mousemove", mouseMoveCb);
          window.removeEventListener("mouseup", mouseUpCb);
        }
      }
    });
  }, []);

  const [overlay, setOverlay] = useState<{
    comp: React.FC;
    props: any;
    style: React.CSSProperties;
  } | null>(null);
  useEffect(() => {
    const displayDragComponent = (args: StartDragArgs, loc: Location) => {
      if (containerRef.current) {
        // get coords of container
        // get pageX, pageY from location
        const containerCoords = getCoords(containerRef.current);
        const absoluteTop = loc.pageY - containerCoords.top + 10;
        const absoluteLeft = loc.pageX - containerCoords.left + 10;
        const style: React.CSSProperties = {
          top: absoluteTop,
          left: absoluteLeft,
          position: "absolute",
        };
        setOverlay({ ...args.dragComp, style });
      }
    };

    const removeDragComponent = () => {
      // remove child from containerRef
      setOverlay(null);
    };

    const callNewDropSubscribers = (
      args: StartDragArgs,
      loc: Location,
      caughtBy: string
    ) => {
      dropSubscribers.forEach((cb) => cb(args, loc, caughtBy));
    };

    const callNewDragSubscribers = (
      args: StartDragArgs,
      loc: Location,
      caughtBy: string | null
    ) => {
      dragSubscribers.forEach((cb) => cb(args, loc, caughtBy));
    };

    service.onTransition((state, event) => {
      if (
        state.value === DRAG &&
        event.type === MOUSE_MOVE &&
        state.context.startDragArgs
      ) {
        displayDragComponent(state.context.startDragArgs, event.loc);
        if (state.context.startDragArgs) {
          const caughtBy = findCatcher(
            canvasComponentTree,
            canvasComponentStore,
            state.context.startDragArgs.dragData,
            event.loc
          );
          // drag subscribers are informed in both the cases when caughtBy is null or non-null
          if (caughtBy) {
            callNewDragSubscribers(
              state.context.startDragArgs,
              event.loc,
              caughtBy!.id
            );
          } else {
            callNewDragSubscribers(
              state.context.startDragArgs,
              event.loc,
              null
            );
          }
          if (state.context.startDragArgs.dragData.type === "src") {
            // if caughtBy is null then unset data drop target, otherwise set it
            if (caughtBy) {
              setDataDropTarget(caughtBy.id);
            } else {
              unsetDataDropTarget();
            }
          }
        }
      }

      if (state.value === DRAG_END && event.type === MOUSE_UP) {
        // remove the icon created during dragging
        removeDragComponent();
        if (state.context.startDragArgs) {
          const caughtBy = findCatcher(
            canvasComponentTree,
            canvasComponentStore,
            state.context.startDragArgs.dragData,
            event.loc
          );
          if (caughtBy) {
            // inform drop subscribers
            console.log("calling callNewDropSubscribers");
            callNewDropSubscribers(
              state.context.startDragArgs,
              event.loc,
              caughtBy!.id
            );
          }
          if (state.context.startDragArgs.dragData.type === "src") {
            // if caughtBy is null then unset data drop target, otherwise set the target
            if (caughtBy) {
              setDataDropTarget(caughtBy.id);
            } else {
              unsetDataDropTarget();
            }
            // If we are dropping src, then we can immidiately unlock the machine,
            // once we have set/unset the target.
            unlockMachine();
          }
          // Wait for 500 ms before unlocking the machine
          // If caughtBy is null, then immidiately unlock the machine
          if (caughtBy) {
            setTimeout(() => {
              if (isMachineLocked()) {
                cancelMachineLock();
                console.error(
                  "Cancel machine lock was created as a escape hatch and isn't expected to happen. Please report to Atri Labs about this error message."
                );
              }
            }, 500);
          } else {
            cancelMachineLock();
          }
        }
        service.send({ type: RESTART });
      }
    });
  }, [containerRef, setOverlay]);
  return overlay;
};
