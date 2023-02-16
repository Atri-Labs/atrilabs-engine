import { createMachine, interpret } from "xstate";
import { DragComp, DragData } from "./types";

/**
 * events
 *
 * - The events expected to originate from parent window will have _ prefix
 */

const IFRAME_DETECTED = "IFRAME_DETECTED" as const;
const TOP_WINDOW_DETECTED = "TOP_WINDOW_DETECTED" as const;
const WINDOW_LOADED = "WINDOW_LOADED" as const;
const DRAG_IN_PROGRESS = "_DRAG_IN_PROGRESS" as const;
const DRAG_STOPPED = "_DRAG_STOPPED" as const;
const INSIDE_CANVAS = "INSIDE_CANVAS" as const;
const OUTSIDE_CANVAS = "OUTSIDE_CANVAS" as const;
const MOUSE_MOVE = "MOUSE_MOVE" as const;
const MOUSE_UP = "MOUSE_UP" as const;
const MOUSE_DOWN = "MOUSE_DOWN" as const;
const MOUSE_OVER = "MOUSE_OVER" as const;
const COMPONENT_CREATED = "COMPONENT_CREATED" as const; // emitted only after drag-drop
const SCROLL = "SCROLL" as const;
const BLUR = "BLUR" as const;

type IFRAME_DETECTED_EVENT = { type: typeof IFRAME_DETECTED };
type TOP_WINDOW_DETECTED_EVENT = { type: typeof TOP_WINDOW_DETECTED };
type WINDOW_LOADED_EVENT = { type: typeof WINDOW_LOADED };
type DRAG_IN_PROGRESS_EVENT = {
  type: typeof DRAG_IN_PROGRESS;
  dragData: DragData;
  dragComp: DragComp;
};
type DRAG_STOPPED_EVENT = {
  type: typeof DRAG_STOPPED;
};
type INSIDE_CANVAS_EVENT = {
  type: typeof INSIDE_CANVAS;
  event: { pageX: number; pageY: number };
};
type OUTSIDE_CANVAS_EVENT = {
  type: typeof OUTSIDE_CANVAS;
  event: { pageX: number; pageY: number };
};
type MOUSE_MOVE_EVENT = {
  type: typeof MOUSE_MOVE;
  event: { pageX: number; pageY: number; target: MouseEvent["target"] };
};
type MOUSE_UP_EVENT = {
  type: typeof MOUSE_UP;
  event: { pageX: number; pageY: number; target: MouseEvent["target"] };
};
type MOUSE_DOWN_EVENT = {
  type: typeof MOUSE_DOWN;
  event: { pageX: number; pageY: number; target: MouseEvent["target"] };
};
type MOUSE_OVER_EVENT = {
  type: typeof MOUSE_OVER;
  event: { pageX: number; pageY: number; target: MouseEvent["target"] };
};
type COMPONENT_CREATED_EVENT = {
  type: typeof COMPONENT_CREATED;
  compId: string;
  canvasZoneId: string;
  parentId: string;
};
type SCROLL_EVENT = {
  type: typeof SCROLL;
};
type BLUR_EVENT = {
  type: typeof BLUR;
};

type CanvasMachineEvent =
  | IFRAME_DETECTED_EVENT
  | WINDOW_LOADED_EVENT
  | TOP_WINDOW_DETECTED_EVENT
  | DRAG_IN_PROGRESS_EVENT
  | DRAG_STOPPED_EVENT
  | INSIDE_CANVAS_EVENT
  | OUTSIDE_CANVAS_EVENT
  | MOUSE_MOVE_EVENT
  | MOUSE_UP_EVENT
  | MOUSE_DOWN_EVENT
  | MOUSE_OVER_EVENT
  | COMPONENT_CREATED_EVENT
  | SCROLL_EVENT
  | BLUR_EVENT;

