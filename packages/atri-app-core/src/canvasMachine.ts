import { createMachine, interpret } from "xstate";
import { CanvasComponent, DragComp, DragData } from "./types";

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
const COMPONENT_CREATED = "COMPONENT_CREATED" as const; // emitted only after drag-drop
const SCROLL = "SCROLL" as const;
const BLUR = "BLUR" as const;
const COMPONENT_RENDERED = "COMPONENT_RENDERED" as const;
const COMPONENT_DELETED = "COMPONENT_DELETED" as const;
const COMPONENT_REWIRED = "COMPONENT_REWIRED" as const;
const PROPS_UPDATED = "PROPS_UPDATED" as const;
const KEY_UP = "KEY_UP" as const;
const KEY_DOWN = "KEY_DOWN" as const;
const PROGRAMTIC_HOVER = "PROGRAMTIC_HOVER" as const;
const PROGRAMTIC_SELECT = "PROGRAMTIC_SELECT" as const;
const DROP_ZONE_CREATED = "DROP_ZONE_CREATED" as const;
const DROP_ZONE_DESTROYED = "DROP_ZONE_DESTROYED" as const;
const COMPONENT_RENDERED_AFTER_PROPS_UPDATE =
  "COMPONENT_RENDERED_AFTER_PROPS_UPDATE" as const;

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
type COMPONENT_RENDERED_EVENT = {
  type: typeof COMPONENT_RENDERED;
  compId: string;
};
type COMPONENT_DELETED_EVENT = {
  type: typeof COMPONENT_DELETED;
  comp: CanvasComponent;
};
type COMPONENT_REWIRED_EVENT = {
  type: typeof COMPONENT_REWIRED;
  oldParent: { id: string; canvasZoneId: string; index: number };
  newParent: { id: string; canvasZoneId: string; index: number };
  compId: string;
};
type PROPS_UPDATED_EVENT = {
  type: typeof PROPS_UPDATED;
  compId: string;
};
type KEY_UP_EVENT = {
  type: typeof KEY_UP;
  event: KeyboardEvent;
};
type KEY_DOWN_EVENT = {
  type: typeof KEY_DOWN;
  event: KeyboardEvent;
};
type PROGRAMTIC_HOVER_EVENT = {
  type: typeof PROGRAMTIC_HOVER;
  id: string;
};
type PROGRAMTIC_SELECT_EVENT = {
  type: typeof PROGRAMTIC_SELECT;
  id: string;
};
type COMPONENT_RENDERED_AFTER_PROPS_UPDATE_EVENT = {
  type: typeof COMPONENT_RENDERED_AFTER_PROPS_UPDATE;
  id: string;
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
  | COMPONENT_CREATED_EVENT
  | SCROLL_EVENT
  | BLUR_EVENT
  | COMPONENT_RENDERED_EVENT
  | COMPONENT_DELETED_EVENT
  | COMPONENT_REWIRED_EVENT
  | PROPS_UPDATED_EVENT
  | KEY_UP_EVENT
  | KEY_DOWN_EVENT
  | PROGRAMTIC_HOVER_EVENT
  | PROGRAMTIC_SELECT_EVENT
  | COMPONENT_RENDERED_AFTER_PROPS_UPDATE_EVENT;

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
const reposition = "reposition" as const;
const repositionIdle = "repositionIdle" as const;
const repositionActive = "repositionActive" as const;

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
  lastDropped: string | null; // string until COMPONENT_RENDERED received, otherwise null
  // Used in reposition states
  repositionTarget: {
    pageX: number;
    pageY: number;
    target: MouseEvent["target"];
  } | null;
  repositionComponent: string | null;
  lastRewiredComponent: string | null;
  probableParent: string | null;
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
  event: CanvasMachineEvent
) {
  if (event.type === MOUSE_MOVE) {
    const { target } = event.event;
    if (target !== null && "closest" in target) {
      const comp = (target as any).closest("[data-atri-comp-id]");
      if (comp !== null) {
        const compId = comp.getAttribute("data-atri-comp-id");
        context.hovered = compId;
      }
    }
  }
  if (event.type === PROGRAMTIC_HOVER) {
    context.hovered = event.id;
  }
}

