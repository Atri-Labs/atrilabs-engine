import React, { useEffect } from "react";
import { createMachine, assign, Action, interpret } from "xstate";

type DragComp = { comp: React.FC; props: any };

type DragData =
  | { type: "component"; data: { comp: React.FC; props: any } }
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

// event type
type DragDropMachineEvent =
  | {
      type: "START_DRAG_CALLED";
      args: StartDragArgs;
    }
  | { type: "MOUSE_MOVE"; loc: Location }
  | { type: "MOUSE_UP"; loc: Location };

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
      entry: [resetContextAction],
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
      always: idle,
    },
  },
});

const service = interpret(dragDropMachine);

export function startDrag(dragComp: DragComp, dragData: DragData) {
  console.log("startDrag called");
  service.send({ type: START_DRAG_CALLED, args: { dragComp, dragData } });
}

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
      console.log("move event listener called");
      service.send({ type: "MOUSE_MOVE", loc: event });
    };
    const mouseUpCb = (event: MouseEvent) => {
      console.log("up event listener called");
      service.send({ type: "MOUSE_UP", loc: event });
    };
    service.onTransition((state) => {
      console.log("onTransition called");
      if (state.changed) {
        console.log("state changed", state.value);
        if (state.value === DRAG_START) {
          console.log("event listener added");
          window.addEventListener("mousemove", mouseMoveCb);
          window.addEventListener("mouseup", mouseUpCb);
        }
        if (state.value === idle) {
          console.log("event listener removed");
          window.removeEventListener("mousemove", mouseMoveCb);
          window.removeEventListener("mouseup", mouseUpCb);
        }
      }
    });
  }, []);

  useEffect(() => {
    const displayDragComponent = (loc: Location) => {
      if (containerRef.current) {
        // get coords of container
        // get pageX, pageY from location
        // dragComponentOverlay Ref?? <- change its content and location
      }
    };
    const removeDragComponent = () => {
      // remove child from containerRef
    };
    service.onTransition((state, event) => {
      if (state.value === DRAG && event.type === MOUSE_MOVE) {
        console.log("mouse move", containerRef, event.loc);
      }
      if (state.value === DRAG_END && event.type === MOUSE_UP) {
        console.log("drag end", event.loc);
      }
    });
  }, [containerRef]);
};