// states
const initial = "initial" as const;
const checks_completed = "checks_completed" as const; // check whether running inside iframe
const ready = "ready" as const; // ready for drag-drop events
const noop = "noop" as const; // the machine needs to do no work as it's not in a iframe
const drag_in_progress = "drag_in_progress" as const;
const drag_in_progress_idle = "drag_in_progress_idle" as const;
const drag_in_progress_active = "drag_in_progress_active" as const;
// inside ready
const idle = "idle" as const;
const hover = "hover" as const;
const pressed = "pressed" as const;
const selected = "selected" as const;
const focused = "focused" as const;
const unfocused = "unfocused" as const;
const selectIdle = "selectIdle" as const;
const hoverWhileSelected = "hoverWhileSelected" as const;

// context

type CanvasMachineContext = {
  insideIframe: boolean;
  insideTopWindow: boolean;
  dragData: DragData | null;
  dragComp: DragComp | null;
  mousePosition: {
    pageX: number;
    pageY: number;
    target: MouseEvent["target"];
  } | null;
  hovered: string | null;
  selected: string | null;
};

// actions

function setDragData(
  context: CanvasMachineContext,
  event: DRAG_IN_PROGRESS_EVENT
) {
  context.dragComp = event.dragComp;
  context.dragData = event.dragData;
}

function setMousePosition(
  context: CanvasMachineContext,
  event: MOUSE_MOVE_EVENT | MOUSE_UP_EVENT | MOUSE_DOWN_EVENT
) {
  context.mousePosition = event.event;
}

function setHoverComponent(
  context: CanvasMachineContext,
  event: MOUSE_MOVE_EVENT
) {
  const { target } = event.event;
  if (target !== null && "closest" in target) {
    const comp = (target as any).closest("[data-atri-comp-id]");
    if (comp !== null) {
      const compId = comp.getAttribute("data-atri-comp-id");
      context.hovered = compId;
    }
  }
}

function setSelectedComponent(
  context: CanvasMachineContext,
  event: MOUSE_DOWN_EVENT
) {
  const { target } = event.event;
  if (target !== null && "closest" in target) {
    const comp = (target as any).closest("[data-atri-comp-id]");
    if (comp !== null) {
      const compId = comp.getAttribute("data-atri-comp-id");
      context.selected = compId;
    }
  }
}

// conds

function insideComponent(
  _context: CanvasMachineContext,
  event: MOUSE_MOVE_EVENT | MOUSE_DOWN_EVENT
) {
  const { target } = event.event;
  if (target !== null && "closest" in target) {
    const comp = (target as any).closest("[data-atri-comp-id]");
    if (comp !== null) {
      return true;
    }
  }
  return false;
}

function hoveringOverDifferentComponent(
  context: CanvasMachineContext,
  event: MOUSE_MOVE_EVENT
) {
  const { target } = event.event;
  if (target !== null && "closest" in target) {
    const comp = (target as any).closest("[data-atri-comp-id]");
    if (comp !== null) {
      const compId = comp.getAttribute("data-atri-comp-id");
      return compId !== context.hovered;
    }
  }
  return false;
}

function selectedDifferentComponent(
  context: CanvasMachineContext,
  event: MOUSE_DOWN_EVENT | MOUSE_OVER_EVENT
) {
  const { target } = event.event;
  if (target !== null && "closest" in target) {
    const comp = (target as any).closest("[data-atri-comp-id]");
    if (comp !== null) {
      const compId = comp.getAttribute("data-atri-comp-id");
      return compId !== context.selected;
    }
  }
  return false;
}

type Callback = (
  context: CanvasMachineContext,
  event: CanvasMachineEvent
) => void;
type SubscribeStates =
  | "ready"
  | "moveWhileDrag"
  | "upWhileDrag"
  | typeof INSIDE_CANVAS
  | typeof OUTSIDE_CANVAS
  | typeof COMPONENT_CREATED
  | "hover"
  | "hoverEnd"
  | "focus"
  | "focusEnd";

