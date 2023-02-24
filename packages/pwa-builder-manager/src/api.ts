import { io, Socket } from "socket.io-client";
import {
  BrowserForestManager,
  ClientToServerEvents,
  ImportedResource,
  ServerToClientEvents,
} from "@atrilabs/core";
import { editorAppMachineInterpreter, subscribeEditorMachine } from "./init";
import { AnyEvent, EventMetaData } from "@atrilabs/forest";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

socket.on("connect", () => {
  socket.emit("getProjectInfo", (info) => {
    editorAppMachineInterpreter.send({ type: "PROJECT_INFO_FETCHED", info });
  });
  socket.emit("getAppInfo", (info) => {
    editorAppMachineInterpreter.send({ type: "APP_INFO_FETCHED", info });
  });
  socket.emit("getPagesInfo", (info) => {
    editorAppMachineInterpreter.send({ type: "PAGES_INFO_FETCHED", info });
  });
});

subscribeEditorMachine("before_app_load", (context) => {
  // fetch only if not already fetched
  if (context.events[context.currentUrlPath] === undefined) {
    socket.emit("fetchEvents", context.currentUrlPath, (events) => {
      editorAppMachineInterpreter.send({
        type: "PAGE_EVENTS_FETCHED",
        events,
        urlPath: context.currentUrlPath,
      });
    });
  }
});

subscribeEditorMachine("after_app_load", (context) => {
  const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
  const forest = BrowserForestManager.getForest(
    forestPkgId,
    context.currentRouteObjectPath
  );
  forest?.handleEvents({
    events: context.events[context.currentUrlPath],
    name: "INIT_EVENTS",
    meta: { agent: "server-sent" },
  });
});

function postNewEvents(
  forestPkgId: string,
  routeObjectPath: string,
  data: {
    name: string;
    events: AnyEvent[];
    meta: EventMetaData;
  }
) {
  const forest = BrowserForestManager.getForest(forestPkgId, routeObjectPath);
  if (forest) {
    forest.handleEvents(data);
    const { events } = data;
    events.forEach((event) => {
      socket.emit("saveEvent", routeObjectPath, event, (success) => {
        if (!success) {
          console.log("Failed to send event to backend");
        }
      });
    });
  }
}

function importResource(
  importStatement: { str: string },
  callback: (success: boolean) => void
) {}

function getResources(callback: (resources: ImportedResource[]) => void) {}

function subscribeResourceUpdates(
  callback: (resource: ImportedResource) => void
) {}

export const api = {
  postNewEvents,
  importResource,
  getResources,
  subscribeResourceUpdates,
};
