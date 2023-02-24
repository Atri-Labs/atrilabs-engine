import type { DragComp, DragData } from "@atrilabs/atri-app-core";
import { AnyEvent } from "@atrilabs/forest";
import { createMachine, interpret } from "xstate";

// events
const APP_INFO_FETCHED = "APP_INFO_FETCHED" as const;
const PROJECT_INFO_FETCHED = "PROJECT_INFO_FETCHED" as const;
const PAGES_INFO_FETCHED = "PAGES_INFO_FETCHED" as const;
const PAGE_EVENTS_FETCHED = "PAGE_EVENTS_FETCHED" as const;
const CANVAS_IFRAME_LOADED = "CANVAS_IFRAME_LOADED" as const;
const NAVIGATE_PAGE = "NAVIGATE_PAGE" as const;
const START_DRAG = "START_DRAG" as const;
const MOUSE_MOVE = "MOUSE_MOVE" as const;
const MOUSE_UP = "MOUSE_UP" as const;
const INSIDE_CANVAS = "INSIDE_CANVAS" as const;
const OUTSIDE_CANVAS = "OUTSIDE_CANVAS" as const;
const DROPZONE_CREATED = "DROPZONE_CREATED" as const;
const DRAG_SUCCESS = "DRAG_SUCCESS" as const;
const DRAG_FAILED = "DRAG_FAILED" as const;
const REDROP_SUCCESSFUL = "REDROP_SUCCESSFUL" as const;
const REDROP_FAILED = "REDROP_FAILED" as const;
const SELECT = "SELECT" as const;
const SELECT_END = "SELECT_END" as const;

type APP_INFO_FETCHED_EVENT = {
  type: typeof APP_INFO_FETCHED;
  info: { hostname: string };
};
type PROJECT_INFO_FETCHED_EVENT = {
  type: typeof PROJECT_INFO_FETCHED;
  info: { id: string };
};
type PAGES_INFO_FETCHED_EVENT = {
  type: typeof PAGES_INFO_FETCHED;
  info:
    | {
        routeObjectPath: string;
        unixFilepath: string;
      }[]
    | null;
};
type PAGE_EVENTS_FETCHED_EVENT = {
  type: typeof PAGE_EVENTS_FETCHED;
  urlPath: string;
  events: AnyEvent[];
};
type CANVAS_IFRAME_LOADED_EVENT = {
  type: typeof CANVAS_IFRAME_LOADED;
  canvasWindow: MessageEventSource;
};
type NAVIGATE_PAGE_EVENT = { type: typeof NAVIGATE_PAGE; urlPath: string };
type START_DRAG_EVENT = {
  type: typeof START_DRAG;
  dragData: DragData;
  dragComp: DragComp;
};
type MOUSE_MOVE_EVENT = {
  type: typeof MOUSE_MOVE;
  event: { pageX: number; pageY: number };
};
type MOUSE_UP_EVENT = {
  type: typeof MOUSE_UP;
  event: { pageX: number; pageY: number };
};
type INSIDE_CANVAS_EVENT = {
  type: typeof INSIDE_CANVAS;
  event: { canvasPageX: number; canvasPageY: number };
};
type OUTSIDE_CANVAS_EVENT = {
  type: typeof OUTSIDE_CANVAS;
  event: { canvasPageX: number; canvasPageY: number };
};
type DROPZONE_CREATED_EVENT = {
  type: typeof DROPZONE_CREATED;
  parent: { id: string; index: number };
};
type DRAG_SUCCESS_EVENT = {
  type: typeof DRAG_SUCCESS;
  parent: { id: string; index: number; canvasZoneId: string };
};
type DRAG_FAILED_EVENT = {
  type: typeof DRAG_FAILED;
};
type REDROP_SUCCESSFUL_EVENT = {
  type: typeof REDROP_SUCCESSFUL;
  parent: { id: string; index: number; canvasZoneId: string };
  repositionComponent: string;
};
type REDROP_FAILED_EVENT = {
  type: typeof REDROP_FAILED;
};
type SELECT_EVENT = {
  type: typeof SELECT;
  id: string;
};
type SELECT_END_EVENT = {
  type: typeof SELECT_END;
  id: string;
};

type EDITOR_APP_EVENTS =
  | APP_INFO_FETCHED_EVENT
  | PROJECT_INFO_FETCHED_EVENT
  | PAGES_INFO_FETCHED_EVENT
  | PAGE_EVENTS_FETCHED_EVENT
  | CANVAS_IFRAME_LOADED_EVENT
  | NAVIGATE_PAGE_EVENT
  | START_DRAG_EVENT
  | MOUSE_MOVE_EVENT
  | MOUSE_UP_EVENT
  | INSIDE_CANVAS_EVENT
  | OUTSIDE_CANVAS_EVENT
  | DROPZONE_CREATED_EVENT
  | DRAG_SUCCESS_EVENT
  | DRAG_FAILED_EVENT
  | REDROP_SUCCESSFUL_EVENT
  | REDROP_FAILED_EVENT
  | SELECT_EVENT
  | SELECT_END_EVENT;

