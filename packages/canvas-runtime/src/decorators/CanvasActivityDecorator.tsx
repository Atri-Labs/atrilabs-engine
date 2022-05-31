import { createMachine, assign } from "xstate";

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

type CanvasActivityEvent = OverEvent | DownEvent | UpEvent;

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
      always: idle,
    },
    [dragcancel]: {
      always: idle,
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
