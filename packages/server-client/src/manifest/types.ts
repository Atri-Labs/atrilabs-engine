export type Script = {
  src: string;
};

export type ManifestPkg = {
  pkg: string;
};

export interface ServerToClientEvents {
  updateManifestPkg: (
    manifest: ManifestPkg,
    script: Script,
    callback: (success: boolean) => void
  ) => void;
}

export interface ClientToServerEvents {
  sendManifestScripts: (callback: (script: Script) => void) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
