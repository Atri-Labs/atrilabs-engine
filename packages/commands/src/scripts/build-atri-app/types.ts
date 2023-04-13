import type {
  Callback,
  CallbackHandler,
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
