import { createMachine } from "xstate";
import { NextFunction, Request, Response } from "express";
import { isPageRequest, matchUrlPath, printRequest } from "./utils";
import { IRToUnixFilePath, routeObjectPathToIR } from "@atrilabs/atri-app-core";

// states
export const processing = "processing" as const;
export const serving = "serving" as const;
export const handlingRequests = "handlingRequests" as const;

// event types
export const LIB_SERVER_DONE = "LIB_SERVER_DONE" as const;
export const APP_SERVER_DONE = "APP_SERVER_DONE" as const;
export const ROUTE_OBJECTS_UPDATED = "ROUTE_OBJECTS_UPDATED" as const;
export const NETWORK_REQUEST = "NETWORK_REQUEST" as const;
export const LIB_SERVER_INVALIDATED = "LIB_SERVER_INVALIDATED" as const;
export const APP_SERVER_INVALIDATED = "APP_SERVER_INVALIDATED" as const;
export const FS_CHANGED = "FS_CHANGED" as const;
export const FULLFILL_EXISTING_REQUESTS = "FULLFILL_EXISTING_REQUESTS" as const;
export const FULLFILLED_REQUESTS = "FULLFILL_EXISTING_REQUESTS" as const;

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
export type FULLFILL_EXISTING_REQUESTS_EVENT = {
  type: typeof FULLFILL_EXISTING_REQUESTS;
};
export type FULLFILLED_REQUESTS_EVENT = { type: typeof FULLFILLED_REQUESTS };
export type SERVER_MACHINE_EVENT =
  | LIB_SERVER_DONE_EVENT
  | APP_SERVER_DONE_EVENT
  | ROUTE_OBJECTS_UPDATED_EVENT
  | NETWORK_REQUEST_EVENT
  | LIB_SERVER_INVALIDATED_EVENT
  | APP_SERVER_INVALIDATED_EVENT
  | FS_CHANGED_EVENT
  | FULLFILL_EXISTING_REQUESTS_EVENT
  | FULLFILLED_REQUESTS_EVENT;

export type SERVER_MACHINE_CONTEXT = {
  libServer: "processing" | "done";
  appServer: "processing" | "done";
  watch: "processing" | "done";
  requests: { req: Request; res: Response; next: NextFunction }[];
  requestReservoir: { req: Request; res: Response; next: NextFunction }[];
  requestedRouteObjectPaths: Set<string>;
};

// conds

function inProcessing(context: SERVER_MACHINE_CONTEXT) {
  return (
    context.appServer === "processing" ||
    context.libServer === "processing" ||
    context.watch === "processing"
  );
}

function notInProcessing(context: SERVER_MACHINE_CONTEXT) {
  return !inProcessing(context);
}

function hasPendingRequests(context: SERVER_MACHINE_CONTEXT) {
  return context.requests.length > 0;
}

// actions

function _handleRequests(options: {
  requests: SERVER_MACHINE_CONTEXT["requests"];
  requestedRouteObjectPaths: Set<string>;
}) {
  const { requests, requestedRouteObjectPaths } = options;
  let curr = 0;
  while (curr < requests.length) {
    const { req, res, next } = requests[curr]!;
    // TODO: handle request
    printRequest(req);
    if (isPageRequest(req)) {
      const match = matchUrlPath(req.originalUrl);
      if (match === null) {
        // TODO: server error.tsx page
        res.send("error: match not found");
      } else {
        const filepath = IRToUnixFilePath(
          routeObjectPathToIR(match[0]!.route.path)
        );
        res.send(`success: will send ${filepath}`);
        if (requestedRouteObjectPaths.has(match[0]!.route.path)) {
          // TODO: build html server side
        } else {
          // TODO: add to entry
        }
      }
    } else {
      next();
    }
  }
}

function handleRequests(context: SERVER_MACHINE_CONTEXT) {
  _handleRequests({
    requests: context.requests,
    requestedRouteObjectPaths: context.requestedRouteObjectPaths,
  });
}

function saveRequest(
  context: SERVER_MACHINE_CONTEXT,
  event: NETWORK_REQUEST_EVENT
) {
  context.requests.push(event.input);
}

