import { Socket } from "socket.io";

export type ClientName = "atri-cli" | "publish-server" | "browser";

export interface ServerToClientEvents {
  doComputeInitialState: (
    route: string,
    pageState: string,
    callback: (success: boolean, computedState: string) => void
  ) => void;
  doBuildPython: (callback: (success: boolean) => void) => void;
  doStartPythonServer: (callback: (returnCode: number) => void) => void;
  doReloadPage: () => void;
  attachedServiceStatusChanged: (status: {
    [key in Exclude<ClientName, "browser">]: boolean;
  }) => void;
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
  startPythonServer: (callback: (returnCode: number) => void) => void;
  reloadPage: () => void;
  getAttachedServicesStatus: (
    callback: (status: {
      [key in Exclude<ClientName, "browser">]: boolean;
    }) => void
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {}

export type ClientSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
