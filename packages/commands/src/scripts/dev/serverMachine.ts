import { createMachine } from "xstate";
import { NextFunction, Request, Response } from "express";

// states
export const processing = "processing" as const;
export const serving = "serving" as const;

// event types
export const LIB_SERVER_DONE = "LIB_SERVER_DONE" as const;
export const APP_SERVER_DONE = "APP_SERVER_DONE" as const;
export const ROUTE_OBJECTS_UPDATED = "ROUTE_OBJECTS_UPDATED" as const;
export const NETWORK_REQUEST = "NETWORK_REQUEST" as const;
export const LIB_SERVER_INVALIDATED = "LIB_SERVER_INVALIDATED" as const;
export const APP_SERVER_INVALIDATED = "APP_SERVER_INVALIDATED" as const;
export const FS_CHANGED = "FS_CHANGED" as const;
export const AUTO = "AUTO" as const;

export type LIB_SERVER_DONE_EVENT = { type: typeof LIB_SERVER_DONE };
export type APP_SERVER_DONE_EVENT = { type: typeof APP_SERVER_DONE };
export type ROUTE_OBJECTS_UPDATED_EVENT = {
  type: typeof ROUTE_OBJECTS_UPDATED;
};
export type NETWORK_REQUEST_EVENT = {
  type: typeof NETWORK_REQUEST;
  input: { req: Request; res: Response; next: NextFunction };
};
export type LIB_SERVER_INVALIDATED_EVENT = {
  type: typeof LIB_SERVER_INVALIDATED;
};
export type APP_SERVER_INVALIDATED_EVENT = {
  type: typeof APP_SERVER_INVALIDATED;
};
export type FS_CHANGED_EVENT = { type: typeof FS_CHANGED };
export type SERVER_MACHINE_EVENT =
  | LIB_SERVER_DONE_EVENT
  | APP_SERVER_DONE_EVENT
  | ROUTE_OBJECTS_UPDATED_EVENT
  | NETWORK_REQUEST_EVENT
  | LIB_SERVER_INVALIDATED_EVENT
  | APP_SERVER_INVALIDATED_EVENT
  | FS_CHANGED_EVENT;

export type SERVER_MACHINE_CONTEXT = {
  libServer: "processing" | "done";
  appServer: "processing" | "done";
  watch: "processing" | "done";
  requests: { req: Request; res: Response; next: NextFunction }[];
};

function inProcessing(context: SERVER_MACHINE_CONTEXT) {
  if (
    context.appServer === "processing" ||
    context.libServer === "processing" ||
    context.watch === "processing"
  ) {
    return true;
  }
  return false;
}

function notInProcessing(context: SERVER_MACHINE_CONTEXT) {
  return !inProcessing(context);
}

function _handleRequests(requests: SERVER_MACHINE_CONTEXT["requests"]) {
  let curr = 0;
  while (curr < requests.length) {
    const { req, res, next } = requests[curr]!;
    // TODO: handle request
    console.log(req, res, next);
    requests.splice();
    curr++;
  }
}

function handleRequests(context: SERVER_MACHINE_CONTEXT) {
  _handleRequests(context.requests);
}

export const serverMachine = createMachine({
  initial: processing,
  context: {
    libServer: "processing",
    appServer: "processing",
    watch: "processing",
    requests: [],
  } as SERVER_MACHINE_CONTEXT,
  states: {
    [processing]: {
      on: {
        [LIB_SERVER_DONE]: [
          { target: processing, cond: inProcessing },
          { target: serving, cond: notInProcessing },
        ],
        [APP_SERVER_DONE]: [
          { target: processing, cond: inProcessing },
          { target: serving, cond: notInProcessing },
        ],
        [ROUTE_OBJECTS_UPDATED]: [
          { target: processing, cond: inProcessing },
          { target: serving, cond: notInProcessing },
        ],
      },
    },
    [serving]: {
      on: {
        AUTO: {[]},
        [NETWORK_REQUEST]: [{ actions: [handleRequests] }],
        [LIB_SERVER_INVALIDATED]: [{}],
        [APP_SERVER_INVALIDATED]: [{}],
        [FS_CHANGED]: [{}],
      },
      entry: handleRequests,
    },
  },
});
