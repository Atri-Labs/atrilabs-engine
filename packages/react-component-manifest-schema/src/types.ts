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
    attachCallbacks: { [key: string]: any };
    acceptsChild?: AcceptsChildFunction;
  };
};
