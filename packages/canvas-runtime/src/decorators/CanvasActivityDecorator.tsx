import React, { useEffect } from "react";
import { createMachine, assign, interpret } from "xstate";
import { canvasComponentStore } from "../CanvasComponentData";
import { DecoratorProps, DecoratorRenderer } from "../DecoratorRenderer";
import { bubbleUp, getAllDescendants } from "../utils";
import { Location } from "../types";

// states
const idle = "idle" as "idle";
const hover = "hover" as "hover";
const pressed = "pressed" as "pressed";
const select = "select" as "select";
const selectIdle = "selectIdle" as "selectIdle";
const dragstart = "dragstart" as "dragstart";
const dragstartIdle = "dragstartIdle" as "dragstartIdle";
const drag = "drag" as "drag";
const hoverWhileSelected = "hoverWhileSelected" as "hoverWhileSelected";
const focused = "focused" as "focused";
const unfocused = "unfocused" as "unfocused";

const lockCompDrop = "lockCompDrop" as "lockCompDrop";
const lockDataDrop = "lockDataDrop" as "lockDataDrop";
const lockDataDropIdle = "lockDataDropIdle" as "lockDataDropIdle";
const lockDataDropSet = "lockDataDropSet" as "lockDataDropSet";
const lockTemplateDrop = "lockTemplateDrop" as "lockTemplateDrop";

// events
type OVER = "OVER";
type DOWN = "DOWN";
type UP = "UP";
type AUTO = "AUTO";
type OUT_OF_CANVAS = "OUT_OF_CANVAS";
type LOCK_COMP_DROP = "LOCK_COMP_DROP"; // dropping new component
type LOCK_DATA_DROP = "LOCK_DATA_DROP"; // dropping src etc.
type LOCK_TEMPLATE_DROP = "LOCK_TEMPLATE_DROP"; // dropping a template
type UNLOCK_EVENT = "UNLOCK_EVENT";
type CANCEL_LOCK_EVENT = "CANCEL_LOCK_EVENT";
type SET_DATA_DROP_TARGET = "SET_DATA_DROP_TARGET";
type UNSET_DATA_DROP_TARGET = "UNSET_DATA_DROP_TARGET";
type CLEAR_CANVAS_EVENT = "CLEAR_CANVAS_EVENT";
type DELETE_COMPONENT_EVENT = "DELETE_COMPONENT_EVENT";
type BLUR_EVENT = "BLUR_EVENT";
type MANUAL_SELECT = "MANUAL_SELECT";
type MANUAL_HOVER = "MANUAL_HOVER";
type SCROLLED = "SCROLLED";

type OverEvent = {
  type: OVER;
  id: string;
  // event is only required for re-position (catchers need mouse location)
  event: MouseEvent;
};

type DownEvent = {
  type: DOWN;
  id: string;
};

type UpEvent = {
  type: UP;
  id: string;
  // event is only required for re-position (catchers need mouse location)
  event: MouseEvent;
};

type AutoTransitionEvent = {
  type: AUTO;
};

type OutOfCanvasEvent = {
  type: OUT_OF_CANVAS;
};

type LockCompDropEvent = {
  type: LOCK_COMP_DROP;
  compId: string;
};

type LockDataDropEvent = {
  type: LOCK_DATA_DROP;
};

type LockTemplateDrop = {
  type: LOCK_TEMPLATE_DROP;
  newTemplateRootId: string;
};

type SetDropTargetEvent = {
  type: SET_DATA_DROP_TARGET;
  targetId: string;
};

type UnsetDropTargetEvent = {
  type: UNSET_DATA_DROP_TARGET;
};

// unlock event always takes you to the select state
type UnlockEvent = {
  type: UNLOCK_EVENT;
};

// cacel lock event always takes you to the idle state
type CancelLockEvent = {
  type: CANCEL_LOCK_EVENT;
};

// Canvas gets cleared when the forest is reset
type ClearCanvasEvent = {
  type: CLEAR_CANVAS_EVENT;
};

