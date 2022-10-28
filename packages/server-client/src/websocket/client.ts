import { BrowserClient } from "@atrilabs/core";
import { AnyEvent, Folder, Page, PageDetails } from "@atrilabs/forest";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import {
  ServerToClientEvents as IPCServerToClientEvents,
  ClientToServerEvents as IPCClientToServerEvents,
} from "../ipc-server/types";

const auth = { projectId: "" };

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env["ATRI_TOOL_EVENT_SERVER_CLIENT"] as string,
  { autoConnect: false, auth }
);

const ipcSocket: Socket<IPCServerToClientEvents, IPCClientToServerEvents> = io(
  process.env["ATRI_TOOL_IPC_SERVER_CLIENT"] as string,
  { autoConnect: false, auth }
);

fetch("/api/project-info")
  .then((resp) => resp.json())
  .then((resp) => {
    const projectId = resp["projectId"];
    if (projectId) {
      auth.projectId = projectId;
      socket.connect();
      ipcSocket.connect();
    }
  })
  .catch((err) => console.log("Error in fetching /project-info", err));

function getMeta(forestPkgId: string, onData: (meta: any) => void) {
  socket.emit("getMeta", forestPkgId, onData);
}

function getPages(
  forestPkgId: string,
  onData: (pages: { [pageId: string]: PageDetails }) => void
) {
  socket.emit("getPages", forestPkgId, onData);
}

function createFolder(
  forestPkgId: string,
  folder: Folder,
  callback: (success: boolean) => void
) {
  socket.emit("createFolder", forestPkgId, folder, callback);
}

function updateFolder(
  forestPkgId: string,
  id: string,
  update: Partial<Omit<Folder, "id">>,
  callback: (success: boolean) => void
) {
  socket.emit("updateFolder", forestPkgId, id, update, callback);
}

function createPage(
  forestPkgId: string,
  page: Page,
  callback: (success: boolean) => void
) {
  socket.emit("createPage", forestPkgId, page, callback);
}

function updatePage(
  forestPkgId: string,
  id: string,
  update: Partial<Omit<Page, "id">>,
  callback: (success: boolean) => void
) {
  socket.emit("updatePage", forestPkgId, id, update, callback);
}

function deletePage(
  forestPkgId: string,
  id: string,
  callback: (success: boolean) => void
) {
  socket.emit("deletePage", forestPkgId, id, callback);
}

function deleteFolder(
  forestPkgId: string,
  id: string,
  callback: (success: boolean) => void
) {
  socket.emit("deleteFolder", forestPkgId, id, callback);
}

async function fetchEvents(forestPkgId: string, pageId: string) {
  return new Promise<AnyEvent[]>((res) => {
    socket.emit("fetchEvents", forestPkgId, pageId, (events) => {
      res(events);
    });
  });
}

function postNewEvent(
  forestPkgId: string,
  pageId: string,
  event: AnyEvent,
  callback: (success: boolean) => void
) {
  socket.emit("postNewEvent", forestPkgId, pageId, event, callback);
}

function getNewAlias(
  forestPkgId: string,
  prefix: string,
  callback: (alias: string) => void
) {
  socket.emit("getNewAlias", forestPkgId, prefix, callback);
}

