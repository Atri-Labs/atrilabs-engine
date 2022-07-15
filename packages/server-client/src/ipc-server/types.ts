import { Socket } from "socket.io";

export type ClientName = "atri-cli" | "publish-server";

export interface ServerToClientEvents {
  doComputeInitialState: (
    route: string,
    pageState: string,
    callback: (success: boolean, computedState: string) => void
  ) => void;
  doBuildPython: (callback: (success: boolean) => void) => void;
  doStartPythonServer: (callback: (success: boolean) => void) => void;
  doReloadPage: () => void;
}

export interface ClientToServerEvents {
  registerAs: (
    clientName: ClientName,
    callback: (success: boolean) => void
  ) => void;
  computeInitialState: (
    route: string,
    pageState: string,
    callback: (success: boolean, computedState: string) => void
  ) => void;
  buildPython: (callback: (success: boolean) => void) => void;
  startPythonServer: (callback: (success: boolean) => void) => void;
  reloadPage: () => void;
}

export interface InterServerEvents {}

export interface SocketData {}

export type ClientSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
