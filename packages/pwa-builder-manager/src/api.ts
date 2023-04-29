import { io, Socket } from "socket.io-client";
import {
  BrowserForestManager,
  ClientToServerEvents,
  ImportedResource,
  ServerToClientEvents,
  TemplateDetail,
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
  // delete the forest to start from scratch
  BrowserForestManager.deleteForest(
    BrowserForestManager.currentForest.forestPkgId,
    context.currentRouteObjectPath
  );
  // create a new instance of forest and set it as current
  BrowserForestManager.setCurrentForest(
    BrowserForestManager.currentForest.forestPkgId,
    context.currentRouteObjectPath
  );
  // fetch only if not already fetched
  socket.emit("fetchEvents", context.currentUrlPath, (events) => {
    editorAppMachineInterpreter.send({
      type: "PAGE_EVENTS_FETCHED",
      events,
      urlPath: context.currentUrlPath,
    });
  });
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
  },
  callback?: (success: boolean) => void
) {
  const forest = BrowserForestManager.getForest(forestPkgId, routeObjectPath);
  if (forest) {
    forest.handleEvents(data);
    const { events } = data;
    socket.emit("saveEvents", routeObjectPath, events, (success) => {
      if (!success) {
        console.log("Failed to send event to backend");
      }
      callback?.(success);
    });
  }
}

function importResource(
  importStatement: { str: string },
  callback: (success: boolean) => void
) {
  socket.emit("importResource", importStatement, callback);
}

function getResources(callback: (resources: ImportedResource[]) => void) {
  socket.emit("getResources", callback);
}

function subscribeResourceUpdates(
  callback: (resource: ImportedResource) => void
) {
  socket.on("newResource", callback);
  return () => {
    socket.off("newResource", callback);
  };
}

function getTemplateList(callback: (templateList: string[]) => void) {
  socket.emit("getTemplateList", callback);
}

function createTemplate(
  name: string,
  events: AnyEvent[],
  callback: (success: boolean) => void
) {
  socket.emit("createTemplate", name, events, callback);
}

/**
 *
 * @param files Each property of file is derived from the Web API File.
 */
function uploadAssets(
  files: {
    name: string;
    data: ArrayBuffer;
    size: number;
    mime: string;
  }[],
  callback: (success: boolean, urls: string[]) => void
) {
  socket.emit("uploadAssets", files, callback);
}

function getAssetsInfo(
  callback: (assets: { [name: string]: { url: string; mime: string } }) => void
) {
  socket.emit("getAssetsInfo", callback);
}

function getTemplateEvents(
  name: string,
  callback: (events: AnyEvent[]) => void
) {
  socket.emit("getTemplateEvents", name, callback);
}

function deleteTemplate(name: string, callback: (success: boolean) => void) {
  socket.emit("deleteTemplate", name, callback);
}

export const api = {
  postNewEvents,
  // resource api
  importResource,
  getResources,
  subscribeResourceUpdates,
  // assets api
  uploadAssets,
  getAssetsInfo,
  //template
  getTemplateList,
  createTemplate,
  getTemplateEvents,
  deleteTemplate,
};