// states
const booting = "booting" as const; // initial data fetching is done
const loading_app = "loading_app" as const; // the app in the canvas is
const ready = "ready" as const; // ready for drag-drop events
const drag_drop = "drag_drop" as const; // drag-drop related states
const drag_started = "drag_started" as const;
const drag_in_progress = "drag_in_progress" as const;

// context
type EDITOR_APP_CONTEXT = {
  projectInfo: { id: string } | null;
  appInfo: { hostname: string } | null;
  canvasWindow: MessageEventSource | null;
  pagesInfo:
    | {
        routeObjectPath: string;
        unixFilepath: string;
      }[]
    | null;
  currentRouteObjectPath: string;
  currentUrlPath: string;
  events: { [urlPath: string]: AnyEvent[] };
  iframeLoadStatus: "done" | "progress";
  dragData: DragData | null;
  dragComp: DragComp | null;
  mousePosition: { pageX: number; pageY: number } | null;
  canvasMousePosition: { pageX: number; pageY: number } | null;
  dropzone: { parent: { id: string; index: number } } | null;
};

// conds

function onlyProjectInfoNotDone(context: EDITOR_APP_CONTEXT) {
  return (
    context.appInfo !== null &&
    context.projectInfo === null &&
    context.pagesInfo !== null
  );
}
function onlyPagesInfoNotDone(context: EDITOR_APP_CONTEXT) {
  return (
    context.appInfo !== null &&
    context.projectInfo !== null &&
    context.pagesInfo === null
  );
}

function onlyAppInfoNotDone(context: EDITOR_APP_CONTEXT) {
  return (
    context.appInfo === null &&
    context.projectInfo !== null &&
    context.pagesInfo !== null
  );
}

function onlyFetchingEventNotDone(context: EDITOR_APP_CONTEXT) {
  return context.iframeLoadStatus === "done";
}

function onlyIframeLoadWasNotDone(context: EDITOR_APP_CONTEXT) {
  return (
    context.events[context.currentUrlPath] !== undefined &&
    context.iframeLoadStatus !== "done"
  );
}

// actions

function setAppInfo(
  context: EDITOR_APP_CONTEXT,
  event: APP_INFO_FETCHED_EVENT
) {
  context.appInfo = event.info;
}

function setProjectInfo(
  context: EDITOR_APP_CONTEXT,
  event: PROJECT_INFO_FETCHED_EVENT
) {
  context.projectInfo = event.info;
}

function setPagesInfo(
  context: EDITOR_APP_CONTEXT,
  event: PAGES_INFO_FETCHED_EVENT
) {
  context.pagesInfo = event.info;
}

function setPageEvents(
  context: EDITOR_APP_CONTEXT,
  event: PAGE_EVENTS_FETCHED_EVENT
) {
  context.events[event.urlPath] = event.events;
}

function setIframeStatusToDone(
  context: EDITOR_APP_CONTEXT,
  event: CANVAS_IFRAME_LOADED_EVENT
) {
  context.iframeLoadStatus = "done";
  context.canvasWindow = event.canvasWindow;
}

function setCurrentUrlPath(
  context: EDITOR_APP_CONTEXT,
  event: NAVIGATE_PAGE_EVENT
) {
  context.currentUrlPath = event.urlPath;
  context.currentRouteObjectPath = event.urlPath;
}

function setDragData(context: EDITOR_APP_CONTEXT, event: START_DRAG_EVENT) {
  context.dragData = event.dragData;
  context.dragComp = event.dragComp;
}

function setMousePosition(
  context: EDITOR_APP_CONTEXT,
  event: MOUSE_MOVE_EVENT
) {
  context.mousePosition = event.event;
}

function setCanvasMousePosition(
  context: EDITOR_APP_CONTEXT,
  event: INSIDE_CANVAS_EVENT | OUTSIDE_CANVAS_EVENT
) {
  context.canvasMousePosition = {
    pageX: event.event.canvasPageX,
    pageY: event.event.canvasPageY,
  };
}

function setDropzone(
  context: EDITOR_APP_CONTEXT,
  event: DROPZONE_CREATED_EVENT
) {
  context.dropzone = { parent: event.parent };
}