// A delete event is raised by user
type DeleteComponentEvent = {
  type: DELETE_COMPONENT_EVENT;
  id: string;
};

type BlurEvent = {
  type: BLUR_EVENT;
  id: string;
};

// A select event raised manually
type ManualSelectEvent = {
  type: MANUAL_SELECT;
  id: string;
};

type ManualHoverEvent = {
  type: MANUAL_HOVER;
  id: string;
};

type ScrollEvent = {
  type: SCROLLED;
};

type CanvasActivityEvent =
  | OverEvent
  | DownEvent
  | UpEvent
  | AutoTransitionEvent
  | OutOfCanvasEvent
  | LockCompDropEvent
  | LockDataDropEvent
  | LockTemplateDrop
  | UnlockEvent
  | CancelLockEvent
  | SetDropTargetEvent
  | UnsetDropTargetEvent
  | ClearCanvasEvent
  | DeleteComponentEvent
  | BlurEvent
  | ManualSelectEvent
  | ManualHoverEvent
  | ScrollEvent;

// context
export type CanvasActivityContext = {
  // component being dragged
  dragged?: {
    id: string;
  };
  // component hovered over during drag
  currentDropzone?: {
    id: string;
    // location is needed to use with bubble up and catcher
    loc: Location;
  };
  // component where drop happens at the end of drag
  finalDropzone?: {
    id: string;
    // location is needed to use with bubble up and catcher
    loc: Location;
  };
  hover?: {
    id: string;
    manualHover: boolean;
  };
  select?: {
    id: string;
  };
  dropComp?: {
    id: string;
  };
  dropData?: {
    id: string;
  };
  dropTemplate?: {
    newTemplateRootId: string;
  };
};

const overAnother = (
  context: CanvasActivityContext,
  event: OverEvent | ManualHoverEvent
) => {
  return context.hover?.id !== event.id;
};

const overNotSelected = (
  context: CanvasActivityContext,
  event: OverEvent | ManualHoverEvent
) => {
  return context.select?.id !== event.id;
};

const hoverWhileSelectedGuard = (
  context: CanvasActivityContext,
  event: OverEvent | ManualHoverEvent
) => {
  return overAnother(context, event) && overNotSelected(context, event);
};

const notOverDragged = (context: CanvasActivityContext, event: OverEvent) => {
  if (context.dragged?.id === event.id) {
    return false;
  }
  const descendants = getAllDescendants(context.dragged!.id);
  for (let i = 0; i < descendants.length; i++) {
    if (descendants[i] === event.id) {
      return false;
    }
  }
  return true;
};

const overNotLastDragOver = (
  context: CanvasActivityContext,
  event: OverEvent
) => {
  return (
    context.currentDropzone?.id !== event.id &&
    context.currentDropzone?.id !== event.id
  );
};

const dragOverGuard = (context: CanvasActivityContext, event: OverEvent) => {
  return overNotLastDragOver(context, event) && notOverDragged(context, event);
};

// mouse up on component other than the dragged
const dropOnNotDragged = (context: CanvasActivityContext, event: UpEvent) => {
  if (context.dragged?.id === event.id) {
    return false;
  }
  const descendants = getAllDescendants(context.dragged!.id);
  for (let i = 0; i < descendants.length; i++) {
    if (descendants[i] === event.id) {
      return false;
    }
  }
  return true;
};

// mouse up on the dragged component itself
const dropOnDragged = (context: CanvasActivityContext, event: UpEvent) => {
  return !dropOnNotDragged(context, event);
};

const dropDataIsSet = (context: CanvasActivityContext) => {
  if (context.dropData && context.dropData.id) {
    return true;
  }
  return false;
};

const dropDataIsNotSet = (context: CanvasActivityContext) => {
  return !dropDataIsSet(context);
};

const deletedSelectedComponent = (
  context: CanvasActivityContext,
  event: DeleteComponentEvent
) => {
  return context.select?.id === event.id;
};

