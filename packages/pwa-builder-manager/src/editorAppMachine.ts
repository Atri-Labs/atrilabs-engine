import type { DragData } from "@atrilabs/atri-app-core";
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
const INSIDE_CANVAS = "INSIDE_CANVAS" as const;
const OUTSIDE_CANVAS = "OUTSIDE_CANVAS" as const;

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
type CANVAS_IFRAME_LOADED_EVENT = { type: typeof CANVAS_IFRAME_LOADED };
type NAVIGATE_PAGE_EVENT = { type: typeof NAVIGATE_PAGE; urlPath: string };
type START_DRAG_EVENT = { type: typeof START_DRAG; dragData: DragData };
type MOUSE_MOVE_EVENT = {
  type: typeof MOUSE_MOVE;
  event: { pageX: number; pageY: number };
};
type INSIDE_CANVAS_EVENT = {
  type: typeof INSIDE_CANVAS;
  event: { pageX: number; pageY: number };
};
type OUTSIDE_CANVAS_EVENT = {
  type: typeof OUTSIDE_CANVAS;
  event: { pageX: number; pageY: number };
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
  | INSIDE_CANVAS_EVENT
  | OUTSIDE_CANVAS_EVENT;

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
  mousePosition: { pageX: number; pageY: number } | null;
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

function setIframeStatusToDone(context: EDITOR_APP_CONTEXT) {
  context.iframeLoadStatus = "done";
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
}

function setMousePosition(
  context: EDITOR_APP_CONTEXT,
  event: MOUSE_MOVE_EVENT
) {
  context.mousePosition = event.event;
}

export function createEditorAppMachine(id: string) {
  type SUBSCRIPTION_STATES = "afterbootup" | "before_app_load" | "ready";

  const subscribers: {
    [key in SUBSCRIPTION_STATES]: ((context: EDITOR_APP_CONTEXT) => void)[];
  } = {
    afterbootup: [],
    before_app_load: [],
    ready: [],
  };

  function subscribeEditorMachine(
    state: SUBSCRIPTION_STATES,
    cb: (context: EDITOR_APP_CONTEXT) => void
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
    context: EDITOR_APP_CONTEXT
  ) {
    subscribers[state].forEach((cb) => {
      try {
        cb(context);
      } catch (err) {
        console.error(`Failed to run a subscriber upon ${state}`);
      }
    });
  }

  const editorAppMachine = createMachine<EDITOR_APP_CONTEXT, EDITOR_APP_EVENTS>(
    {
      id: id,
      predictableActionArguments: true,
      context: {
        projectInfo: null,
        appInfo: null,
        pagesInfo: null,
        currentRouteObjectPath: "/",
        currentUrlPath: "/",
        events: {},
        iframeLoadStatus: "progress",
        dragData: null,
        mousePosition: null,
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
            callSubscribers("afterbootup", context);
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
          entry: (context) => {
            context.iframeLoadStatus = "progress";
            callSubscribers("before_app_load", context);
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
          entry: (context) => {
            callSubscribers("ready", context);
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
              },
            },
            [drag_in_progress]: {
              on: {
                [MOUSE_MOVE]: { actions: ["setMousePosition"] },
              },
            },
          },
          exit: (context) => {
            context.dragData = null;
            context.mousePosition = null;
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
