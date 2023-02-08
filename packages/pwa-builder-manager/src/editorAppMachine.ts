import type { DragComp, DragData } from "@atrilabs/atri-app-core";
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
const COMPONENT_CREATED = "COMPONENT_CREATED" as const;
const DRAG_FAILED = "DRAG_FAILED" as const;

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
  events: { [canvasZoneId: string]: any[] };
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
type COMPONENT_CREATED_EVENT = {
  type: typeof COMPONENT_CREATED;
};
type DRAG_FAILED_EVENT = {
  type: typeof DRAG_FAILED;
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
  | COMPONENT_CREATED_EVENT
  | DRAG_FAILED_EVENT;

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
  events: { [urlPath: string]: { [canvasZoneId: string]: any[] } };
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
    | "ready"
    | "drag_started"
    | "drag_in_progress"
    | "mouse_move_during_drag"
    | "drag_failed"
    | "component_created";

  const subscribers: {
    [key in SUBSCRIPTION_STATES]: ((
      context: EDITOR_APP_CONTEXT,
      event: EDITOR_APP_EVENTS
    ) => void)[];
  } = {
    afterbootup: [],
    before_app_load: [],
    ready: [],
    drag_started: [],
    drag_in_progress: [],
    mouse_move_during_drag: [],
    drag_failed: [],
    component_created: [],
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
        cb(context, event);
      } catch (err) {
        console.error(`Failed to run a subscriber upon ${state}`);
      }
    });
  }

  function emitMouseMoveDuringDrag(
    context: EDITOR_APP_CONTEXT,
    event: MOUSE_MOVE_EVENT
  ) {
    callSubscribers("mouse_move_during_drag", context, event);
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
                [INSIDE_CANVAS]: { actions: ["setCanvasMousePosition"] },
                [OUTSIDE_CANVAS]: { actions: ["setCanvasMousePosition"] },
                [DROPZONE_CREATED]: { actions: ["setDropzone"] },
                [COMPONENT_CREATED]: { target: `#${id}.${ready}` },
                [DRAG_FAILED]: { target: `#${id}.${ready}` },
              },
              entry: (context, event) => {
                callSubscribers("drag_in_progress", context, event);
              },
            },
          },
          exit: (context, event) => {
            context.dragData = null;
            context.mousePosition = null;
            context.canvasMousePosition = null;
            context.dropzone = null;
            context.dragComp = null;
            if (event.type === "COMPONENT_CREATED") {
              callSubscribers("component_created", context, event);
            }
            if (event.type === "DRAG_FAILED" || event.type === "MOUSE_UP") {
              callSubscribers("drag_failed", context, event);
            }
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
