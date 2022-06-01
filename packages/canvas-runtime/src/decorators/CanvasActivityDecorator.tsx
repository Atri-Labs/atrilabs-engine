import { useEffect } from "react";
import { createMachine, assign, interpret, InterpreterStatus } from "xstate";
import { canvasComponentStore } from "../CanvasComponentData";
import { DecoratorProps } from "../DecoratorRenderer";

// states
const idle = "idle" as "idle";
const hover = "hover" as "hover";
const pressed = "pressed" as "pressed";
const select = "select" as "select";
const dragstart = "dragstart" as "dragstart";
const drag = "drag" as "drag";
const dragend = "dragend" as "dragend";
const dragcancel = "dragcancel" as "dragcancel";
const hoverWhileSelected = "hoverWhileSelected" as "hoverWhileSelected";

// events
type OVER = "OVER";
type DOWN = "DOWN";
type UP = "UP";
type AUTO = "AUTO";

type OverEvent = {
  type: OVER;
  id: string;
};

type DownEvent = {
  type: DOWN;
  id: string;
};

type UpEvent = {
  type: UP;
  id: string;
};

type AutoTransitionEvent = {
  type: AUTO;
};

type CanvasActivityEvent =
  | OverEvent
  | DownEvent
  | UpEvent
  | AutoTransitionEvent;

// context
type CanvasActivityContext = {
  // component being dragged
  dragged?: {
    id: string;
  };
  // component hovered over during drag
  dragover?: {
    id: string;
  };
  // component where drop happens at the end of drag
  dropzone?: {
    id: string;
  };
  hover?: {
    id: string;
  };
  select?: {
    id: string;
  };
};

const overAnother = (context: CanvasActivityContext, event: OverEvent) => {
  return context.hover?.id !== event.id;
};

const overNotSelected = (context: CanvasActivityContext, event: OverEvent) => {
  return context.select?.id !== event.id;
};

const notOverDragged = (context: CanvasActivityContext, event: OverEvent) => {
  return context.dragged?.id !== event.id;
};

const overNotLastDragOver = (
  context: CanvasActivityContext,
  event: OverEvent
) => {
  return context.dragover?.id !== event.id && context.dragover?.id !== event.id;
};

// mouse up on component other than the dragged
const dropOnNotDragged = (context: CanvasActivityContext, event: UpEvent) => {
  return context.dragged?.id !== event.id;
};
// mouse up on the dragged component itself
const dropOnDragged = (context: CanvasActivityContext, event: UpEvent) => {
  return context.dragged?.id === event.id;
};

const onHoverStart = assign<CanvasActivityContext, OverEvent>({
  hover: (_context, event) => {
    return { id: event.id };
  },
});

const onSelect = assign<CanvasActivityContext, UpEvent>({
  select: (_context, event) => {
    return {
      id: event.id,
    };
  },
});

const onDragStart = assign<CanvasActivityContext, OverEvent>({
  dragged: (_context, event) => {
    return {
      id: event.id,
    };
  },
});

const onDragOverStart = assign<CanvasActivityContext, OverEvent>({
  dragover: (_context, event) => {
    return {
      id: event.id,
    };
  },
});

const onDragEnd = assign<CanvasActivityContext, UpEvent>({
  dropzone: (_context, event) => {
    return {
      id: event.id,
    };
  },
});

const onDragCancel = assign<CanvasActivityContext, UpEvent>({
  dropzone: (_context, event) => {
    return {
      id: event.id,
    };
  },
});

const dragEndHandler = (
  context: CanvasActivityContext,
  event: AutoTransitionEvent
) => {
  dragEndCbs.forEach((cb) => cb(context, event));
};

const dragCancelHandler = (
  context: CanvasActivityContext,
  event: AutoTransitionEvent
) => {
  dragCancelCbs.forEach((cb) => cb(context, event));
};

const canvasActivityMachine = createMachine<
  CanvasActivityContext,
  CanvasActivityEvent
>({
  id: "canvasActivityMachine",
  context: {},
  initial: idle,
  states: {
    [idle]: {
      on: {
        OVER: { target: hover, actions: [onHoverStart] },
      },
    },
    [hover]: {
      on: {
        OVER: { target: hover, cond: overAnother, actions: [onHoverStart] },
        DOWN: { target: pressed },
      },
      entry: (context, event) => {
        hoverCbs.forEach((cb) => cb(context, event));
      },
      exit: (context, event) => {
        hoverEndCbs.forEach((cb) => cb(context, event));
      },
    },
    [pressed]: {
      on: {
        UP: { target: select, actions: [onSelect] },
        OVER: { target: dragstart, actions: [onDragStart] },
      },
    },
    [select]: {
      on: {
        OVER: {
          target: hoverWhileSelected,
          cond: overNotSelected,
          actions: [onHoverStart],
        },
        // use might do mouse down on the selected component
        // maybe to start dragging
        DOWN: {
          target: pressed,
        },
      },
      entry: (context, event) => {
        selectCbs.forEach((cb) => cb(context, event));
      },
      exit: (context, event) => {
        selectEndCbs.forEach((cb) => cb(context, event));
      },
    },
    [hoverWhileSelected]: {
      on: {
        OVER: {
          target: hoverWhileSelected,
          cond: overAnother,
          actions: [onHoverStart],
        },
        DOWN: {
          target: pressed,
        },
      },
      entry: (context, event) => {
        hoverWhileSelectedCbs.forEach((cb) => cb(context, event));
      },
      exit: (context, event) => {
        hoverWhileSelectedEndCbs.forEach((cb) => cb(context, event));
      },
    },
    [dragstart]: {
      on: {
        OVER: {
          target: drag,
          cond: notOverDragged,
          actions: [onDragOverStart],
        },
      },
    },
    [drag]: {
      on: {
        OVER: {
          target: drag,
          cond: overNotLastDragOver,
          actions: [onDragOverStart],
        },
        UP: [
          { target: dragend, cond: dropOnNotDragged, actions: [onDragEnd] },
          { target: dragcancel, cond: dropOnDragged, actions: [onDragCancel] },
        ],
      },
    },
    [dragend]: {
      on: {
        "": { target: idle, actions: [dragEndHandler] },
      },
    },
    [dragcancel]: {
      on: {
        "": { target: idle, actions: [dragCancelHandler] },
      },
    },
  },
});

