import { Socket } from "socket.io";

export type ClientName = "atri-cli" | "publish-server";

export interface ServerToClientEvents {
  doComputeInitialState: (
    route: string,
    pageState: string,
    callback: (success: boolean, computedState: string) => void
  ) => void;
  doStartPythonServer: () => void;
  doReloadPage: () => void;
}

export interface ClientToServerEvents {
  registerAs: (clientName: ClientName) => void;
  computeInitialState: (
    route: string,
    pageState: string,
    callback: (success: boolean, computedState: string) => void
  ) => void;
  startPythonServer: () => void;
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
