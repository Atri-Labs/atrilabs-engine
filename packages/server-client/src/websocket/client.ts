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
