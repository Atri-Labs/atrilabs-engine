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

export function getMeta(forestname: string, onData: (meta: any) => void) {
  socket.emit("getMeta", forestname, onData);
}

export function getPages(
  forestname: string,
  onData: (pages: PagesDbSchema) => void
) {
  socket.emit("getPages", forestname, onData);
}

export function createFolder(
  forestname: string,
  folder: Folder,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("createFolder", forestname, folder, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export function updateFolder(
  forestname: string,
  id: string,
  update: Partial<Omit<Folder, "id">>,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("updateFolder", forestname, id, update, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export function createPage(
  forestname: string,
  page: Page,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("createPage", forestname, page, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export function updatePage(
  forestname: string,
  id: string,
  update: Partial<Omit<Page, "id">>,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("updatePage", forestname, id, update, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}
