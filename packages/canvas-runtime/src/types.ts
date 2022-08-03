import React from "react";

export type Breakpoint = { min: number; max: number };

export type Dimension = {
  width: string;
  scale: number;
};

export type DragComp = { comp: React.FC<any>; props: any };

export type DragData =
  | {
      type: "component";
      data: { pkg: string; key: string; manifestSchema: string; id: string };
    }
  | { type: "src"; data: { src: string } }
  | {
      type: "template";
      data: { dir: string; name: string; newTemplateRootId: string };
    };

export type StartDragArgs = {
  dragComp: DragComp;
  dragData: DragData;
};

export type Location = { pageX: number; pageY: number };

export type ReDragData = {
  type: "redrop";
  data: {
    // component being dragged
    compId: string;
  };
};

/**
 * Catchers are invoked at two occasions, when a new component drop is in progress
 * and the other ocassion is when an existing component's re-parenting is in progress.
 */
export type CatcherData = DragData | ReDragData;

/**
 * Catcher function associated with a component should return true
 * if the component can handle the canvas activity (drag or drop etc.)
 */
export type Catcher = (catcherData: CatcherData, loc: Location) => boolean;

export type CanvasComponent = {
  id: string;
  ref: React.RefObject<HTMLElement>;
  comp: React.FC<any>;
  props: any;
  parent: { id: string; index: number };
  decorators: React.FC<any>[];
  catchers: Catcher[];
  acceptsChild: boolean;
  callbacks: { [callbackName: string]: any };
};

export type CanvasComponentStore = {
  [compId: string]: CanvasComponent;
};

/**
 * A map of parentId to childId
 */
export type CanvasComponentTree = {
  [parentId: string]: string[];
};

export type Position = { top: number; left: number };

export type BoxDimension = {
  // border and padding included
  width: number;
  // border and padding included
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
};
