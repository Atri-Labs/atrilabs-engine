import type { FC } from "react";

export type ComponentCoordsWM = {
  top: number;
  left: number;
  width: number;
  height: number;
  topWM: number;
  leftWM: number;
  rightWM: number;
  bottomWM: number;
};

export type PropsSelector = string[];

export type ControlledCallback = {
  type: "controlled";
  selector: PropsSelector;
};

export type FileInputCallback = {
  type: "file_input";
  selector: PropsSelector;
};

export type DoNothingCallback = {
  type: "do_nothing";
};

/**
 * Callback defines the behavior of a callback with the App's state store.
 */
export type Callback =
  | ControlledCallback
  | FileInputCallback
  | DoNothingCallback;

export type SendFileCallbackHandler = (
  | { self: boolean }
  | { alias: string }
) & { props: string[] };

export type SendEventCallbackHandler = boolean;

export type NavigationCallbackHandler = {
  /**
   * Internal navigation if navigation locally in the browser in Single Page Applications.
   * External vavaigation if navigating to an url outside the SPA.
   * The url field for internal should be /path/to/other/page.
   * The url field for external should be of format protocol://domain[?..][#/../]
   */
  type: "internal" | "external";
  url: string;
  target?: "_blank" | "_self";
};

/**
 * CallbackHandler defines behavior with the backend whenever a callback is fired.
 * CallbackHandlers must be serializable because it is store in CallbackHandlerTree.
 */
export type CallbackHandler = (
  | {
      sendFile: SendFileCallbackHandler;
    }
  | { sendEventData: SendEventCallbackHandler }
  | { navigate: NavigationCallbackHandler }
)[];

export type AcceptsChildFunction = (info: {
  coords: ComponentCoordsWM;
  childCoordinates: ComponentCoordsWM[];
  loc: { pageX: number; pageY: number };
  props: any;
}) => number;

export type IoProp = {
  mode: "upload" | "download" | "duplex";
  type: "files" | "stream";
};

// An utility type to easily write type for props passed to a manifest component
export type IoType<T extends IoProp> = T["type"] extends "files"
  ? FileList
  : T["type"] extends "stream"
  ? Blob
  : never;

export type ReactComponentManifestSchema = {
  meta: { key: string; category: string };
  render: {
    comp: FC<any>;
  };
  dev: {
    comp?: FC<any>;
    decorators: FC<any>[];
    attachProps: {
      [key: string]: {
        treeId: string;
        initialValue: any;
        treeOptions: any;
        canvasOptions: { groupByBreakpoint: boolean };
      };
    };
    attachCallbacks: { [key: string]: Callback[] };
    acceptsChild?: AcceptsChildFunction;
    /*
     * By default components won't have callback handlers. The component creator
     * can define some default handlers for a component.
     */
    defaultCallbackHandlers: {
      [callbackName: string]: CallbackHandler;
    };
    ioProps?: {
      [propName: string]: { [key: string]: IoProp };
    };
  };
};
