import { ManifestPkgBundle } from "@atrilabs/core";

export interface ServerToClientEvents {
  updateManifestPkg: (
    bundle: ManifestPkgBundle,
    callback: (success: boolean) => void
  ) => void;
}

export interface ClientToServerEvents {
  sendManifestScripts: (
    callback: (bundles: ManifestPkgBundle[]) => void
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
