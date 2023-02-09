import { createMachine, interpret } from "xstate";
import { NextFunction, Request, Response } from "express";
import { getPageHtml, isPageRequest, matchUrlPath } from "./utils";
import { IRToUnixFilePath, routeObjectPathToIR } from "@atrilabs/atri-app-core";
import { Compiler } from "webpack";
import { intersection } from "lodash";

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

export type LIB_SERVER_DONE_EVENT = {
  type: typeof LIB_SERVER_DONE;
  compiler: Compiler;
};
export type APP_SERVER_DONE_EVENT = {
  type: typeof APP_SERVER_DONE;
  compiler: Compiler;
};
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
  requestReservoir: { req: Request; res: Response; next: NextFunction }[];
  requestedRouteObjectPaths: Set<string>;
  routeObjectPaths: string[];
  appCompiler?: Compiler;
  libCompiler?: Compiler;
  latestRouteObjectPaths: string[] | undefined;
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
async function _handleRequests(options: {
  routeObjectPaths: string[];
  requests: SERVER_MACHINE_CONTEXT["requests"];
  requestedRouteObjectPaths: Set<string>;
  appCompiler: Compiler;
  libCompiler: Compiler;
  requestReservoir: SERVER_MACHINE_CONTEXT["requestReservoir"];
}) {
  const {
    requests,
    routeObjectPaths,
    requestedRouteObjectPaths,
    requestReservoir,
    appCompiler,
    libCompiler,
  } = options;
  const routeObjects = routeObjectPaths.map((routeObjectPath) => {
    return { path: routeObjectPath };
  });

  // TODO: Later we will handle JS/JSON requests here
  const nonPageRequests = requests.filter((request) => {
    return !isPageRequest(request.req);
  });
  nonPageRequests.forEach((nonPageRequest) => {
    nonPageRequest.next();
  });

  const pageRequests = requests.filter((request) => {
    return isPageRequest(request.req);
  });
  const matches = pageRequests.map((request) => {
    return matchUrlPath(routeObjects, request.req.originalUrl);
  });
  const nonNullMatches = matches.filter((match) => match !== null);
  const newRouteObjectPaths = new Set<string>();
  nonNullMatches.forEach((nonNullMatch) => {
    const newRouteObjectPath = nonNullMatch![0]!.route.path;
    if (!requestedRouteObjectPaths.has(newRouteObjectPath)) {
      newRouteObjectPaths.add(newRouteObjectPath);
    }
  });

  // handle null matches
  for (let i = 0; i < pageRequests.length; i++) {
    const match = matches[i];
    const pageRequest = pageRequests[i]!;
    if (match === null) {
      pageRequest.res.send(
        `Error: Cannot find a route for url ${pageRequest.req.originalUrl}`
      );
    } else if (
      match !== null &&
      newRouteObjectPaths.has(match![0]!.route.path)
    ) {
      // add to requestedRouteObjectPaths
      requestedRouteObjectPaths.add(match![0]!.route.path);
      // move request to reservoir
      requestReservoir.push(pageRequest);
    } else {
      // answer all non-new requests
      // pageRequest.res.send(`old request ${pageRequest.req.originalUrl}`);
      const routeObjectPath = match![0]!.route.path;
      const ir = routeObjectPathToIR(routeObjectPath);
      const splices = IRToUnixFilePath(ir).split("/").splice(1);
      const htmlString = getPageHtml(["pages", ...splices]);
      pageRequest.res.send(`<!DOCTYPE html>\n${htmlString}`);
    }
  }

  if (newRouteObjectPaths.size > 0) {
    // call invalidate
    appCompiler.watching.invalidate();
    libCompiler.watching.invalidate();
  }
}

function handleRequests(context: SERVER_MACHINE_CONTEXT) {
  return _handleRequests({
    routeObjectPaths: context.routeObjectPaths,
    requests: context.requests,
    requestedRouteObjectPaths: context.requestedRouteObjectPaths,
    libCompiler: context.libCompiler!,
    appCompiler: context.appCompiler!,
    requestReservoir: context.requestReservoir,
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

function setLibServerToDone(
  context: SERVER_MACHINE_CONTEXT,
  event: LIB_SERVER_DONE_EVENT
) {
  context.libServer = "done";
  context.libCompiler = event.compiler;
}

function setAppServerToDone(
  context: SERVER_MACHINE_CONTEXT,
  event: APP_SERVER_DONE_EVENT
) {
  context.appServer = "done";
  context.appCompiler = event.compiler;
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

function _removeDeletedPages(context: SERVER_MACHINE_CONTEXT) {
  const remainingRequestedRouteObjectPaths = intersection(
    Array.from(context.requestedRouteObjectPaths),
    context.routeObjectPaths
  );
  context.requestedRouteObjectPaths = new Set(
    remainingRequestedRouteObjectPaths
  );
}

function setRouteObjectPaths(
  context: SERVER_MACHINE_CONTEXT,
  event: ROUTE_OBJECTS_UPDATED_EVENT
) {
  context.routeObjectPaths = event.routeObjectPaths;
  _removeDeletedPages(context);
}

function setLatestRouteObjectPaths(
  context: SERVER_MACHINE_CONTEXT,
  event: ROUTE_OBJECTS_UPDATED_EVENT
) {
  context.latestRouteObjectPaths = event.routeObjectPaths;
}

function swapLatestRouteObjectPaths(context: SERVER_MACHINE_CONTEXT) {
  if (context.latestRouteObjectPaths !== undefined) {
    context.routeObjectPaths = context.latestRouteObjectPaths;
    context.latestRouteObjectPaths = undefined;
    _removeDeletedPages(context);
  }
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
        latestRouteObjectPaths: undefined,
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
                actions: ["setWatchToDone", "setRouteObjectPaths"],
              },
            ],
            [NETWORK_REQUEST]: [{ actions: ["saveRequest"] }],
          },
        },
        [serving]: {
          always: [{ target: handlingRequests, cond: hasPendingRequests }],
          on: {
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
                actions: ["swapRequestReservoir", "swapLatestRouteObjectPaths"],
                cond: inProcessing,
              },
              {
                target: serving,
                actions: ["swapRequestReservoir", "swapLatestRouteObjectPaths"],
                cond: notInProcessing,
              },
            ],
            onError: {},
          },
          on: {
            [NETWORK_REQUEST]: [{ actions: ["saveRequestToReservoir"] }],
            [LIB_SERVER_INVALIDATED]: [
              { actions: ["setLibServerToProcessing"] },
            ],
            [APP_SERVER_INVALIDATED]: [
              { actions: ["setAppServerToProcessing"] },
            ],
            [FS_CHANGED]: [{ actions: ["setWatchToProcessing"] }],
            /**
             * It might happen that lib server is set to processing
             * while in handlingRequest state and then it is set to
             * done during the handlingRequest phase itself. Same goes
             * for app server and fs changes.
             */
            [LIB_SERVER_DONE]: [{ actions: ["setLibServerToDone"] }],
            [APP_SERVER_DONE]: [{ actions: ["setAppServerToDone"] }],
            [ROUTE_OBJECTS_UPDATED]: [
              { actions: ["setWatchToDone", "setLatestRouteObjectPaths"] },
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
        setLatestRouteObjectPaths,
        swapLatestRouteObjectPaths,
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
