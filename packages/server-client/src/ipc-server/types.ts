export interface ServerToClientEvents {
  doComputeInitialState: (callback: (computedState: string) => void) => void;
  doStartPythonServer: () => void;
  doReloadPage: () => void;
}

export interface ClientToServerEvents {
  computeInitialState: (callback: (computedState: string) => void) => void;
  startPythonServer: () => void;
  reloadPage: () => void;
}

export interface InterServerEvents {}

export interface SocketData {}
