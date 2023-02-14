import { ManifestIR } from "@atrilabs/core";
import { NextFunction } from "express";
import { Compiler } from "webpack";
import { createMachine, interpret } from "xstate";

// states
export const processing = "processing" as const;
export const serving = "serving" as const;
export const handlingRequests = "handlingRequests" as const;

// event types
export const EDITOR_APP_SERVER_DONE = "EDITOR_APP_SERVER_DONE" as const;
export const MANIFEST_LIB_DONE = "MANIFEST_LIB_DONE" as const;
export const MANIFEST_OBJECTS_UPDATED = "MANIFEST_OBJECTS_UPDATED" as const;
export const NETWORK_REQUEST = "NETWORK_REQUEST" as const;
export const EDITOR_APP_SERVER_INVALIDATED =
  "EDITOR_APP_SERVER_INVALIDATED" as const;
export const MANIFEST_LIB_INVALIDATED = "MANIFEST_LIB_INVALIDATED" as const;
export const FS_CHANGED = "FS_CHANGED" as const;

export type EDITOR_APP_SERVER_DONE_EVENT = {
  type: typeof EDITOR_APP_SERVER_DONE;
  compiler: Compiler;
};
export type MANIFEST_LIB_DONE_EVENT = {
  type: typeof MANIFEST_LIB_DONE;
  compiler: Compiler;
};
export type MANIFEST_OBJECTS_UPDATED_EVENT = {
  type: typeof MANIFEST_OBJECTS_UPDATED;
  manifests: ManifestIR[];
};
export type NETWORK_REQUEST_EVENT = {
  type: typeof NETWORK_REQUEST;
  input: { req: Request; res: Response; next: NextFunction };
};
export type EDITOR_APP_SERVER_INVALIDATED_EVENT = {
  type: typeof EDITOR_APP_SERVER_INVALIDATED;
};
export type MANIFEST_LIB_INVALIDATED_EVENT = {
  type: typeof MANIFEST_LIB_INVALIDATED;
};
export type FS_CHANGED_EVENT = { type: typeof FS_CHANGED };

export type SERVER_MACHINE_EVENT =
  | EDITOR_APP_SERVER_DONE_EVENT
  | MANIFEST_OBJECTS_UPDATED_EVENT
  | NETWORK_REQUEST_EVENT
  | EDITOR_APP_SERVER_INVALIDATED_EVENT
  | FS_CHANGED_EVENT
  | MANIFEST_LIB_INVALIDATED_EVENT
  | MANIFEST_LIB_DONE_EVENT;

export type EDITOR_SERVER_MACHINE_CONTEXT = {
  editorAppServer: "processing" | "done";
  manifestLib: "processing" | "done";
  watch: "processing" | "done";
  requests: { req: Request; res: Response; next: NextFunction }[];
  requestReservoir: { req: Request; res: Response; next: NextFunction }[];
  manifests: ManifestIR[];
  editorAppCompiler?: Compiler;
  manifestLibCompiler?: Compiler;
  latestManifests: ManifestIR[] | undefined;
};

// conds

function inProcessing(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  return (
    context.editorAppServer === "processing" ||
    context.watch === "processing" ||
    context.manifestLib === "processing"
  );
}

function notInProcessing(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  return !inProcessing(context);
}

function onlyEditorServerWasNotDone(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  return (
    context.editorAppServer === "processing" &&
    context.watch === "done" &&
    context.manifestLib === "done"
  );
}

function onlyWatchWasNotDone(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  return (
    context.editorAppServer === "done" &&
    context.watch === "processing" &&
    context.manifestLib === "done"
  );
}

function onlyManifestLibNotDone(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  return (
    context.editorAppServer === "done" &&
    context.watch === "done" &&
    context.manifestLib === "processing"
  );
}

function hasPendingRequests(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  return context.requests.length > 0;
}

// actions

function saveRequest(
  context: EDITOR_SERVER_MACHINE_CONTEXT,
  event: NETWORK_REQUEST_EVENT
) {
  context.requests.push(event.input);
}

function saveRequestToReservoir(
  context: EDITOR_SERVER_MACHINE_CONTEXT,
  event: NETWORK_REQUEST_EVENT
) {
  context.requestReservoir.push(event.input);
}

function setEditorAppServerToDone(
  context: EDITOR_SERVER_MACHINE_CONTEXT,
  event: EDITOR_APP_SERVER_DONE_EVENT
) {
  context.editorAppServer = "done";
  context.editorAppCompiler = event.compiler;
}

function setManifestLibToDone(
  context: EDITOR_SERVER_MACHINE_CONTEXT,
  event: MANIFEST_LIB_DONE_EVENT
) {
  context.manifestLib = "done";
  context.manifestLibCompiler = event.compiler;
}

function setWatchToDone(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  context.watch = "done";
}

function setEditorAppServerToProcessing(
  context: EDITOR_SERVER_MACHINE_CONTEXT
) {
  context.editorAppServer = "processing";
}

function setManifestLibToProcessing(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  context.manifestLib = "processing";
}

