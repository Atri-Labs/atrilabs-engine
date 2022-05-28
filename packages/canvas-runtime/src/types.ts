import React from "react";

export type Breakpoint = { min: number; max: number };

export type CanvasComponentStore = {
  [compId: string]: {
    id: string;
    ref: React.RefObject<any>;
    comp: React.FC;
    props: any;
    parent: { id: string; index: number };
    decorators: React.FC<any>[];
  };
};
