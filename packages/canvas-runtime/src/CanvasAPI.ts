import React from "react";
import {
  canvasComponentStore,
  callCanvasUpdateSubscribers,
  canvasComponentTree,
} from "./CanvasComponentData";
import { Catcher } from "./types";

export const createComponent = (
  id: string,
  comp: React.FC,
  props: any,
  parent: { id: string; index: number },
  decorators: React.FC<any>[],
  catchers: Catcher[],
  acceptsChild: boolean
) => {
  const ref = React.createRef();
  // update component store
  canvasComponentStore[id] = {
    id,
    ref,
    comp,
    props,
    parent,
    decorators,
    catchers,
    acceptsChild,
  };
  // update component tree
  if (canvasComponentTree[parent.id]) {
    const index = canvasComponentTree[parent.id].findIndex((curr) => {
      const currComp = canvasComponentStore[curr]!;
      if (currComp.parent.index >= parent.index) {
        return true;
      }
      return false;
    });
    if (index >= 0) {
      canvasComponentTree[parent.id].splice(index, 0, id);
    } else {
      canvasComponentTree[parent.id].push(id);
    }
  } else {
    canvasComponentTree[parent.id] = [id];
  }
  // call internal subscribers of the event
  callCanvasUpdateSubscribers(parent.id);
};

/**
 * clearCanvas is expected to be called when currentForest changes
 */
export function clearCanvas() {
  const storeKeys = Object.keys(canvasComponentStore);
  // delete everything apart from body
  storeKeys.forEach((storeKey) => {
    if (storeKey !== "body") delete canvasComponentStore[storeKey];
  });
  const treeKeys = Object.keys(canvasComponentTree);
  treeKeys.forEach((treeKey) => {
    delete canvasComponentTree[treeKey];
  });
  // only call body subscribers
  callCanvasUpdateSubscribers("body");
}
