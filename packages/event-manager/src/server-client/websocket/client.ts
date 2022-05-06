import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  Folder,
  Page,
  ServerToClientEvents,
} from "./types";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

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

export function createFolder(
  folder: Folder,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("createFolder", folder, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export function updateFolder(
  id: string,
  update: Partial<Omit<Folder, "id">>,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("updateFolder", id, update, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export function createPage(
  page: Page,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("createPage", page, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}

export function updatePage(
  id: string,
  update: Partial<Omit<Page, "id">>,
  onSuccess: () => void,
  onFailure: () => void
) {
  socket.emit("updatePage", id, update, (success) => {
    handleSuccess(success, onSuccess, onFailure);
  });
}