function saveRequestToReservoir(
  context: SERVER_MACHINE_CONTEXT,
  event: NETWORK_REQUEST_EVENT
) {
  context.requestReservoir.push(event.input);
}

function setLibServerToDone(context: SERVER_MACHINE_CONTEXT) {
  context.libServer = "done";
}

function setAppServerToDone(context: SERVER_MACHINE_CONTEXT) {
  context.appServer = "done";
}

function setWatchToDone(context: SERVER_MACHINE_CONTEXT) {
  context.watch = "done";
}

function setLibServerToProcessing(context: SERVER_MACHINE_CONTEXT) {
  context.libServer = "processing";
}

function setAppServerToProcessing(context: SERVER_MACHINE_CONTEXT) {
  context.appServer = "processing";
}

function setWatchToProcessing(context: SERVER_MACHINE_CONTEXT) {
  context.watch = "processing";
}

function swapRequestReservoir(context: SERVER_MACHINE_CONTEXT) {
  context.requests = [...context.requestReservoir];
  context.requestReservoir = [];
}

export const serverMachine = createMachine(
  {
    id: "serverMachine",
    initial: processing,
    context: {
      libServer: "processing",
      appServer: "processing",
      watch: "processing",
      requests: [],
      requestReservoir: [],
      requestedRouteObjectPaths: new Set(),
    } as SERVER_MACHINE_CONTEXT,
    states: {
      [processing]: {
        on: {
          [LIB_SERVER_DONE]: [
            {
              target: processing,
              cond: inProcessing,
              actions: ["setLibServerToDone"],
            },
            {
              target: serving,
              cond: notInProcessing,
              actions: ["setLibServerToDone"],
            },
          ],
          [APP_SERVER_DONE]: [
            {
              target: processing,
              cond: inProcessing,
              actions: ["setAppServerToDone"],
            },
            {
              target: serving,
              cond: notInProcessing,
              actions: ["setAppServerToDone"],
            },
          ],
          [ROUTE_OBJECTS_UPDATED]: [
            {
              target: processing,
              cond: inProcessing,
              actions: ["setWatchToDone"],
            },
            {
              target: serving,
              cond: notInProcessing,
              actions: ["setWatchToDone"],
            },
          ],
        },
      },
      [serving]: {
        on: {
          [FULLFILL_EXISTING_REQUESTS]: [
            { target: handlingRequests, cond: hasPendingRequests },
          ],
          [NETWORK_REQUEST]: [
            { target: handlingRequests, actions: ["saveRequest"] },
          ],
          [LIB_SERVER_INVALIDATED]: [
            { target: processing, actions: ["setLibServerToProcessing"] },
          ],
          [APP_SERVER_INVALIDATED]: [
            { target: processing, actions: ["setAppServerToProcessing"] },
          ],
          [FS_CHANGED]: [
            { target: processing, actions: ["setWatchToProcessing"] },
          ],
        },
      },
      [handlingRequests]: {
        on: {
          [FULLFILLED_REQUESTS]: [
            {
              target: processing,
              actions: ["swapRequestReservoir"],
              cond: inProcessing,
            },
            {
              target: serving,
              actions: ["swapRequestReservoir"],
              cond: notInProcessing,
            },
          ],
          [NETWORK_REQUEST]: [{ actions: ["saveRequestToReservoir"] }],
          [LIB_SERVER_INVALIDATED]: [{ actions: ["setLibServerToProcessing"] }],
          [APP_SERVER_INVALIDATED]: [{ actions: ["setAppServerToProcessing"] }],
          [FS_CHANGED]: [{ actions: ["setWatchToProcessing"] }],
        },
        entry: handleRequests,
      },
    },
  },
  {
    actions: {
      handleRequests,
      saveRequest,
      saveRequestToReservoir,
      setLibServerToDone,
      setAppServerToDone,
      setWatchToDone,
      setLibServerToProcessing,
      setAppServerToProcessing,
      setWatchToProcessing,
      swapRequestReservoir,
    },
  }
);
