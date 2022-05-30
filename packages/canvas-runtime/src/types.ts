import React from "react";

export type Breakpoint = { min: number; max: number };

export type DragComp = { comp: React.FC; props: any };

export type DragData =
  | {
      type: "component";
      data: { pkg: string; key: string; manifestSchema: string };
    }
  | { type: "src"; data: { src: string } };

export type StartDragArgs = {
  dragComp: DragComp;
  dragData: DragData;
};

export type Location = { pageX: number; pageY: number };

/**
 * Catcher function associated with a component should return true
 * if the component can handle the canvas activity (drag or drop etc.)
 */
export type Catcher = (dragData: DragData, loc: Location) => boolean;

export type CanvasComponent = {
  id: string;
  ref: React.RefObject<any>;
  comp: React.FC<any>;
  props: any;
  parent: { id: string; index: number };
  decorators: React.FC<any>[];
  catchers: Catcher[];
  acceptsChild: boolean;
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
