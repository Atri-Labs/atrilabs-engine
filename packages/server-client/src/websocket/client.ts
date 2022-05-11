import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  Folder,
  Page,
  ServerToClientEvents,
} from "./types";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:4001"
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
