import { Socket } from "socket.io";

export type ClientName = "atri-cli" | "generator";

export interface ServerToClientEvents {
  doComputeInitialState: (
    callback: (success: boolean, computedState: string) => void
  ) => void;
  doStartPythonServer: () => void;
  doReloadPage: () => void;
}

export interface ClientToServerEvents {
  registerAs: (clientName: ClientName) => void;
  computeInitialState: (
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