function setSelectedComponent(
  context: CanvasMachineContext,
  event: MOUSE_UP_EVENT | PROGRAMTIC_SELECT_EVENT
) {
  if (event.type === MOUSE_UP) {
    const { target } = event.event;
    if (target !== null && "closest" in target) {
      const comp = (target as any).closest("[data-atri-comp-id]");
      if (comp !== null) {
        const compId = comp.getAttribute("data-atri-comp-id");
        context.selected = compId;
      }
    }
  }
  if (event.type === PROGRAMTIC_SELECT) {
    context.selected = event.id;
  }
}

function setRepositionTarget(
  context: CanvasMachineContext,
  event: MOUSE_MOVE_EVENT
) {
  context.repositionTarget = event.event;
}

function setRepositionComponent(
  context: CanvasMachineContext,
  event: MOUSE_MOVE_EVENT
) {
  const { target } = event.event;
  if (target !== null && "closest" in target) {
    const comp = (target as any).closest("[data-atri-comp-id]");
    if (comp !== null) {
      const compId = comp.getAttribute("data-atri-comp-id");
      context.repositionComponent = compId;
    }
  }
}

function setLastDropped(
  context: CanvasMachineContext,
  event: COMPONENT_CREATED_EVENT
) {
  context.lastDropped = event.compId;
}

function handleComponentRendered(context: CanvasMachineContext) {
  context.selected = context.lastDropped;
  context.lastDropped = null;
}

function setEverythingToNull(context: CanvasMachineContext) {
  context.selected = null;
  context.hovered = null;
  context.repositionComponent = null;
  context.mousePosition = null;
  context.lastDropped = null;
}