export function createCanvasMachine(id: string) {
  const subscribers: { [key in SubscribeStates]: Callback[] } = {
    ready: [],
    moveWhileDrag: [],
    upWhileDrag: [],
    [INSIDE_CANVAS]: [],
    [OUTSIDE_CANVAS]: [],
    [COMPONENT_CREATED]: [],
    hover: [],
    hoverEnd: [],
    focus: [],
    focusEnd: [],
  };
  function subscribeCanvasMachine(state: SubscribeStates, cb: Callback) {
    subscribers[state].push(cb);
    return () => {
      const foundIndex = subscribers[state].findIndex((curr) => curr === cb);
      if (foundIndex >= 0) {
        subscribers[state].splice(foundIndex, 1);
      }
    };
  }

  function callSubscribers(
    state: SubscribeStates,
    context: CanvasMachineContext,
    event: CanvasMachineEvent
  ) {
    subscribers[state].forEach((cb) => {
      try {
        cb(context, event);
      } catch (err) {
        console.log(
          `Error while running callback for state ${state} with`,
          err
        );
      }
    });
  }

  // actions
  function callSubscribersFromAction(state: SubscribeStates) {
    return (context: CanvasMachineContext, event: CanvasMachineEvent) => {
      callSubscribers(state, context, event);
    };
  }

  const canvasMachine = createMachine<CanvasMachineContext, CanvasMachineEvent>(
    {
      id,
      initial,
      predictableActionArguments: true,
      context: {
        insideIframe: false,
        insideTopWindow: false,
        dragComp: null,
        dragData: null,
        mousePosition: null,
        hovered: null,
        selected: null,
      },
      states: {
        [initial]: {
          entry: () => {
            console.log("Entered Initial State", id);
          },
          exit: () => {
            console.log("Exited Initial State", id);
          },
          on: {
            [IFRAME_DETECTED]: { target: checks_completed },
            [TOP_WINDOW_DETECTED]: { target: noop },
          },
        },
        [checks_completed]: {
          entry: () => {
            console.log("Entered Checks Completed State", id);
          },
          exit: () => {
            console.log("Exited Checks Completed State", id);
          },
          on: {
            [WINDOW_LOADED]: { target: ready, actions: ["emitReady"] },
          },
        },
        [ready]: {
          entry: () => {
            console.log("Entered Ready State", id);
          },
          exit: () => {
            console.log("Exited Ready State", id);
          },
          initial: idle,
          states: {
            [idle]: {
              entry: () => {
                console.log("Entered Ready Idle State", id);
              },
              exit: () => {
                console.log("Exited Ready Idle State", id);
              },
              on: {
                [MOUSE_MOVE]: {
                  target: hover,
                  cond: insideComponent,
                  actions: ["setHoverComponent"],
                },
              },
            },
            [hover]: {
              entry: () => {
                console.log("Entered Ready Hover State", id);
              },
              exit: () => {
                console.log("Exited Ready Hover State", id);
              },
              on: {
                [MOUSE_MOVE]: {
                  target: hover,
                  cond: hoveringOverDifferentComponent,
                  actions: ["setHoverComponent"],
                },
                [MOUSE_DOWN]: {
                  target: pressed,
                },
                [SCROLL]: {
                  target: idle,
                },
                [OUTSIDE_CANVAS]: {
                  target: idle,
                },
              },
            },
            [pressed]: {
              entry: () => {
                console.log("Entered Pressed State", id);
              },
              exit: () => {
                console.log("Exited Pressed State", id);
              },
              on: {
                [MOUSE_UP]: {
                  target: selected,
                  actions: ["setSelectedComponent"],
                },
              },
            },
            [selected]: {
              entry: () => {
                console.log("Entered Selected State", id);
              },
              exit: () => {
                console.log("Exited Selected State", id);
              },
              on: {
                [MOUSE_DOWN]: {
                  target: pressed,
                  cond: selectedDifferentComponent,
                },
              },
              type: "parallel",
              states: {
                focusstates: {
                  initial: focused,
                  states: {
                    [focused]: {
                      entry: (context, event) => {
                        callSubscribers("focus", context, event);
                        console.log("Entered Selected focused State", id);
                      },
                      exit: (context, event) => {
                        callSubscribers("focusEnd", context, event);
                        console.log("Exited Selected focused State", id);
                      },

                      on: {
                        [BLUR]: {
                          target: unfocused,
                        },
                      },
                    },
                    [unfocused]: {
                      entry: () => {
                        console.log("Entered Selected unfocused State", id);
                      },
                      exit: () => {
                        console.log("Exited Selected unfocused State", id);
                      },
                      type: "final",
                    },
                  },
                },
                hoverstates: {
                  initial: selectIdle,
                  states: {
                    [selectIdle]: {
                      entry: () => {
                        console.log("Entered Selected selectIdle State", id);
                      },
                      exit: () => {
                        console.log("Exited Selected selectIdle State", id);
                      },
                      on: {
                        [MOUSE_OVER]: {
                          target: hoverWhileSelected,
                          cond: selectedDifferentComponent,
                        },
                      },
                    },
                    [hoverWhileSelected]: {
                      entry: () => {
                        console.log(
                          "Entered Selected hoverWhileSelected State",
                          id
                        );
                      },
                      exit: () => {
                        console.log(
                          "Exited Selected hoverWhileSelected State",
                          id
                        );
                      },
                      on: {
                        [MOUSE_OVER]: {
                          target: hoverWhileSelected,
                          cond: selectedDifferentComponent,
                        },
                        [SCROLL]: { target: selectIdle },
                        [OUTSIDE_CANVAS]: { target: selectIdle },
                      },
                    },
                  },
                },
              },
            },
          },
          on: {
            [DRAG_IN_PROGRESS]: {
              target: drag_in_progress,
              actions: ["setDragData"],
            },
            [COMPONENT_CREATED]: {
              actions: ["emitComponentCreated"],
            },
          },
        },
        [drag_in_progress]: {
          entry: () => {
            console.log("Entered Drag In Progress State", id);
          },
          exit: () => {
            console.log("Exited Drag In Progress State", id);
          },
          initial: drag_in_progress_idle,
          states: {
            [drag_in_progress_idle]: {
              entry: () => {
                console.log("Entered Drag In Progress Idle State", id);
              },
              exit: () => {
                console.log("Exited Drag In Progress Idle State", id);
              },
              on: {
                [DRAG_STOPPED]: { target: `#${id}.${ready}` },
                [INSIDE_CANVAS]: {
                  target: drag_in_progress_active,
                  actions: ["emitInsideCanvas"],
                },
              },
            },
            [drag_in_progress_active]: {
              entry: () => {
                console.log("Entered Drag In Progress Active State", id);
              },
              exit: () => {
                console.log("Exited Drag In Progress Active State", id);
              },
              on: {
                [MOUSE_MOVE]: {
                  actions: ["setMousePosition", "emitMoveWhileDrag"],
                },
                [MOUSE_UP]: {
                  target: `#${id}.${ready}`,
                  actions: ["setMousePosition", "emitUpWhileDrag"],
                },
                [OUTSIDE_CANVAS]: {
                  target: drag_in_progress_idle,
                  actions: ["emitOutsideCanvas"],
                },
              },
            },
          },
        },
        [noop]: {},
      },
    },
    {
      actions: {
        setDragData,
        setMousePosition,
        emitUpWhileDrag: callSubscribersFromAction("upWhileDrag"),
        emitMoveWhileDrag: callSubscribersFromAction("moveWhileDrag"),
        emitOutsideCanvas: callSubscribersFromAction("OUTSIDE_CANVAS"),
        emitInsideCanvas: callSubscribersFromAction("INSIDE_CANVAS"),
        emitReady: callSubscribersFromAction("ready"),
        emitComponentCreated: callSubscribersFromAction("COMPONENT_CREATED"),
        setHoverComponent,
        setSelectedComponent,
      },
    }
  );

  return { canvasMachine, subscribeCanvasMachine };
}

export function createCanvasMachineInterpreter(id: string) {
  const { canvasMachine, subscribeCanvasMachine } = createCanvasMachine(id);
  const canvasMachineInterpreter = interpret(canvasMachine);
  return { canvasMachineInterpreter, subscribeCanvasMachine };
}