const blurredSelected = (context: CanvasActivityContext, event: BlurEvent) => {
  return context.select?.id === event.id;
};

const notManualHover = (context: CanvasActivityContext) => {
  return context.hover?.manualHover ? false : true;
};

const onHoverStart = assign<
  CanvasActivityContext,
  OverEvent | ManualHoverEvent
>({
  hover: (_context, event) => {
    return { id: event.id, manualHover: false };
  },
});

const onManualHoverStart = assign<CanvasActivityContext, ManualHoverEvent>({
  hover: (_context, event) => {
    return { id: event.id, manualHover: true };
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
  dragged: (context, event) => {
    let draggedCompId = event.id;

    if (window.navigator.userAgent.indexOf("Mac") >= 0) {
      if (event.event.metaKey) {
        draggedCompId = context.select?.id || draggedCompId;
      }
    } else {
      if (event.event.ctrlKey) {
        draggedCompId = context.select?.id || draggedCompId;
      }
    }

    return {
      id: draggedCompId,
    };
  },
});

const onDragOverStart = assign<CanvasActivityContext, OverEvent>({
  currentDropzone: (context, event) => {
    const comp = canvasComponentStore[event.id];
    const dropzoneComp = bubbleUp(
      comp,
      { type: "redrop", data: { compId: context.dragged!.id } },
      event.event,
      canvasComponentStore
    );
    if (dropzoneComp) {
      return { id: dropzoneComp.id, loc: event.event };
    }
    return undefined;
  },
});

const onDragEnd = assign<CanvasActivityContext, UpEvent>({
  finalDropzone: (context, event) => {
    const comp = canvasComponentStore[event.id];
    const dropzoneComp = bubbleUp(
      comp,
      { type: "redrop", data: { compId: context.dragged!.id } },
      event.event,
      canvasComponentStore
    );
    if (dropzoneComp) {
      return { id: dropzoneComp.id, loc: event.event };
    }
  },
  select: (context) => {
    if (context.dragged === undefined) {
      console.error(
        "The context.dragged was expected to be defined at drag end. Please report this error as it might be some problem in Canvas Runtime"
      );
    }
    return {
      id: context.dragged!.id,
    };
  },
});

const onDragCancel = assign<CanvasActivityContext, UpEvent>({
  finalDropzone: (_context, event) => {
    return undefined;
  },

  select: (context) => {
    if (context.dragged === undefined) {
      console.error(
        "The context.dragged was expected to be defined at drag end. Please report this error as it might be some problem in Canvas Runtime"
      );
    }
    return {
      id: context.dragged!.id,
    };
  },
});

const setSelectOnOutOfCanvasOnDragFail = assign<
  CanvasActivityContext,
  OutOfCanvasEvent
>({
  select: (context) => {
    if (!context.dragged?.id) {
      console.error(
        "context.dragged was expected to be defined. Please report this error to Atri Labs team."
      );
    }
    return { id: context.dragged!.id };
  },
});

const onLockCompDrop = assign<CanvasActivityContext, LockCompDropEvent>({
  dropComp: (_context, event) => {
    return { id: event.compId };
  },
});

const onLockTemplateDrop = assign<CanvasActivityContext, LockTemplateDrop>({
  dropTemplate: (_context, event) => {
    return { newTemplateRootId: event.newTemplateRootId };
  },
});

const onSetLockDataDrop = assign<CanvasActivityContext, SetDropTargetEvent>({
  dropData: (_context, event) => {
    return { id: event.targetId };
  },
});

const onUnsetLockDataDrop = assign<CanvasActivityContext, UnsetDropTargetEvent>(
  {
    dropData: () => {
      return undefined;
    },
  }
);

const selectOnUnlockCompDrop = assign<CanvasActivityContext, UnlockEvent>({
  select: (context) => {
    return { id: context.dropComp!.id };
  },
  dropComp: () => {
    return undefined;
  },
});

const selectOnUnlockTemplateDrop = assign<CanvasActivityContext, UnlockEvent>({
  select: (context) => {
    return { id: context.dropTemplate!.newTemplateRootId };
  },
  dropTemplate: () => {
    return undefined;
  },
});

const selectOnUnlockDataDrop = assign<CanvasActivityContext, UnlockEvent>({
  select: (context) => {
    return { id: context.dropData!.id };
  },
  dropData: () => {
    return undefined;
  },
});

const onManualSelect = assign<CanvasActivityContext, ManualSelectEvent>({
  select: (_context, event) => {
    if (
      canvasComponentStore[event.id] &&
      canvasComponentStore[event.id].ref &&
      canvasComponentStore[event.id].ref.current
    ) {
      canvasComponentStore[event.id].ref.current!.tabIndex = 0;
      canvasComponentStore[event.id].ref.current!.focus();
    }
    return { id: event.id };
  },
});

const onComponentScroll = (
  context: CanvasActivityContext,
  event: ScrollEvent
) => {
  scrollCbs.forEach((cb) => {
    cb(context, event);
  });
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
        LOCK_COMP_DROP: { target: lockCompDrop, actions: [onLockCompDrop] },
        LOCK_DATA_DROP: { target: lockDataDrop },
        LOCK_TEMPLATE_DROP: {
          target: lockTemplateDrop,
          actions: [onLockTemplateDrop],
        },
        MANUAL_SELECT: { target: select, actions: [onManualSelect] },
        MANUAL_HOVER: { target: hover, actions: [onManualHoverStart] },
        SCROLLED: { actions: [onComponentScroll] },
      },
      entry: assign({}),
    },
    [hover]: {
      on: {
        OVER: { target: hover, cond: overAnother, actions: [onHoverStart] },
        DOWN: { target: pressed },
        OUT_OF_CANVAS: { target: idle, cond: notManualHover },
        CLEAR_CANVAS_EVENT: { target: idle },
        MANUAL_SELECT: { target: select, actions: [onManualSelect] },
        MANUAL_HOVER: {
          target: hover,
          cond: overAnother,
          actions: [onManualHoverStart],
        },
        SCROLLED: {
          target: idle,
          actions: [onComponentScroll],
        },
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
      entry: () => {},
      exit: () => {},
    },
    [select]: {
      on: {
        // use might do mouse down on the selected component
        // maybe to start dragging
        DOWN: {
          target: pressed,
        },
        LOCK_COMP_DROP: { target: lockCompDrop, actions: [onLockCompDrop] },
        LOCK_DATA_DROP: { target: lockDataDrop },
        LOCK_TEMPLATE_DROP: {
          target: lockTemplateDrop,
          actions: [onLockTemplateDrop],
        },
        CLEAR_CANVAS_EVENT: { target: idle },
        DELETE_COMPONENT_EVENT: {
          target: idle,
          cond: deletedSelectedComponent,
        },
        MANUAL_SELECT: { target: select, actions: [onManualSelect] },
        SCROLLED: { actions: [onComponentScroll] },
      },
      type: "parallel",
      states: {
        focusstates: {
          initial: focused,
          states: {
            [focused]: {
              on: {
                BLUR_EVENT: { target: unfocused, cond: blurredSelected },
              },
              entry: (context, event) => {
                // TODO: exit out of focused state if this if condition fails
                if (canvasComponentStore[context.select!.id].ref.current) {
                  canvasComponentStore[
                    context.select!.id
                  ].ref.current!.tabIndex = 0;
                  canvasComponentStore[context.select!.id].ref.current!.focus();
                  focusedCbs.forEach((cb) => cb(context, event));
                }
              },
              exit: (context, event) => {
                blurCbs.forEach((cb) => cb(context, event));
              },
            },
            [unfocused]: {
              type: "final",
            },
          },
        },
        hoverstates: {
          initial: selectIdle,
          states: {
            [selectIdle]: {
              on: {
                OVER: {
                  target: hoverWhileSelected,
                  cond: overNotSelected,
                  actions: [onHoverStart],
                },
                MANUAL_HOVER: {
                  target: hoverWhileSelected,
                  cond: overNotSelected,
                  actions: [onManualHoverStart],
                },
              },
            },
            [hoverWhileSelected]: {
              on: {
                OVER: [
                  {
                    target: hoverWhileSelected,
                    cond: hoverWhileSelectedGuard,
                    actions: [onHoverStart],
                  },
                  {
                    target: selectIdle,
                    cond: (context, event) => {
                      return !overNotSelected(context, event);
                    },
                  },
                ],
                MANUAL_HOVER: [
                  {
                    target: hoverWhileSelected,
                    cond: hoverWhileSelectedGuard,
                    actions: [onManualHoverStart],
                  },
                  {
                    target: selectIdle,
                    cond: (context, event) => {
                      return !overNotSelected(context, event);
                    },
                  },
                ],
                OUT_OF_CANVAS: { target: selectIdle, cond: notManualHover },
                SCROLLED: { target: selectIdle, actions: [onComponentScroll] },
              },
              entry: (context, event) => {
                hoverWhileSelectedCbs.forEach((cb) => cb(context, event));
              },
              exit: (context, event) => {
                hoverWhileSelectedEndCbs.forEach((cb) => cb(context, event));
              },
            },
          },
        },
      },
      entry: (context, event) => {
        selectCbs.forEach((cb) => cb(context, event));
      },
      exit: (context, event) => {
        selectEndCbs.forEach((cb) => cb(context, event));
      },
    },
    [dragstart]: {
      type: "compound",
      initial: dragstartIdle,
      on: {
        // mouse up on the same component before starting drag (moving to other component)
        UP: [
          // TODO: dragend and dragcancel, both should lead to select state with dragged as selected
          { target: select, cond: dropOnNotDragged, actions: [onDragEnd] },
          {
            target: select,
            cond: dropOnDragged,
            actions: [onDragCancel],
          },
        ],
        OUT_OF_CANVAS: {
          target: select,
          actions: [setSelectOnOutOfCanvasOnDragFail],
        },
      },
      states: {
        [dragstartIdle]: {
          on: {
            OVER: {
              target: drag,
              cond: notOverDragged,
              actions: [onDragOverStart],
            },
          },
        },
        // drag state is synononomous to dropzone created state
        [drag]: {
          on: {
            OVER: [
              {
                target: drag,
                cond: dragOverGuard,
                actions: [onDragOverStart],
              },
              {
                target: dragstartIdle,
                cond: (context, event) => {
                  return !notOverDragged(context, event);
                },
              },
            ],
          },
          entry: (context, event) => {
            dropzoneCreatedCbs.forEach((cb) => cb(context, event));
          },
          exit: (context, event) => {
            dropzoneDestroyedCbs.forEach((cb) => cb(context, event));
          },
        },
      },
      entry: (context, event) => {
        dragStartCbs.forEach((cb) => cb(context, event));
      },
      exit: (context, event) => {
        if (context.finalDropzone === undefined) {
          dragCancelCbs.forEach((cb) => cb(context, event));
        } else {
          dragEndCbs.forEach((cb) => cb(context, event));
        }
      },
    },
    [lockCompDrop]: {
      on: {
        UNLOCK_EVENT: { target: select, actions: [selectOnUnlockCompDrop] },
        CANCEL_LOCK_EVENT: { target: idle },
        CLEAR_CANVAS_EVENT: { target: idle },
      },
    },
    [lockDataDrop]: {
      on: {
        UNLOCK_EVENT: [
          {
            target: select,
            cond: dropDataIsSet,
            actions: [selectOnUnlockDataDrop],
          },
          {
            target: idle,
            cond: dropDataIsNotSet,
          },
        ],
        CANCEL_LOCK_EVENT: { target: idle },
        CLEAR_CANVAS_EVENT: { target: idle },
      },
      type: "compound",
      initial: lockDataDropIdle,
      states: {
        [lockDataDropIdle]: {
          on: {
            SET_DATA_DROP_TARGET: {
              target: lockDataDropSet,
              actions: [onSetLockDataDrop],
            },
          },
        },
        [lockDataDropSet]: {
          on: {
            SET_DATA_DROP_TARGET: {
              target: lockDataDropSet,
              actions: [onSetLockDataDrop],
            },
            UNSET_DATA_DROP_TARGET: {
              target: lockDataDropIdle,
              actions: [onUnsetLockDataDrop],
            },
          },
        },
      },
    },
    [lockTemplateDrop]: {
      on: {
        UNLOCK_EVENT: { target: select, actions: [selectOnUnlockTemplateDrop] },
        CANCEL_LOCK_EVENT: { target: idle },
        CLEAR_CANVAS_EVENT: { target: idle },
      },
    },
  },
});

