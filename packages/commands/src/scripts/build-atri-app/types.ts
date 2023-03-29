import { ManifestIR } from "@atrilabs/core";
import type {
  Callback,
  CallbackHandler,
  ReactComponentManifestSchema,
} from "@atrilabs/react-component-manifest-schema";

export type PageInfo = {
  pagePath: string;
  routeObjectPath: string;
  eventsPath?: string;
  components: {
    id: string;
    props: {
      [key: string]: any;
    };
    parent: {
      id: string;
      index: number;
      canvasZoneId: any;
    };
    acceptsChild: boolean;
    callbacks: {
      [callbackName: string]: Callback[];
    };
    meta: any;
    alias: string;
    handlers: { [callbackName: string]: CallbackHandler };
    type: "repeating" | "parent" | "normal";
  }[];
};

export type ComponentManifests = {
  [pkg: string]: {
    [key: string]: {
      manifest: ReactComponentManifestSchema;
      paths: ManifestIR; // all the paths in this ManifestIR will be relative to package root dir
    };
  };
};