type EventSubscriber = (
  forestPkgId: string,
  pageId: string,
  event: AnyEvent
) => void;
const eventSubscribers: EventSubscriber[] = [];
function subscribeEvents(cb: EventSubscriber) {
  eventSubscribers.push(cb);
  return () => {
    const index = eventSubscribers.findIndex((curr) => curr === cb);
    if (index >= 0) {
      eventSubscribers.splice(index, 1);
    }
  };
}
const externalEventSubscribers: EventSubscriber[] = [];
function subscribeExternalEvents(cb: EventSubscriber) {
  externalEventSubscribers.push(cb);
  return () => {
    const index = externalEventSubscribers.findIndex((curr) => curr === cb);
    if (index >= 0) {
      externalEventSubscribers.splice(index, 1);
    }
  };
}
const ownEventSubscribers: EventSubscriber[] = [];
function subscribeOwnEvents(cb: EventSubscriber) {
  ownEventSubscribers.push(cb);
  return () => {
    const index = ownEventSubscribers.findIndex((curr) => curr === cb);
    if (index >= 0) {
      ownEventSubscribers.splice(index, 1);
    }
  };
}
socket.on("newEvent", (forestPkgId, pageId, event, socketId) => {
  eventSubscribers.forEach((cb) => cb(forestPkgId, pageId, event));
  if (socketId !== socket.id) {
    externalEventSubscribers.forEach((cb) => cb(forestPkgId, pageId, event));
  }
  if (socketId === socket.id) {
    ownEventSubscribers.forEach((cb) => cb(forestPkgId, pageId, event));
  }
});

const uploadAssets: BrowserClient["uploadAssets"] = (files, cb) => {
  socket.emit("uploadAssets", files, (success, url) => {
    cb(success, url);
  });
};

const getAssetsInfo: BrowserClient["getAssetsInfo"] = (cb) => {
  socket.emit("getAssetsInfo", (assets) => {
    cb(assets);
  });
};

const getTemplateList: BrowserClient["getTemplateList"] = (cb) => {
  socket.emit("getTemplateList", cb);
};

const createTemplate: BrowserClient["createTemplate"] = (
  relativeDir,
  name,
  events,
  cb
) => {
  socket.emit("createTemplate", relativeDir, name, events, cb);
};

const overwriteTemplate: BrowserClient["overwriteTemplate"] = (
  relativeDir,
  name,
  events,
  cb
) => {
  socket.emit("overwriteTemplate", relativeDir, name, events, cb);
};

const deleteTemplate: BrowserClient["deleteTemplate"] = (
  relativeDir,
  name,
  cb
) => {
  socket.emit("deleteTemplate", relativeDir, name, cb);
};

const getTemplateEvents: BrowserClient["getTemplateEvents"] = (
  relativeDir,
  name,
  cb
) => {
  socket.emit("getTemplateEvents", relativeDir, name, cb);
};

const importResource: BrowserClient["importResource"] = (
  importStatement,
  cb
) => {
  socket.emit("importResource", importStatement, cb);
};

const getResources: BrowserClient["getResources"] = (cb) => {
  socket.emit("getResources", cb);
};

const subscribeResourceUpdates: BrowserClient["subscribeResourceUpdates"] = (
  cb
) => {
  socket.on("newResource", cb);
};

const getSocket: BrowserClient["getSocket"] = () => {
  return socket;
};

const getIPCSocket: BrowserClient["getSocket"] = () => {
  return ipcSocket;
};

ipcSocket.on("connect", () => {
  ipcSocket.emit("registerAs", "browser", () => {});
});

const getAttachedServicesStatus: BrowserClient["getAttachedServicesStatus"] = (
  cb
) => {
  ipcSocket.emit("getAttachedServicesStatus", (status) => {
    cb(status);
  });
};

const subscribeServiceStatus: BrowserClient["subscribeServiceStatus"] = (
  cb
) => {
  ipcSocket.on("attachedServiceStatusChanged", cb);
  return () => {
    ipcSocket.off("attachedServiceStatusChanged", cb);
  };
};

const client: BrowserClient = {
  getSocket,
  getIPCSocket,
  getMeta,
  getPages,
  createFolder,
  updateFolder,
  createPage,
  updatePage,
  deletePage,
  deleteFolder,
  fetchEvents,
  postNewEvent,
  subscribeEvents,
  subscribeExternalEvents,
  subscribeOwnEvents,
  getNewAlias,
  uploadAssets,
  getAssetsInfo,
  getTemplateList,
  createTemplate,
  overwriteTemplate,
  deleteTemplate,
  getTemplateEvents,
  importResource,
  getResources,
  subscribeResourceUpdates,
  getAttachedServicesStatus,
  subscribeServiceStatus,
};

export default client;
