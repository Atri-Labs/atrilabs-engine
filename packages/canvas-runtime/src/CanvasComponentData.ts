import { BodyComponent } from "./body/BodyComponent";
import { bodyCatchers } from "./body/bodyCatchers";
import { bodyDecorators } from "./body/bodyDecorators";
import { CanvasComponentStore, CanvasComponentTree } from "./types";
import { bodyRef } from "./body/bodyRef";

/**
 * There are two important internal data structure for Canvas -
 * CanvasComponentStore & CanvasComponentTree.
 * CanvasComponentTree is used to quickly access a child inside a parent.
 * ComponentStore actually stores the details about a component.
 */

export const canvasComponentStore: CanvasComponentStore = {
  body: {
    id: "body",
    comp: BodyComponent,
    props: { children: [] },
    ref: bodyRef,
    parent: { id: "", index: 0 },
    decorators: bodyDecorators,
    catchers: bodyCatchers,
    acceptsChild: true,
    callbacks: {},
  },
};

export const canvasComponentTree: CanvasComponentTree = {};

/**
 * When a new component is added, the parent is informed.
 * When a prop changes for a component, the component is informed.
 */
const canvasUpdateSubscribers: { [compId: string]: (() => void)[] } = {};

export function callCanvasUpdateSubscribers(compId: string) {
  if (canvasUpdateSubscribers[compId]) {
    canvasUpdateSubscribers[compId].forEach((cb) => {
      cb();
    });
  }
}

export function subscribeCanvasUpdate(compId: string, cb: () => void) {
  if (canvasUpdateSubscribers[compId]) {
    canvasUpdateSubscribers[compId].push(cb);
  } else {
    canvasUpdateSubscribers[compId] = [cb];
  }
  return () => {
    const index = canvasUpdateSubscribers[compId].findIndex(
      (curr) => curr === cb
    );
    if (index >= 0) {
      canvasUpdateSubscribers[compId].splice(index, 1);
    }
  };
}

const canvasComponentRenderedSubscribers: ((
  compId: string,
  updateNum: number
) => void)[] = [];
export function subscribeOnComponentRendered(
  cb: (compId: string, updateNum: number) => void
) {
  canvasComponentRenderedSubscribers.push(cb);
  return () => {
    const index = canvasComponentRenderedSubscribers.findIndex(
      (curr) => curr === cb
    );
    if (index >= 0) {
      canvasComponentRenderedSubscribers.splice(index, 1);
    }
  };
}
export function callCanvasComponentRenderedSubscribers(
  compId: string,
  updateNum: number
) {
  canvasComponentRenderedSubscribers.forEach((cb) => cb(compId, updateNum));
}
