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
  | { compId: string }
) & { props: string[] };

export type SendEventCallbackHandler = boolean;

/**
 * CallbackHandler defines behavior with the backend whenever a callback is fired.
 * CallbackHandlers must be serializable because it is store in CallbackHandlerTree.
 */
export type CallbackHandler =
  | SendFileCallbackHandler
  | SendEventCallbackHandler;

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
  meta: { key: string };
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
      [callbackName: string]: (
        | { sendFile: SendFileCallbackHandler }
        | { sendEventData: SendEventCallbackHandler }
      )[];
    };
    ioProps?: {
      [key: string]: IoProp;
    };
  };
};