function setWatchToProcessing(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  context.watch = "processing";
}

function swapRequestReservoir(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  context.requests = [...context.requestReservoir];
  context.requestReservoir = [];
}

async function handleRequests(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  context.requests.forEach(({ next }) => {
    next();
  });
}

function setManifests(
  context: EDITOR_SERVER_MACHINE_CONTEXT,
  event: MANIFEST_OBJECTS_UPDATED_EVENT
) {
  context.manifests = event.manifests;
}

function setLatestManifests(
  context: EDITOR_SERVER_MACHINE_CONTEXT,
  event: MANIFEST_OBJECTS_UPDATED_EVENT
) {
  context.latestManifests = event.manifests;
}

function swapLatestManifests(context: EDITOR_SERVER_MACHINE_CONTEXT) {
  if (context.latestManifests) {
    context.manifests = context.latestManifests;
    context.latestManifests = undefined;
  }
}

export function createEditorServerMachine(id: string) {
  return createMachine(
    {
      id: id,
      initial: processing,
      context: {
        editorAppServer: "processing",
        manifestLib: "processing",
        watch: "processing",
        requests: [],
        requestReservoir: [],
        manifests: [],
        latestManifests: undefined,
      } as EDITOR_SERVER_MACHINE_CONTEXT,
      states: {
        [processing]: {
          on: {
            [EDITOR_APP_SERVER_DONE]: [
              {
                target: serving,
                cond: onlyEditorServerWasNotDone,
                actions: ["setEditorAppServerToDone"],
              },
              {
                target: processing,
                actions: ["setEditorAppServerToDone"],
              },
            ],
            [MANIFEST_LIB_DONE]: [
              {
                target: serving,
                cond: onlyManifestLibNotDone,
                actions: ["setManifestLibToDone"],
              },
              {
                target: processing,
                actions: ["setManifestLibToDone"],
              },
            ],
            [MANIFEST_OBJECTS_UPDATED]: [
              {
                target: serving,
                cond: onlyWatchWasNotDone,
                actions: ["setWatchToDone", "setManifests"],
              },
              {
                target: processing,
                actions: ["setWatchToDone", "setManifests"],
              },
            ],
            [NETWORK_REQUEST]: [
              { target: processing, actions: ["saveRequest"] },
            ],
          },
        },
        [serving]: {
          always: [{ target: handlingRequests, cond: hasPendingRequests }],
          on: {
            [NETWORK_REQUEST]: [
              { target: handlingRequests, actions: ["saveRequest"] },
            ],
            [EDITOR_APP_SERVER_INVALIDATED]: [
              {
                target: processing,
                actions: ["setEditorAppServerToProcessing"],
              },
            ],
            [MANIFEST_LIB_INVALIDATED]: [
              {
                target: processing,
                actions: ["setManifestLibToProcessing"],
              },
            ],
            [FS_CHANGED]: [
              { target: processing, actions: ["setWatchToProcessing"] },
            ],
          },
        },
        [handlingRequests]: {
          invoke: {
            id: "handleRequests",
            src: handleRequests,
            onDone: [
              {
                target: processing,
                actions: ["swapRequestReservoir", "swapLatestManifests"],
                cond: inProcessing,
              },
              {
                target: serving,
                actions: ["swapRequestReservoir", "swapLatestManifests"],
                cond: notInProcessing,
              },
            ],
            onError: {},
          },
          on: {
            [NETWORK_REQUEST]: [{ actions: ["saveRequestToReservoir"] }],
            [EDITOR_APP_SERVER_INVALIDATED]: [
              { actions: ["setEditorAppServerToProcessing"] },
            ],
            [MANIFEST_LIB_INVALIDATED]: [
              { actions: ["setManifestLibToProcessing"] },
            ],
            [FS_CHANGED]: [{ actions: ["setWatchToProcessing"] }],
            /**
             * It might happen that lib server is set to processing
             * while in handlingRequest state and then it is set to
             * done during the handlingRequest phase itself. Same goes
             * for app server and fs changes.
             */
            [EDITOR_APP_SERVER_DONE]: [
              { actions: ["setEditorAppServerToDone"] },
            ],
            [MANIFEST_LIB_DONE]: [{ actions: ["setManifestLibToDone"] }],
            [MANIFEST_OBJECTS_UPDATED]: [
              { actions: ["setWatchToDone", "setLatestManifests"] },
            ],
          },
        },
      },
    },
    {
      actions: {
        saveRequest,
        saveRequestToReservoir,
        setEditorAppServerToDone,
        setWatchToDone,
        setEditorAppServerToProcessing,
        setWatchToProcessing,
        swapRequestReservoir,
        setManifests,
        setLatestManifests,
        swapLatestManifests,
        setManifestLibToDone,
        setManifestLibToProcessing,
      },
      services: {
        handleRequests,
      },
    }
  );
}

export function createServerMachineInterpreter(id: string) {
  const machine = createEditorServerMachine(id);
  return interpret(machine);
}
