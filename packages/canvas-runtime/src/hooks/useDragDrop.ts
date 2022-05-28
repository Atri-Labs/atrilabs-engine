import React, { useEffect, useState } from "react";
import { createMachine, assign, Action, interpret } from "xstate";
import { getCoords } from "../utils";

type DragComp = { comp: React.FC; props: any };

type DragData =
  | {
      type: "component";
      data: { pkg: string; key: string; manifestSchema: string };
    }
  | { type: "src"; data: { src: string } };

type StartDragArgs = {
  dragComp: DragComp;
  dragData: DragData;
};

type Location = { pageX: number; pageY: number };

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
}

type DropSubscriber = (args: StartDragArgs) => void;
const dropSubscribers: DropSubscriber[] = [];
export function subscribeDrop(cb: DropSubscriber) {
  dropSubscribers.push(cb);
  return () => {
    const index = dropSubscribers.findIndex((curr) => curr === cb);
    if (index >= 0) {
      dropSubscribers.splice(index, 1);
    }
  };
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

    const callDropSubscribers = (args: StartDragArgs) => {
      dropSubscribers.forEach((cb) => cb(args));
    };
    service.onTransition((state, event) => {
      console.log("STATE VALUE", state.value);
      if (
        state.value === DRAG &&
        event.type === MOUSE_MOVE &&
        state.context.startDragArgs
      ) {
        displayDragComponent(state.context.startDragArgs, event.loc);
      }
      if (state.value === DRAG_END) {
        // remove the icon created during dragging
        removeDragComponent();
        if (state.context.startDragArgs) {
          // inform drop subscribers
          callDropSubscribers(state.context.startDragArgs);
        }
        service.send({ type: RESTART });
      }
    });
  }, [containerRef, setOverlay]);
  return overlay;
};
