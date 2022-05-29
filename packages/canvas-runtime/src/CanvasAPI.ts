import React from "react";
import { canvasComponentStore } from "./CanvasComponentData";
import { Catcher } from "./types";

export const createComponent = (
  id: string,
  comp: React.FC,
  props: any,
  parent: { id: string; index: number },
  decorators: React.FC<any>[],
  catchers: Catcher[]
) => {
  const ref = React.createRef();
  canvasComponentStore[id] = {
    id,
    ref,
    comp,
    props,
    parent,
    decorators,
    catchers,
  };
};