// callbacks
type Callback = (
  context: CanvasActivityContext,
  event: CanvasActivityEvent
) => void;
const hoverCbs: Callback[] = [];
const hoverEndCbs: Callback[] = [];
const selectCbs: Callback[] = [];
const selectEndCbs: Callback[] = [];
const hoverWhileSelectedCbs: Callback[] = [];
const hoverWhileSelectedEndCbs: Callback[] = [];
const dragEndCbs: Callback[] = [];
const dragCancelCbs: Callback[] = [];

function createUnsubFunc(arr: Callback[], cb: Callback) {
  const index = arr.findIndex((curr) => curr === cb);
  if (index >= 0) {
    return arr.splice(index, 1);
  }
}

function subscribe(
  event:
    | "hover"
    | "hoverEnd"
    | "select"
    | "selectEnd"
    | "hoverWhileSelected"
    | "hoverWhileSelectedEnd"
    | "dragEnd"
    | "dragCancel",
  cb: Callback
) {
  switch (event) {
    case "hover":
      hoverCbs.push(cb);
      return createUnsubFunc(hoverCbs, cb);
    case "hoverEnd":
      hoverEndCbs.push(cb);
      return createUnsubFunc(hoverEndCbs, cb);
    case "select":
      selectCbs.push(cb);
      return createUnsubFunc(selectCbs, cb);
    case "selectEnd":
      selectEndCbs.push(cb);
      return createUnsubFunc(selectEndCbs, cb);
    case "hoverWhileSelected":
      hoverWhileSelectedCbs.push(cb);
      return createUnsubFunc(hoverWhileSelectedCbs, cb);
    case "hoverWhileSelectedEnd":
      hoverWhileSelectedEndCbs.push(cb);
      return createUnsubFunc(hoverWhileSelectedEndCbs, cb);
    case "dragEnd":
      dragEndCbs.push(cb);
      return createUnsubFunc(dragEndCbs, cb);
    case "dragCancel":
      dragCancelCbs.push(cb);
      return createUnsubFunc(dragCancelCbs, cb);
    default:
      console.error(
        `Unknown event received by ${canvasActivityMachine.id} - ${event}`
      );
  }
}

const service = interpret(canvasActivityMachine);

// Event listeners are attached to window to reset the event handling.
// Once the event has been handled by a component,
// we don't want the event to propagate to parent component.
let overHandled = false;
let upHandled = false;
let downHandled = false;
window.addEventListener("mouseover", () => {
  overHandled = false;
});
window.addEventListener("mouseup", () => {
  upHandled = false;
});
window.addEventListener("mousedown", () => {
  downHandled = false;
});

const CanvasActivityDecorator: React.FC<DecoratorProps> = (props) => {
  // starting/stopping interpreter service
  useEffect(() => {
    if (service.status === InterpreterStatus.Stopped) {
      console.error(
        `Cannot restart a stopped service for machine ${canvasActivityMachine.id}`
      );
      return;
    }
    service.start();
    return () => {
      service.stop();
      console.log(`${canvasActivityMachine.id} stopped`);
    };
  }, []);

  useEffect(() => {
    const comp = canvasComponentStore[props.compId].ref.current;
    if (comp) {
      const mouseover = () => {
        if (overHandled) return;
        overHandled = true;
        service.send({
          type: "OVER",
          id: props.compId,
        });
      };
      const mousedown = () => {
        if (downHandled) return;
        downHandled = true;
        service.send({
          type: "DOWN",
          id: props.compId,
        });
      };
      const mouseup = () => {
        if (upHandled) return;
        upHandled = true;
        service.send({
          type: "UP",
          id: props.compId,
        });
      };
      comp.addEventListener("mousedown", mousedown);
      comp.addEventListener("mouseover", mouseover);
      comp.addEventListener("mouseup", mouseup);
      return () => {
        if (comp) {
          comp.removeEventListener("mousedown", mousedown);
          comp.removeEventListener("mouseover", mouseover);
          comp.removeEventListener("mouseup", mouseup);
        }
      };
    }
    return;
  }, [props]);
  return <>{props.children}</>;
};

export { subscribe, CanvasActivityDecorator };
