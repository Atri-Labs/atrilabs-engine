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

/**
 * controlled - This callback type will update the props on client side.
 *              The signature is (oldProps, changeEvent) => (newProps).
 * event      - This callback type will send an event to the backend.
 *              The signature is (eventname, eventdata) => (void).
 * upload     - This callback type will update the form data on client side.
 *              This is primarily used to upload files.
 *              The signature is (file handler | file handlers) => (void).
 *
 * // By default components won't have action handlers. The component creator
 * can define some default action for a component.
 * defaultActionHandler: {
 *  [action]: [{sendFile: props.file}, {sendData: props.data}]
 * }
 */
export type CallbackType = "controlled" | "event" | "upload";

export type AcceptsChildFunction = (info: {
  coords: ComponentCoordsWM;
  childCoordinates: ComponentCoordsWM[];
  loc: { pageX: number; pageY: number };
  props: any;
}) => number;

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
    attachCallbacks: { [key: string]: { types: CallbackType[] } };
    acceptsChild?: AcceptsChildFunction;
  };
};
