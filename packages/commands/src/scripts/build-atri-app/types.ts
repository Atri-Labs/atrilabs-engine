import type {
  Callback,
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
      [key: string]: Callback[];
    };
    meta: any;
    alias: string;
  }[];
};

export type ComponentManifests = {
  [pkg: string]: {
    [key: string]: ReactComponentManifestSchema;
  };
};
