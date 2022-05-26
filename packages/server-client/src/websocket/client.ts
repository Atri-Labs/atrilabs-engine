import { AnyEvent } from "@atrilabs/forest";
import { PagesDbSchema } from "@atrilabs/forest/lib/implementations/lowdb/types";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  Folder,
  Page,
  ServerToClientEvents,
} from "./types";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env["ATRI_TOOL_EVENT_SERVER_CLIENT"] as string
);

function handleSuccess(
  success: boolean,
  onSuccess: () => void,
  onFailure: () => void
) {
  if (success) {
    onSuccess();
  } else {
    onFailure();
  }
}

export function getMeta(forestPkgId: string, onData: (meta: any) => void) {
  socket.emit("getMeta", forestPkgId, onData);
}

export function getPages(
  forestPkgId: string,
  onData: (pages: PagesDbSchema) => void
) {
  socket.emit("getPages", forestPkgId, onData);
}

export function createFolder(
  forestPkgId: string,
  folder: Folder,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("createFolder", forestPkgId, folder, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export function updateFolder(
  forestPkgId: string,
  id: string,
  update: Partial<Omit<Folder, "id">>,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("updateFolder", forestPkgId, id, update, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export function createPage(
  forestPkgId: string,
  page: Page,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("createPage", forestPkgId, page, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export function updatePage(
  forestPkgId: string,
  id: string,
  update: Partial<Omit<Page, "id">>,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("updatePage", forestPkgId, id, update, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export function deletePage(
  forestPkgId: string,
  id: string,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("deletePage", forestPkgId, id, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export function deleteFolder(
  forestPkgId: string,
  id: string,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("deleteFolder", forestPkgId, id, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export async function fetchEvents(forestPkgId: string, pageId: string) {
  socket.emit("fetchEvents", forestPkgId, pageId, (events) => {
    return events;
  });
}

export function postNewEvent(
  forestPkgId: string,
  pageId: string,
  event: AnyEvent,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("postNewEvent", forestPkgId, pageId, event, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

type EventSubscriber = (
  forestPkgId: string,
  pageId: string,
  event: AnyEvent
) => void;
const eventSubscribers: EventSubscriber[] = [];
export function subscribeEvents(cb: EventSubscriber) {
  eventSubscribers.push(cb);
  return () => {
    const index = eventSubscribers.findIndex((curr) => curr === cb);
    if (index >= 0) {
      eventSubscribers.splice(index, 1);
    }
  };
}
const externalEventSubscribers: EventSubscriber[] = [];
export function subscribeExternalEvents(cb: EventSubscriber) {
  externalEventSubscribers.push(cb);
  return () => {
    const index = externalEventSubscribers.findIndex((curr) => curr === cb);
    if (index >= 0) {
      externalEventSubscribers.splice(index, 1);
    }
  };
}
const ownEventSubscribers: EventSubscriber[] = [];
export function subscribeOwnEvents(cb: EventSubscriber) {
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
