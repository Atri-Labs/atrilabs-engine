import React from "react";
import {
  canvasComponentStore,
  callCanvasUpdateSubscribers,
  canvasComponentTree,
} from "./CanvasComponentData";
import {
  CanvasActivityDecorator,
  emitClearCanvasEvent,
  sendDeleteComponent,
} from "./decorators/CanvasActivityDecorator";
import { UnlockCanvasActivityMachineDecorator } from "./decorators/UnlockCanvasActivityMachineDecorator";
import { MutationDecorator } from "./DefaultDecorators";
import { Catcher, Location } from "./types";
import { ComponentCoords, getAllDescendants, getCSSBoxCoords } from "./utils";
export type { ComponentCoords, ComponentCoordsWM } from "./utils";
export {
  getCSSBoxCoords,
  isInsideCSSBox,
  horizontalClose,
  verticalClose,
} from "./utils";

export const createComponent = (
  id: string,
  comp: React.FC,
  props: any,
  parent: { id: string; index: number },
  decorators: React.FC<any>[],
  catchers: Catcher[],
  acceptsChild: boolean,
  callbacks: { [callbackName: string]: any }
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
    props: JSON.parse(JSON.stringify(props)),
    parent: { ...parent },
    decorators: [...decorators],
    catchers: [...catchers],
    acceptsChild,
    callbacks,
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
  return canvasComponentStore[compId]
    ? { ...canvasComponentStore[compId].props }
    : {};
}

export function updateComponentProps(compId: string, props: any) {
  if (canvasComponentStore[compId] === undefined) return;
  canvasComponentStore[compId].props = props;
  callCanvasUpdateSubscribers(compId);
}

export function getComponentChildrenId(compId: string) {
  return canvasComponentTree[compId] ? [...canvasComponentTree[compId]] : [];
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
        const childComp = canvasComponentStore[childId].ref.current;
        if (!childComp) {
          console.error(
            `Component ref for a child ${childId} is null. Please contact Atri Labs team if you are seeing this error.`
          );
          return;
        }
        const childCoords = getCSSBoxCoords(childComp);
        const parentCoords = getCSSBoxCoords(parentComp);
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

export function getOwnCoords(compId: string) {
  if (canvasComponentStore[compId]) {
    const comp = canvasComponentStore[compId].ref.current;
    if (comp) {
      return getCSSBoxCoords(comp);
    } else {
      console.error(
        "Component Ref should have been defined. Please report this error to Atri Labs team."
      );
    }
  }
}

// Get location relative to a component
// This function is expected to be used to calculate relative mouse position
// inside a component
export function getRelativeLocation(
  compId: string,
  loc: Location
): Pick<ComponentCoords, "top" | "left"> | undefined {
  const coords = getOwnCoords(compId);
  if (coords) {
    const left = loc.pageX - coords.left;
    const top = loc.pageY - coords.top;
    return { top, left };
  }
}

export function updateComponentParent(
  compId: string,
  newParent: { id: string; index: number }
) {
  // it might happen that oldParent isn't created on fresh load of page
  if (!canvasComponentStore[compId]) {
    return;
  }
  const oldParent = canvasComponentStore[compId].parent;
  // TODO: update component tree
  if (canvasComponentTree[oldParent.id]) {
    const index = canvasComponentTree[oldParent.id].findIndex(
      (curr) => curr === compId
    );
    if (index >= 0) {
      canvasComponentTree[oldParent.id].splice(index, 1);
    }
  } else {
    canvasComponentTree[oldParent.id] = [];
  }

  if (canvasComponentTree[newParent.id]) {
    const index = canvasComponentTree[newParent.id].findIndex((curr) => {
      const currComp = canvasComponentStore[curr]!;
      if (currComp.parent.index >= newParent.index) {
        return true;
      }
      return false;
    });
    if (index >= 0) {
      canvasComponentTree[newParent.id].splice(index, 0, compId);
    } else {
      canvasComponentTree[newParent.id].push(compId);
    }
  } else {
    canvasComponentTree[newParent.id] = [compId];
  }
  canvasComponentStore[compId].parent = { ...newParent };
  callCanvasUpdateSubscribers(oldParent.id);
  callCanvasUpdateSubscribers(newParent.id);
}

export function deleteComponent(compId: string) {
  // can't delete body
  if (compId === "body") {
    return;
  }
  const component = canvasComponentStore[compId];
  if (component) {
    const parentId = component.parent.id;
    // delete recursively all child
    const descendants = getAllDescendants(compId);
    if (descendants) {
      descendants.forEach((descendantId) => {
        delete canvasComponentStore[descendantId];
        delete canvasComponentTree[descendantId];
      });
    }
    // delete itself from parent component tree
    const index = canvasComponentTree[parentId].findIndex((curr) => {
      return curr === compId;
    });
    if (index >= 0) {
      canvasComponentTree[parentId].splice(index, 1);
    }
    // inform parent
    callCanvasUpdateSubscribers(parentId);
    // inform canvas activity machine
    sendDeleteComponent(compId);
  }
}

export function getComponentParent(compId: string) {
  return { ...canvasComponentStore[compId].parent };
}

export { addStylesheet } from "./resources/stylesheet";

export {
  subscribe as subscribeCanvasActivity,
  getCurrentState,
  getCurrentMachineContext,
  raiseSelectEvent,
  raiseHoverEvent,
} from "./decorators/CanvasActivityDecorator";

export type { CanvasActivityContext } from "./decorators/CanvasActivityDecorator";

export {
  addOrModifyHintOverlays,
  removeHintOverlays,
} from "./hooks/useHintOverlays";

export {
  subscribeNewDropRendered,
  subscribeComponentRender,
} from "./decorators/UnlockCanvasActivityMachineDecorator";
