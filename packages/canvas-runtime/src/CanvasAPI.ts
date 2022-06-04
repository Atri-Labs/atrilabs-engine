import React from "react";
import {
  canvasComponentStore,
  callCanvasUpdateSubscribers,
  canvasComponentTree,
} from "./CanvasComponentData";
import {
  CanvasActivityDecorator,
  emitClearCanvasEvent,
} from "./decorators/CanvasActivityDecorator";
import { UnlockCanvasActivityMachineDecorator } from "./decorators/UnlockCanvasActivityMachineDecorator";
import { MutationDecorator } from "./DefaultDecorators";
import { Catcher } from "./types";
import { getCoords, ComponentCoords } from "./utils";

export const createComponent = (
  id: string,
  comp: React.FC,
  props: any,
  parent: { id: string; index: number },
  decorators: React.FC<any>[],
  catchers: Catcher[],
  acceptsChild: boolean
) => {
  const ref = React.createRef<HTMLElement>();
  // prepend default decorators
  // ComponentRenderer listens for changes in components that accept child,
  // hence, we add MutationDecorator to components who do not accept child only.
  if (!acceptsChild) {
    decorators.unshift(MutationDecorator);
  }

  decorators.push(
    CanvasActivityDecorator,
    UnlockCanvasActivityMachineDecorator
  );
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
  // Notice how we don't check whether the parent node exists. This is because,
  // the canvas-runtime is built with assumption that children node can be stored before
  // the parent node. For example, ComponentRenderer has a useEffect that checks if
  // children are already present in the component tree upon first render.
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
  console.log("clearCanvas called", { ...canvasComponentStore });
  const storeKeys = Object.keys(canvasComponentStore);
  // delete everything apart from body
  storeKeys.forEach((storeKey) => {
    if (storeKey !== "body") delete canvasComponentStore[storeKey];
  });
  const treeKeys = Object.keys(canvasComponentTree);
  treeKeys.forEach((treeKey) => {
    delete canvasComponentTree[treeKey];
  });
  // set canvas activity machine back to idle
  emitClearCanvasEvent();
  // only call body subscribers
  callCanvasUpdateSubscribers("body");
}

(window as any)["canvasStore"] = canvasComponentStore;

export function getComponentProps(compId: string) {
  return { ...canvasComponentStore[compId].props };
}

export function updateComponentProps(compId: string, props: any) {
  canvasComponentStore[compId].props = props;
  callCanvasUpdateSubscribers(compId);
}

export function getComponentChildrenId(compId: string) {
  return [...canvasComponentTree[compId]];
}

export function getComponentRef(compId: string) {
  return canvasComponentStore[compId].ref;
}

export function getRelativeChildrenCoords(compId: string): ComponentCoords[] {
  const coords: ComponentCoords[] = [];
  if (canvasComponentStore[compId]) {
    const parentComp = canvasComponentStore[compId].ref.current;
    if (!parentComp) {
      console.error(
        `Component ref of parent ${compId} is null. Please contact Atri Labs team if you are seeing this error.`
      );
      return coords;
    }
    const childIds = canvasComponentTree[compId];
    if (childIds) {
      childIds.forEach((childId) => {
        const childComp = canvasComponentStore[compId].ref.current;
        if (!childComp) {
          console.error(
            `Component ref for a child ${childId} is null. Please contact Atri Labs team if you are seeing this error.`
          );
          return;
        }
        const childCoords = getCoords(childComp);
        const parentCoords = getCoords(parentComp);
        const relativeCoords: ComponentCoords = {
          top: childCoords.top - parentCoords.top,
          left: childCoords.left - parentCoords.left,
          width: childCoords.width,
          height: childCoords.height,
        };
        coords.push(relativeCoords);
      });
    } else {
      return coords;
    }
  }
  return coords;
}

export function updateComponentParent(
  compId: string,
  newParent: { id: string; index: number }
) {}

export { subscribe as subscribeCanvasActivity } from "./decorators/CanvasActivityDecorator";

export {
  addOrModifyHintOverlays,
  removeHintOverlays,
} from "./hooks/useHintOverlays";

export { subscribeNewDropRendered } from "./decorators/UnlockCanvasActivityMachineDecorator";