// callbacks
type Callback = (
  context: CanvasActivityContext,
  event:
    | CanvasActivityEvent
    | { type: "dropzoneMove"; loc: Location }
    | { type: "keyup"; event: KeyboardEvent }
    | { type: "keydown"; event: KeyboardEvent }
) => void;
const hoverCbs: Callback[] = [];
const hoverEndCbs: Callback[] = [];
const selectCbs: Callback[] = [];
const selectEndCbs: Callback[] = [];
const hoverWhileSelectedCbs: Callback[] = [];
const hoverWhileSelectedEndCbs: Callback[] = [];
const dragStartCbs: Callback[] = [];
const dropzoneCreatedCbs: Callback[] = [];
const dropzoneDestroyedCbs: Callback[] = [];
const dragEndCbs: Callback[] = [];
const dragCancelCbs: Callback[] = [];
const focusedCbs: Callback[] = [];
const blurCbs: Callback[] = [];
const scrollCbs: Callback[] = [];

function createUnsubFunc(arr: Callback[], cb: Callback) {
  return () => {
    const index = arr.findIndex((curr) => curr === cb);
    if (index >= 0) {
      return arr.splice(index, 1);
    }
  };
}

function subscribe(
  event:
    | "hover"
    | "hoverEnd"
    | "select"
    | "selectEnd"
    | "hoverWhileSelected"
    | "hoverWhileSelectedEnd"
    | "dragStart"
    | "dropzoneCreated"
    | "dropzoneDestroyed"
    | "dragEnd"
    | "dragCancel"
    | "dropzoneMove"
    | "focus"
    | "blur"
    | "keyup"
    | "keydown"
    | "scroll",
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
    case "dragStart":
      dragStartCbs.push(cb);
      return createUnsubFunc(dragStartCbs, cb);
    case "dropzoneCreated":
      dropzoneCreatedCbs.push(cb);
      return createUnsubFunc(dropzoneCreatedCbs, cb);
    case "dropzoneDestroyed":
      dropzoneDestroyedCbs.push(cb);
      return createUnsubFunc(dropzoneDestroyedCbs, cb);
    case "dragEnd":
      dragEndCbs.push(cb);
      return createUnsubFunc(dragEndCbs, cb);
    case "dragCancel":
      dragCancelCbs.push(cb);
      return createUnsubFunc(dragCancelCbs, cb);
    case "dropzoneMove":
      return subscribeDropzoneMove(cb);
    case "focus":
      focusedCbs.push(cb);
      return createUnsubFunc(focusedCbs, cb);
    case "blur":
      blurCbs.push(cb);
      return createUnsubFunc(blurCbs, cb);
    case "keyup":
      return subscribeKeyup(cb);
    case "keydown":
      return subscribeKeydown(cb);
    case "scroll":
      scrollCbs.push(cb);
      return createUnsubFunc(scrollCbs, cb);
    default:
      console.error(
        `Unknown event received by ${canvasActivityMachine.id} - ${event}`
      );
  }
  return () => {};
}

