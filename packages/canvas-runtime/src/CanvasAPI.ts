import { getId } from "@atrilabs/core";
import React from "react";
import { canvasComponentStore } from "./CanvasComponentStore";

export const createComponent = (
  comp: React.FC,
  props: any,
  parent: { id: string; index: number },
  decorators: React.FC<any>[]
) => {
  const id = getId();
  const ref = React.createRef();
  canvasComponentStore[id] = { id, ref, comp, props, parent, decorators };
};
