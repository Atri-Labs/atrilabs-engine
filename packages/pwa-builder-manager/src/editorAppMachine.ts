import { createMachine, interpret } from "xstate";

// events
const APP_INFO_FETCHED = "APP_INFO_FETCHED" as const;
const PROJECT_INFO_FETCHED = "PROJECT_INFO_FETCHED" as const;
const PAGE_EVENTS_FETCHED = "PAGE_EVENTS_FETCHED" as const;
const CANVAS_IFRAME_LOADED = "CANVAS_IFRAME_LOADED" as const;
const NAVIGATE_PAGE = "NAVIGATE_PAGE" as const;

type APP_INFO_FETCHED_EVENT = {
  type: typeof APP_INFO_FETCHED;
  info: { hostname: string };
};
type PROJECT_INFO_FETCHED_EVENT = {
  type: typeof PROJECT_INFO_FETCHED;
  info: { id: string };
};
type PAGE_EVENTS_FETCHED_EVENT = {
  type: typeof PAGE_EVENTS_FETCHED;
  urlPath: string;
  events: { [canvasZoneId: string]: any[] };
};
type CANVAS_IFRAME_LOADED_EVENT = { type: typeof CANVAS_IFRAME_LOADED };
type NAVIGATE_PAGE_EVENT = { type: typeof NAVIGATE_PAGE };

type EDITOR_APP_EVENTS =
  | APP_INFO_FETCHED_EVENT
  | PROJECT_INFO_FETCHED_EVENT
  | PAGE_EVENTS_FETCHED_EVENT
  | CANVAS_IFRAME_LOADED_EVENT
  | NAVIGATE_PAGE_EVENT;

// states
const booting = "booting" as const; // initial data fetching is done
const loading_app = "loading_app" as const; // the app in the canvas is
const ready = "ready" as const; // ready for drag-drop events

// context
type EDITOR_APP_CONTEXT = {
  projectInfo: { id: string } | null;
  appInfo: { hostname: string } | null;
  currentRouteObjectPath: string;
  currentUrlPath: string;
  events: { [urlPath: string]: { [canvasZoneId: string]: any[] } };
  iframeLoadStatus: "done" | "progress";
};

// conds

function isBootupComplete(context: EDITOR_APP_CONTEXT) {
  return context.appInfo !== null && context.projectInfo !== null;
}

function isLoadingAppComplete(context: EDITOR_APP_CONTEXT) {
  return (
    context.iframeLoadStatus === "done" &&
    context.events[context.currentUrlPath] !== undefined
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

function setPageEvents(
  context: EDITOR_APP_CONTEXT,
  event: PAGE_EVENTS_FETCHED_EVENT
) {
  context.events[event.urlPath] = event.events;
}

function setIframeStatusToDone(context: EDITOR_APP_CONTEXT) {
  context.iframeLoadStatus = "done";
}

export function createEditorAppMachine(id: string) {
  type SUBSCRIPTION_STATES = "afterbootup";

  const subscribers: {
    [key in SUBSCRIPTION_STATES]: ((context: EDITOR_APP_CONTEXT) => void)[];
  } = {
    afterbootup: [],
  };

  function subscribeEditorMachine(
    state: SUBSCRIPTION_STATES,
    cb: (context: EDITOR_APP_CONTEXT) => void
  ) {
    switch (state) {
      case "afterbootup":
        subscribers[state].push(cb);
    }
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
      context: {
        projectInfo: null,
        appInfo: null,
        currentRouteObjectPath: "/",
        currentUrlPath: "/",
        events: {},
        iframeLoadStatus: "progress",
      },
      initial: booting,
      states: {
        [booting]: {
          on: {
            [APP_INFO_FETCHED]: {
              target: loading_app,
              actions: ["setAppInfo"],
              cond: isBootupComplete,
            },
            [PROJECT_INFO_FETCHED]: {
              target: loading_app,
              actions: ["setProjectInfo"],
              cond: isBootupComplete,
            },
          },
          exit: (context) => {
            callSubscribers("afterbootup", context);
          },
        },
        [loading_app]: {
          on: {
            [PAGE_EVENTS_FETCHED]: {
              target: ready,
              actions: ["setPageEvents"],
              cond: isLoadingAppComplete,
            },
            [CANVAS_IFRAME_LOADED]: {
              target: ready,
              actions: ["setIframeStatusToDone"],
              cond: isLoadingAppComplete,
            },
          },
        },
        [ready]: {
          on: {
            [NAVIGATE_PAGE]: { target: loading_app },
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