const service = interpret(canvasActivityMachine);
service.start();

// Event listeners are attached to window to reset the event handling.
// Once the event has been handled by a component,
// we don't want the event to propagate to parent component.
let overHandled = false;
let upHandled = false;
let downHandled = false;
export function acknowledgeEventPropagation(iFrameWindow: Window) {
  iFrameWindow.addEventListener("mousemove", () => {
    overHandled = false;
  });
  iFrameWindow.addEventListener("mouseup", () => {
    upHandled = false;
  });
  iFrameWindow.addEventListener("mousedown", () => {
    downHandled = false;
  });
}

const CanvasActivityDecorator: React.FC<DecoratorProps> = (props) => {
  useEffect(() => {
    const comp = canvasComponentStore[props.compId].ref.current;
    if (comp) {
      const mouseover = (event: MouseEvent) => {
        if (overHandled) return;
        overHandled = true;
        service.send({
          type: "OVER",
          id: props.compId,
          event,
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
      const mouseup = (event: MouseEvent) => {
        if (upHandled) return;
        upHandled = true;
        service.send({
          type: "UP",
          id: props.compId,
          event,
        });
      };
      const onscroll = () => {
        service.send({
          type: "SCROLLED",
        });
      };
      // focus to receive keyboard input (like delete key)
      comp.tabIndex = 0;
      const blur = (event: FocusEvent) => {
        service.send({ type: "BLUR_EVENT", id: props.compId });
      };
      comp.addEventListener("mousedown", mousedown);
      comp.addEventListener("mousemove", mouseover);
      comp.addEventListener("mouseup", mouseup);
      comp.addEventListener("blur", blur);
      comp.addEventListener("scroll", onscroll);
      return () => {
        if (comp) {
          comp.removeEventListener("mousedown", mousedown);
          comp.removeEventListener("mousemove", mouseover);
          comp.removeEventListener("mouseup", mouseup);
          comp.removeEventListener("blur", blur);
          comp.removeEventListener("scroll", onscroll);
        }
      };
    } else {
      console.error(
        "The comp Ref is null. Please report this error to Atri Labs team."
      );
    }
    return;
  }, [props]);

  return <DecoratorRenderer {...props} />;
};

// =================== API for internal use only =====================

function lockMachineForCompDrop(compId: string) {
  service.send({ type: "LOCK_COMP_DROP", compId });
}

function lockMachineForDataDrop() {
  service.send({ type: "LOCK_DATA_DROP" });
}

function lockMachineForTemplateDrop(newTemplateRootId: string) {
  service.send({ type: "LOCK_TEMPLATE_DROP", newTemplateRootId });
}

function setDataDropTarget(targetId: string) {
  service.send({ type: "SET_DATA_DROP_TARGET", targetId });
}

function unsetDataDropTarget() {
  service.send({ type: "UNSET_DATA_DROP_TARGET" });
}

function unlockMachine() {
  service.send({ type: "UNLOCK_EVENT" });
}

function cancelMachineLock() {
  service.send({ type: "CANCEL_LOCK_EVENT" });
}

function getCompDropTarget() {
  return service.state.context.dropComp?.id;
}

function getDataDropTarget() {
  return service.state.context.dropData?.id;
}

function getTemplateRootId() {
  return service.state.context.dropTemplate?.newTemplateRootId;
}

function isMachineLocked() {
  return (
    service.state.value.toString() === lockCompDrop ||
    service.state.value.toString() === lockDataDrop ||
    service.state.value.toString() === lockTemplateDrop
  );
}

function emitClearCanvasEvent() {
  service.send({ type: "CLEAR_CANVAS_EVENT" });
}

function sendDeleteComponent(compId: string) {
  service.send({ type: "DELETE_COMPONENT_EVENT", id: compId });
}

function sendOutOfCanvasEvent() {
  service.send({ type: "OUT_OF_CANVAS" });
}

// ===================================================================

// ===================== API for layers ==============================
const dropzoneMoveListeners: ((
  context: CanvasActivityContext,
  event: { type: "dropzoneMove"; loc: Location }
) => void)[] = [];
const windowMoveListener = (event: MouseEvent) => {
  dropzoneMoveListeners.forEach((cb) =>
    cb(service.state.context, { type: "dropzoneMove", loc: event })
  );
};
subscribe("dropzoneCreated", () => {
  window.addEventListener("mousemove", windowMoveListener);
});
subscribe("dropzoneDestroyed", () => {
  window.removeEventListener("mousemove", windowMoveListener);
});
function subscribeDropzoneMove(
  cb: (
    context: CanvasActivityContext,
    event: { type: "dropzoneMove"; loc: Location }
  ) => void
) {
  dropzoneMoveListeners.push(cb);
  return () => {
    const index = dropzoneMoveListeners.findIndex((curr) => curr === cb);
    if (index >= 0) {
      dropzoneMoveListeners.splice(index, 1);
    }
  };
}

function getCurrentState() {
  return service.state.value;
}

function getCurrentMachineContext() {
  return service.state.context;
}

// generated from keyup event in between focus and blur
const keyUpCbs: ((
  context: CanvasActivityContext,
  event: { type: "keyup"; event: KeyboardEvent }
) => void)[] = [];
const keyDownCbs: ((
  context: CanvasActivityContext,
  event: { type: "keydown"; event: KeyboardEvent }
) => void)[] = [];
const keyupListener = (event: KeyboardEvent) => {
  keyUpCbs.forEach((cb) => cb(service.state.context, { type: "keyup", event }));
};
const keydownListener = (event: KeyboardEvent) => {
  keyDownCbs.forEach((cb) =>
    cb(service.state.context, { type: "keydown", event })
  );
};
let abortController: AbortController;
subscribe("focus", (context) => {
  if (abortController !== undefined && !abortController.signal.aborted) {
    abortController.abort();
  }
  // on page change, contex.select.id might not exist in canvasComponentStore
  if (context.select?.id && canvasComponentStore[context.select.id]) {
    abortController = new AbortController();
    canvasComponentStore[context.select.id].ref.current?.addEventListener(
      "keydown",
      keydownListener,
      { signal: abortController.signal }
    );
    canvasComponentStore[context.select.id].ref.current?.addEventListener(
      "keyup",
      keyupListener,
      { signal: abortController.signal }
    );
  }
});
subscribe("blur", (_context) => {
  // on page change, contex.select.id might not exist in canvasComponentStore
  if (abortController && !abortController.signal.aborted) {
    abortController.abort();
  }
});
function subscribeKeyup(
  cb: (
    context: CanvasActivityContext,
    event: { type: "keyup"; event: KeyboardEvent }
  ) => void
) {
  keyUpCbs.push(cb);
  return () => {
    const index = keyUpCbs.findIndex((curr) => curr === cb);
    if (index >= 0) {
      keyUpCbs.splice(index, 1);
    }
  };
}
function subscribeKeydown(
  cb: (
    context: CanvasActivityContext,
    event: { type: "keydown"; event: KeyboardEvent }
  ) => void
) {
  keyDownCbs.push(cb);
  return () => {
    const index = keyDownCbs.findIndex((curr) => curr === cb);
    if (index >= 0) {
      keyDownCbs.splice(index, 1);
    }
  };
}

// set select from widget navigatore or key up etc.
function raiseSelectEvent(compId: string) {
  service.send({ type: "MANUAL_SELECT", id: compId });
}

function raiseHoverEvent(compId: string) {
  service.send({ type: "MANUAL_HOVER", id: compId });
}

// ===================================================================

export {
  subscribe,
  CanvasActivityDecorator,
  lockMachineForCompDrop,
  lockMachineForDataDrop,
  lockMachineForTemplateDrop,
  unlockMachine,
  cancelMachineLock,
  setDataDropTarget,
  unsetDataDropTarget,
  getCompDropTarget,
  getTemplateRootId,
  getDataDropTarget,
  isMachineLocked,
  emitClearCanvasEvent,
  getCurrentState,
  sendDeleteComponent,
  getCurrentMachineContext,
  subscribeKeyup,
  subscribeKeydown,
  raiseSelectEvent,
  raiseHoverEvent,
  sendOutOfCanvasEvent,
};