function setProbableParentToNull(context: CanvasMachineContext) {
  context.probableParent = null;
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

function notInsideComponent(
  context: CanvasMachineContext,
  event: MOUSE_DOWN_EVENT
) {
  return !insideComponent(context, event);
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
  event: MOUSE_DOWN_EVENT | MOUSE_MOVE_EVENT
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

function isLastDroppedComponent(
  context: CanvasMachineContext,
  event: COMPONENT_RENDERED_EVENT
) {
  return context.lastDropped === event.compId;
}

function isInTheSameParent(
  context: CanvasMachineContext,
  event: MOUSE_MOVE_EVENT
) {
  return !isNotInTheSameParent(context, event);
}

function isNotInTheSameParent(
  context: CanvasMachineContext,
  event: MOUSE_MOVE_EVENT
) {
  const target = event.event.target;
  if (
    target !== null &&
    "closest" in target &&
    context.repositionComponent !== null
  ) {
    const closestParent = (target as HTMLElement).closest("[data-atri-parent]");
    if (closestParent) {
      const closestParentId = closestParent.getAttribute("data-atri-comp-id");
      const isRepositionComponentAnAncestorOfClosestParent =
        closestParent.closest(
          `[data-atri-comp-id='${context.repositionComponent}']`
        ) !== null;
      if (
        closestParentId !== undefined &&
        closestParentId !== context.repositionComponent &&
        !isRepositionComponentAnAncestorOfClosestParent
      ) {
        return true;
      }
    } else {
      // the new probable parent is actually a canvas zone
      const closestCanvasZone = (target as HTMLElement).closest(
        "[data-atri-canvas-id]"
      );
      if (closestCanvasZone !== null) {
        return true;
      }
    }
  }
  return false;
}

function mouseIsBackInTheRepositionComponent(
  context: CanvasMachineContext,
  event: MOUSE_UP_EVENT
) {
  if (event.event.target && "closest" in event.event.target) {
    const targetElement = event.event.target as HTMLElement;
    const closestComponent = targetElement.closest("[data-atri-comp-id]");
    const compId = closestComponent?.getAttribute("data-atri-comp-id");
    if (compId === context.repositionComponent) {
      return true;
    }
  }
  return false;
}

function mouseIsNotBackInTheRepositionComponent(
  context: CanvasMachineContext,
  event: MOUSE_UP_EVENT
) {
  return !mouseIsBackInTheRepositionComponent(context, event);
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
  | "focusEnd"
  | typeof COMPONENT_RENDERED
  | "select"
  | "selectEnd"
  | "reposition"
  | "repositionIdle"
  | "repositionActive"
  | "repositionFailed"
  | "repositionSuccess"
  | typeof COMPONENT_DELETED
  | typeof COMPONENT_REWIRED
  | typeof PROPS_UPDATED
  | typeof KEY_UP
  | typeof KEY_DOWN
  | "hoverWhileSelected"
  | "hoverWhileSelectedEnd"
  | typeof DROP_ZONE_CREATED
  | typeof DROP_ZONE_DESTROYED
  | typeof COMPONENT_RENDERED_AFTER_PROPS_UPDATE;

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
    [COMPONENT_RENDERED]: [],
    select: [],
    selectEnd: [],
    reposition: [],
    repositionIdle: [],
    repositionActive: [],
    repositionFailed: [],
    repositionSuccess: [],
    [COMPONENT_DELETED]: [],
    [COMPONENT_REWIRED]: [],
    [PROPS_UPDATED]: [],
    [KEY_UP]: [],
    [KEY_DOWN]: [],
    hoverWhileSelected: [],
    hoverWhileSelectedEnd: [],
    [DROP_ZONE_CREATED]: [],
    [DROP_ZONE_DESTROYED]: [],
    [COMPONENT_RENDERED_AFTER_PROPS_UPDATE]: [],
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
        lastDropped: null,
        repositionTarget: null,
        repositionComponent: null,
        lastRewiredComponent: null,
        probableParent: null,
      },
      states: {
        [initial]: {
          on: {
            [IFRAME_DETECTED]: { target: checks_completed },
            [TOP_WINDOW_DETECTED]: { target: noop },
          },
        },
        [checks_completed]: {
          on: {
            [WINDOW_LOADED]: { target: ready, actions: ["emitReady"] },
          },
        },
        [ready]: {
          initial: idle,
          states: {
            [idle]: {
              on: {
                [MOUSE_MOVE]: {
                  target: hover,
                  cond: insideComponent,
                  actions: ["setHoverComponent"],
                },
              },
            },
            [hover]: {
              entry: (context, event) => {
                callSubscribers("hover", context, event);
              },
              exit: (context, event) => {
                context.hovered = null;
                callSubscribers("hoverEnd", context, event);
              },
              on: {
                [MOUSE_MOVE]: {
                  target: hover,
                  cond: hoveringOverDifferentComponent,
                  actions: ["setHoverComponent"],
                },
                [MOUSE_DOWN]: {
                  target: pressed,
                  actions: ["setMousePosition"],
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
              on: {
                [MOUSE_UP]: {
                  target: selected,
                  actions: ["setSelectedComponent"],
                },
                [MOUSE_MOVE]: {
                  target: reposition,
                  actions: ["setRepositionComponent"],
                },
              },
            },
            [reposition]: {
              initial: repositionIdle,
              entry: (context, event) => {
                callSubscribers("reposition", context, event);
              },
              states: {
                [repositionIdle]: {
                  entry: (context) => {
                    context.repositionTarget = null;
                  },
                  on: {
                    [MOUSE_MOVE]: {
                      target: repositionActive,
                      cond: isNotInTheSameParent,
                      actions: ["setRepositionTarget", "emitRepositionActive"],
                    },
                    [MOUSE_UP]: [
                      {
                        target: `#${id}.${ready}.${selected}`,
                        cond: mouseIsBackInTheRepositionComponent,
                        actions: [
                          "setSelectedComponent",
                          "emitRepositionFailed",
                        ],
                      },
                      {
                        target: `#${id}.${ready}.${idle}`,
                        cond: mouseIsNotBackInTheRepositionComponent,
                        actions: ["emitRepositionFailed"],
                      },
                    ],
                  },
                },
                [repositionActive]: {
                  on: {
                    [MOUSE_MOVE]: [
                      {
                        target: repositionIdle,
                        cond: isInTheSameParent,
                        actions: [
                          "emitRepositionIdle",
                          "setProbableParentToNull",
                          "emitDropZoneDestroyed",
                        ],
                      },
                      {
                        actions: [
                          "setRepositionTarget",
                          "emitRepositionActive",
                          (context, event) => {
                            const { target } = event.event;
                            if (target !== null && "closest" in target) {
                              const parentEl = (target as HTMLElement).closest(
                                "[data-atri-parent]"
                              );
                              let parentElId: string | null = null;
                              if (parentEl) {
                                parentElId =
                                  parentEl.getAttribute("data-atri-comp-id")!;
                              }
                              if (
                                parentElId !== null &&
                                parentElId !== context.probableParent
                              ) {
                                // Destroy a dropzone when the current and
                                // previous parents do not match
                                context.probableParent = null;
                                callSubscribers(
                                  "DROP_ZONE_DESTROYED",
                                  context,
                                  event
                                );
                                // Create a dropzone after the previous dropzone
                                // is destroyed
                                context.probableParent = parentElId;
                                callSubscribers(
                                  "DROP_ZONE_CREATED",
                                  context,
                                  event
                                );
                              }
                            }
                          },
                          (context, event) => {
                            const { target } = event.event;
                            const currentEl = (target as HTMLElement).closest(
                              "[data-atri-comp-id]"
                            );
                            if (
                              context.repositionComponent ===
                              currentEl?.getAttribute("data-atri-comp-id")!
                            ) {
                              setProbableParentToNull(context);
                              callSubscribers(
                                "DROP_ZONE_DESTROYED",
                                context,
                                event
                              );
                            }
                          },
                        ],
                      },
                    ],
                    [MOUSE_UP]: {
                      target: `#${id}.${ready}.${selected}`,
                      actions: [
                        "emitRepositionSuccess",
                        "setProbableParentToNull",
                        "emitDropZoneDestroyed",
                      ],
                    },
                  },
                },
              },
            },
            [selected]: {
              entry: (context, event) => {
                callSubscribers("select", context, event);
              },
              exit: (context, event) => {
                callSubscribers("selectEnd", context, event);
                if (event.type !== PROGRAMTIC_HOVER) context.selected = null;
              },
              on: {
                [MOUSE_DOWN]: [
                  {
                    target: pressed,
                    cond: insideComponent,
                    actions: ["setMousePosition"],
                  },
                  {
                    target: `#${id}.${ready}.${idle}`,
                    cond: notInsideComponent,
                  },
                ],
              },
              type: "parallel",
              states: {
                focusstates: {
                  initial: focused,
                  states: {
                    [focused]: {
                      entry: (context, event) => {
                        callSubscribers("focus", context, event);
                      },
                      exit: (context, event) => {
                        callSubscribers("focusEnd", context, event);
                      },
                      on: {
                        [BLUR]: {
                          target: unfocused,
                        },
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
                        [MOUSE_MOVE]: {
                          target: hoverWhileSelected,
                          cond: selectedDifferentComponent,
                          actions: ["setHoverComponent"],
                        },
                      },
                    },
                    [hoverWhileSelected]: {
                      on: {
                        [MOUSE_MOVE]: {
                          target: hoverWhileSelected,
                          cond: selectedDifferentComponent,
                          actions: ["setHoverComponent"],
                        },
                        [SCROLL]: { target: selectIdle },
                        [OUTSIDE_CANVAS]: { target: selectIdle },
                      },
                      entry: (context, event) => {
                        callSubscribers("hoverWhileSelected", context, event);
                      },
                      exit: (context, event) => {
                        callSubscribers(
                          "hoverWhileSelectedEnd",
                          context,
                          event
                        );
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
              actions: ["emitComponentCreated", "setLastDropped"],
            },
            [COMPONENT_DELETED]: [
              {
                target: `#${id}.${ready}.${idle}`,
                actions: ["emitComponentDeleted", "setEverythingToNull"],
              },
            ],
            [COMPONENT_REWIRED]: {
              actions: [
                (context, event) => {
                  context.lastRewiredComponent = event.compId;
                },
                "emitComponentRewired",
              ],
            },
            [PROPS_UPDATED]: {
              actions: ["emitPropsUpdated"],
            },
            [COMPONENT_RENDERED_AFTER_PROPS_UPDATE]: {
              actions: ["emitComponentRenderedAfterPropsUpdate"],
            },
            [COMPONENT_RENDERED]: [
              {
                target: `#${id}.${ready}.${selected}`,
                cond: isLastDroppedComponent,
                actions: ["handleComponentRendered", "emitComponentRendered"],
              },
              {
                target: `#${id}.${ready}.${selected}`,
                cond: (context, event) => {
                  if (
                    context.lastRewiredComponent &&
                    context.lastRewiredComponent === event.compId
                  ) {
                    return true;
                  }
                  return false;
                },
                actions: [
                  (context) => {
                    context.selected = context.lastRewiredComponent;
                    context.lastRewiredComponent = null;
                  },
                  "emitComponentRendered",
                ],
              },
            ],
            [PROGRAMTIC_HOVER]: [
              {
                target: [
                  `#${id}.${ready}.${selected}.hoverstates.${hoverWhileSelected}`,
                ],
                actions: ["setHoverComponent"],
                cond: (context, event) => {
                  return (
                    context.selected !== null && event.id !== context.hovered
                  );
                },
              },
              {
                target: `#${id}.${ready}.${hover}`,
                actions: ["setHoverComponent"],
                cond: (context) => {
                  return context.selected === null;
                },
              },
            ],
            [PROGRAMTIC_SELECT]: {
              target: [
                `#${id}.${ready}.${selected}.focusstates.${focused}`,
                `#${id}.${ready}.${selected}.hoverstates.${selectIdle}`,
              ],
              actions: ["setSelectedComponent"],
            },
            [KEY_DOWN]: { actions: ["emitKeyDown"] },
            [KEY_UP]: { actions: ["emitKeyUp"] },
          },
        },
        [drag_in_progress]: {
          initial: drag_in_progress_idle,
          states: {
            [drag_in_progress_idle]: {
              on: {
                [DRAG_STOPPED]: { target: `#${id}.${ready}` },
                [INSIDE_CANVAS]: {
                  target: drag_in_progress_active,
                  actions: ["emitInsideCanvas"],
                },
              },
            },
            [drag_in_progress_active]: {
              on: {
                [MOUSE_MOVE]: {
                  actions: [
                    "setMousePosition",
                    "emitMoveWhileDrag",
                    (context, event) => {
                      const { target } = event.event;
                      if (target !== null && "closest" in target) {
                        const parentEl = (target as HTMLElement).closest(
                          "[data-atri-parent]"
                        );
                        let parentElId: string | null = null;
                        if (parentEl) {
                          parentElId =
                            parentEl.getAttribute("data-atri-comp-id")!;
                        }
                        if (
                          parentElId !== null &&
                          parentElId !== context.probableParent
                        ) {
                          context.probableParent = parentElId;
                          callSubscribers("DROP_ZONE_CREATED", context, event);
                        }
                      }
                    },
                  ],
                },
                [MOUSE_UP]: {
                  target: `#${id}.${ready}`,
                  actions: [
                    "setMousePosition",
                    "emitUpWhileDrag",
                    "setProbableParentToNull",
                    "emitDropZoneDestroyed",
                  ],
                },
                [OUTSIDE_CANVAS]: {
                  target: drag_in_progress_idle,
                  actions: [
                    "emitOutsideCanvas",
                    "setProbableParentToNull",
                    "emitDropZoneDestroyed",
                  ],
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
        setProbableParentToNull,
        emitUpWhileDrag: callSubscribersFromAction("upWhileDrag"),
        emitMoveWhileDrag: callSubscribersFromAction("moveWhileDrag"),
        emitOutsideCanvas: callSubscribersFromAction("OUTSIDE_CANVAS"),
        emitInsideCanvas: callSubscribersFromAction("INSIDE_CANVAS"),
        emitReady: callSubscribersFromAction("ready"),
        emitComponentCreated: callSubscribersFromAction("COMPONENT_CREATED"),
        emitComponentRendered: callSubscribersFromAction("COMPONENT_RENDERED"),
        emitRepositionIdle: callSubscribersFromAction("repositionIdle"),
        emitRepositionActive: callSubscribersFromAction("repositionActive"),
        setHoverComponent,
        setSelectedComponent,
        setLastDropped,
        handleComponentRendered,
        setRepositionTarget,
        setRepositionComponent,
        emitRepositionFailed: callSubscribersFromAction("repositionFailed"),
        emitRepositionSuccess: callSubscribersFromAction("repositionSuccess"),
        emitComponentDeleted: callSubscribersFromAction(COMPONENT_DELETED),
        emitComponentRewired: callSubscribersFromAction(COMPONENT_REWIRED),
        emitPropsUpdated: callSubscribersFromAction(PROPS_UPDATED),
        emitComponentRenderedAfterPropsUpdate: callSubscribersFromAction(
          COMPONENT_RENDERED_AFTER_PROPS_UPDATE
        ),
        emitKeyUp: callSubscribersFromAction(KEY_UP),
        emitKeyDown: callSubscribersFromAction(KEY_DOWN),
        setEverythingToNull,
        emitDropZoneDestroyed: callSubscribersFromAction(DROP_ZONE_DESTROYED),
      },
    }
  );

  return { canvasMachine, subscribeCanvasMachine };
}

export function createCanvasMachineInterpreter(id: string) {
  const { canvasMachine, subscribeCanvasMachine } = createCanvasMachine(id);
  const canvasMachineInterpreter = interpret(canvasMachine);
  canvasMachineInterpreter.onTransition((state, event) => {
    // console.log(JSON.stringify(state.value), event.type);
  });
  return { canvasMachineInterpreter, subscribeCanvasMachine };
}