export function createEditorAppMachine(id: string) {
  type SUBSCRIPTION_STATES =
    | "afterbootup"
    | "before_app_load"
    | "after_app_load"
    | typeof ready
    | "drag_started"
    | "drag_in_progress"
    | "mouse_move_during_drag"
    | typeof DRAG_SUCCESS
    | typeof DRAG_FAILED
    | typeof REDROP_SUCCESSFUL
    | typeof REDROP_FAILED
    | typeof INSIDE_CANVAS
    | typeof OUTSIDE_CANVAS
    | typeof SELECT
    | typeof SELECT_END;

  const subscribers: {
    [key in SUBSCRIPTION_STATES]: ((
      context: EDITOR_APP_CONTEXT,
      event: EDITOR_APP_EVENTS
    ) => void)[];
  } = {
    afterbootup: [],
    before_app_load: [],
    after_app_load: [],
    ready: [],
    drag_started: [],
    drag_in_progress: [],
    mouse_move_during_drag: [],
    [DRAG_SUCCESS]: [],
    [DRAG_FAILED]: [],
    [INSIDE_CANVAS]: [],
    [OUTSIDE_CANVAS]: [],
    [REDROP_SUCCESSFUL]: [],
    [REDROP_FAILED]: [],
    [SELECT]: [],
    [SELECT_END]: [],
  };

  function subscribeEditorMachine(
    state: SUBSCRIPTION_STATES,
    cb: (context: EDITOR_APP_CONTEXT, event: EDITOR_APP_EVENTS) => void
  ) {
    subscribers[state].push(cb);
    return () => {
      const foundIndex = subscribers[state].findIndex((curr) => curr === cb);
      if (foundIndex >= 0) {
        subscribers[state].splice(foundIndex, 1);
      }
    };
  }

  function callSubscribers(
    state: SUBSCRIPTION_STATES,
    context: EDITOR_APP_CONTEXT,
    event: EDITOR_APP_EVENTS
  ) {
    subscribers[state].forEach((cb) => {
      try {
        cb({ ...context }, event);
      } catch (err) {
        console.error(`Failed to run a subscriber upon ${state}`, err);
      }
    });
  }

  function emitMouseMoveDuringDrag(
    context: EDITOR_APP_CONTEXT,
    event: MOUSE_MOVE_EVENT
  ) {
    callSubscribers("mouse_move_during_drag", context, event);
  }

  function emitInsideCanvas(
    context: EDITOR_APP_CONTEXT,
    event: INSIDE_CANVAS_EVENT
  ) {
    callSubscribers("INSIDE_CANVAS", context, event);
  }

  function emitOutsideCanvas(
    context: EDITOR_APP_CONTEXT,
    event: OUTSIDE_CANVAS_EVENT
  ) {
    callSubscribers("OUTSIDE_CANVAS", context, event);
  }

  function emitRepositionSuccessful(
    context: EDITOR_APP_CONTEXT,
    event: REDROP_SUCCESSFUL_EVENT
  ) {
    callSubscribers("REDROP_SUCCESSFUL", context, event);
  }

  function emitRepositionFailed(
    context: EDITOR_APP_CONTEXT,
    event: REDROP_FAILED_EVENT
  ) {
    callSubscribers("REDROP_FAILED", context, event);
  }

  function emitSelect(context: EDITOR_APP_CONTEXT, event: SELECT_EVENT) {
    callSubscribers(SELECT, context, event);
  }

  function emitSelectEnd(context: EDITOR_APP_CONTEXT, event: SELECT_EVENT) {
    callSubscribers(SELECT_END, context, event);
  }

  const editorAppMachine = createMachine<EDITOR_APP_CONTEXT, EDITOR_APP_EVENTS>(
    {
      id: id,
      predictableActionArguments: true,
      context: {
        projectInfo: null,
        appInfo: null,
        pagesInfo: null,
        canvasWindow: null,
        currentRouteObjectPath: "/",
        currentUrlPath: "/",
        events: {},
        iframeLoadStatus: "progress",
        dragData: null,
        mousePosition: null,
        canvasMousePosition: null,
        dropzone: null,
        dragComp: null,
      },
      initial: booting,
      states: {
        [booting]: {
          on: {
            [APP_INFO_FETCHED]: [
              {
                target: loading_app,
                actions: ["setAppInfo"],
                cond: onlyAppInfoNotDone,
              },
              {
                actions: ["setAppInfo"],
              },
            ],
            [PROJECT_INFO_FETCHED]: [
              {
                target: loading_app,
                actions: ["setProjectInfo"],
                cond: onlyProjectInfoNotDone,
              },
              {
                actions: ["setProjectInfo"],
              },
            ],
            [PAGES_INFO_FETCHED]: [
              {
                target: loading_app,
                actions: ["setPagesInfo"],
                cond: onlyPagesInfoNotDone,
              },
              {
                actions: ["setPagesInfo"],
              },
            ],
          },
          exit: (context, event) => {
            // The if-else block is due to bug in xstate (exit action is called before event action)
            if (event.type === "PAGES_INFO_FETCHED") {
              context.pagesInfo = event.info;
            } else if (event.type === "APP_INFO_FETCHED") {
              context.appInfo = event.info;
            } else if (event.type === "PROJECT_INFO_FETCHED") {
              context.projectInfo = event.info;
            }
            callSubscribers("afterbootup", context, event);
          },
        },
        [loading_app]: {
          on: {
            [PAGE_EVENTS_FETCHED]: [
              {
                target: ready,
                actions: ["setPageEvents"],
                cond: onlyFetchingEventNotDone,
              },
              { actions: ["setPageEvents"] },
            ],
            [CANVAS_IFRAME_LOADED]: [
              {
                target: ready,
                actions: ["setIframeStatusToDone"],
                cond: onlyIframeLoadWasNotDone,
              },
              { actions: ["setIframeStatusToDone"] },
            ],
            [NAVIGATE_PAGE]: {
              target: loading_app,
              actions: ["setCurrentUrlPath"],
            },
          },
          entry: (context, event) => {
            context.iframeLoadStatus = "progress";
            callSubscribers("before_app_load", context, event);
          },
          exit: (context, event) => {
            /**
             * The xstate machine fires exit callback before
             * the action attached to a transition.
             */
            if (event.type === "CANVAS_IFRAME_LOADED") {
              setIframeStatusToDone(context, event);
            }
            if (event.type === "PAGE_EVENTS_FETCHED") {
              setPageEvents(context, event);
            }
            if (event.type === "NAVIGATE_PAGE") {
              setCurrentUrlPath(context, event);
            }
            callSubscribers("after_app_load", context, event);
          },
        },
        [ready]: {
          on: {
            [NAVIGATE_PAGE]: {
              target: loading_app,
              actions: ["setCurrentUrlPath"],
            },
            [START_DRAG]: {
              target: drag_drop,
              actions: ["setDragData"],
            },
            [REDROP_SUCCESSFUL]: {
              actions: ["emitRepositionSuccessful"],
            },
            [REDROP_FAILED]: {
              actions: ["emitRepositionFailed"],
            },
            [SELECT]: {
              actions: ["emitSelect"],
            },
            [SELECT_END]: {
              actions: ["emitSelectEnd"],
            },
          },
          entry: (context, event) => {
            callSubscribers("ready", context, event);
          },
        },
        [drag_drop]: {
          initial: drag_started,
          states: {
            [drag_started]: {
              on: {
                [MOUSE_MOVE]: {
                  target: drag_in_progress,
                  actions: ["setMousePosition"],
                },
                [MOUSE_UP]: {
                  target: `#${id}.${ready}`,
                },
              },
              entry: (context, event) => {
                callSubscribers("drag_started", context, event);
              },
            },
            [drag_in_progress]: {
              on: {
                [MOUSE_MOVE]: {
                  actions: ["setMousePosition", "emitMouseMoveDuringDrag"],
                },
                [MOUSE_UP]: { target: `#${id}.${ready}` },
                [INSIDE_CANVAS]: {
                  actions: ["setCanvasMousePosition", "emitInsideCanvas"],
                },
                [OUTSIDE_CANVAS]: {
                  actions: ["setCanvasMousePosition", "emitOutsideCanvas"],
                },
                [DROPZONE_CREATED]: { actions: ["setDropzone"] },
                [DRAG_SUCCESS]: { target: `#${id}.${ready}` },
                [DRAG_FAILED]: { target: `#${id}.${ready}` },
              },
              entry: (context, event) => {
                callSubscribers("drag_in_progress", context, event);
              },
            },
          },
          exit: (context, event) => {
            if (event.type === "DRAG_SUCCESS") {
              callSubscribers("DRAG_SUCCESS", context, event);
            }
            if (event.type === "DRAG_FAILED" || event.type === "MOUSE_UP") {
              callSubscribers("DRAG_FAILED", context, event);
            }
            context.dragData = null;
            context.mousePosition = null;
            context.canvasMousePosition = null;
            context.dropzone = null;
            context.dragComp = null;
          },
        },
      },
    },
    {
      actions: {
        setAppInfo,
        setProjectInfo,
        setPageEvents,
        setIframeStatusToDone,
        setPagesInfo,
        setCurrentUrlPath,
        setDragData,
        setMousePosition,
        setCanvasMousePosition,
        setDropzone,
        emitMouseMoveDuringDrag,
        emitInsideCanvas,
        emitOutsideCanvas,
        emitRepositionSuccessful,
        emitRepositionFailed,
        emitSelect,
        emitSelectEnd,
      },
    }
  );

  return { editorAppMachine, subscribeEditorMachine };
}

export function createEditorAppMachineInterpreter(id: string) {
  const { editorAppMachine, subscribeEditorMachine } =
    createEditorAppMachine(id);
  const editorAppMachineInterpreter = interpret(editorAppMachine);
  return { editorAppMachineInterpreter, subscribeEditorMachine };
}
