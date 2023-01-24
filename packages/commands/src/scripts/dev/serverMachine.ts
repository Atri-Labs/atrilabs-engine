import { createMachine, interpret } from "xstate";
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

export type LIB_SERVER_DONE_EVENT = { type: typeof LIB_SERVER_DONE };
export type APP_SERVER_DONE_EVENT = { type: typeof APP_SERVER_DONE };
export type ROUTE_OBJECTS_UPDATED_EVENT = {
  type: typeof ROUTE_OBJECTS_UPDATED;
  routeObjectPaths: string[];
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
export type SERVER_MACHINE_EVENT =
  | LIB_SERVER_DONE_EVENT
  | APP_SERVER_DONE_EVENT
  | ROUTE_OBJECTS_UPDATED_EVENT
  | NETWORK_REQUEST_EVENT
  | LIB_SERVER_INVALIDATED_EVENT
  | APP_SERVER_INVALIDATED_EVENT
  | FS_CHANGED_EVENT
  | FULLFILL_EXISTING_REQUESTS_EVENT;

export type SERVER_MACHINE_CONTEXT = {
  libServer: "processing" | "done";
  appServer: "processing" | "done";
  watch: "processing" | "done";
  requests: { req: Request; res: Response; next: NextFunction }[];
  requestReservoir: { req: Request; res: Response; next: NextFunction }[];
  requestedRouteObjectPaths: Set<string>;
  routeObjectPaths: string[];
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

function onlyLibServerWasNotDone(context: SERVER_MACHINE_CONTEXT) {
  return (
    context.libServer === "processing" &&
    context.appServer === "done" &&
    context.watch === "done"
  );
}

function onlyAppServerWasNotDone(context: SERVER_MACHINE_CONTEXT) {
  return (
    context.libServer === "done" &&
    context.appServer === "processing" &&
    context.watch === "done"
  );
}

function onlyWatchWasNotDone(context: SERVER_MACHINE_CONTEXT) {
  return (
    context.libServer === "done" &&
    context.appServer === "done" &&
    context.watch === "processing"
  );
}
// actions

function _handleRequests(options: {
  routeObjectPaths: string[];
  requests: SERVER_MACHINE_CONTEXT["requests"];
  requestedRouteObjectPaths: Set<string>;
}) {
  return new Promise<void>((resolve) => {
    const { requests, requestedRouteObjectPaths, routeObjectPaths } = options;
    let curr = 0;
    while (curr < requests.length) {
      const { req, res, next } = requests[curr]!;
      // TODO: handle request
      printRequest(req);
      if (isPageRequest(req)) {
        const match = matchUrlPath(
          routeObjectPaths.map((p) => {
            return { path: p };
          }),
          req.originalUrl
        );
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
    resolve();
  });
}

function handleRequests(context: SERVER_MACHINE_CONTEXT) {
  return _handleRequests({
    routeObjectPaths: context.routeObjectPaths,
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

function setRouteObjectPaths(
  context: SERVER_MACHINE_CONTEXT,
  event: ROUTE_OBJECTS_UPDATED_EVENT
) {
  context.routeObjectPaths = event.routeObjectPaths;
}

/**
 * Server is in ready state only after watchers have
 * loaded initial directory.
 *
 * Tracks state of both the compilers.
 *
 * Saves triplet of req, res, next.
 *
 * Does not process and respond to any request while
 * any of the compiler is not ready.
 *
 * Responds quickly if none of the compilers are in
 * processing mode and the page is ready.
 *
 * Once the compilers are not in processing mode,
 * call watching.invalidate for requests for new page.
 * @param id
 * @returns
 */
export function createServerMachine(id: string) {
  return createMachine(
    {
      id: id,
      initial: processing,
      context: {
        libServer: "processing",
        appServer: "processing",
        watch: "processing",
        requests: [],
        requestReservoir: [],
        requestedRouteObjectPaths: new Set(),
        routeObjectPaths: [],
      } as SERVER_MACHINE_CONTEXT,
      states: {
        [processing]: {
          on: {
            [LIB_SERVER_DONE]: [
              {
                target: serving,
                cond: onlyLibServerWasNotDone,
                actions: ["setLibServerToDone"],
              },
              {
                target: processing,
                actions: ["setLibServerToDone"],
              },
            ],
            [APP_SERVER_DONE]: [
              {
                target: serving,
                cond: onlyAppServerWasNotDone,
                actions: ["setAppServerToDone"],
              },
              {
                target: processing,
                actions: ["setAppServerToDone"],
              },
            ],
            [ROUTE_OBJECTS_UPDATED]: [
              {
                target: serving,
                cond: onlyWatchWasNotDone,
                actions: ["setWatchToDone", "setRouteObjectPaths"],
              },
              {
                target: processing,
                actions: ["setWatchToDone", "setRouteObjectPaths"],
              },
            ],
            [NETWORK_REQUEST]: [
              { target: processing, actions: ["saveRequest"] },
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
          invoke: {
            id: "handleRequests",
            src: handleRequests,
            onDone: [
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
            onError: {},
          },
          on: {
            [NETWORK_REQUEST]: [
              { target: handlingRequests, actions: ["saveRequestToReservoir"] },
            ],
            [LIB_SERVER_INVALIDATED]: [
              {
                target: handlingRequests,
                actions: ["setLibServerToProcessing"],
              },
            ],
            [APP_SERVER_INVALIDATED]: [
              {
                target: handlingRequests,
                actions: ["setAppServerToProcessing"],
              },
            ],
            [FS_CHANGED]: [
              { target: handlingRequests, actions: ["setWatchToProcessing"] },
            ],
          },
        },
      },
    },
    {
      actions: {
        saveRequest,
        saveRequestToReservoir,
        setLibServerToDone,
        setAppServerToDone,
        setWatchToDone,
        setLibServerToProcessing,
        setAppServerToProcessing,
        setWatchToProcessing,
        swapRequestReservoir,
        setRouteObjectPaths,
      },
      services: {
        handleRequests,
      },
    }
  );
}

export function createServerMachineInterpreter(id: string) {
  const machine = createServerMachine(id);
  return interpret(machine);
}
