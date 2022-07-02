import { canvasComponentTree } from "./CanvasComponentData";
import {
  CanvasComponent,
  CanvasComponentStore,
  CanvasComponentTree,
  CatcherData,
  Location,
} from "./types";

export type ComponentCoords = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ComponentCoordsWM = {
  top: number;
  left: number;
  width: number;
  height: number;
  topWM: number;
  rightWM: number;
  bottomWM: number;
  leftWM: number;
};

export function getCoords(elem: HTMLElement): ComponentCoords {
  // crossbrowser version
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return { top: top, left: left, width: box.width, height: box.height };
}

export function getCSSBoxCoords(elem: Element): ComponentCoordsWM {
  // crossbrowser version
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  var topWM = top - parseFloat(window.getComputedStyle(elem).marginTop);
  var leftWM = left - parseFloat(window.getComputedStyle(elem).marginLeft);
  var bottomWM =
    top + box.height + parseFloat(window.getComputedStyle(elem).marginBottom);
  var rightWM =
    left + box.width + parseFloat(window.getComputedStyle(elem).marginRight);

  return {
    top: top,
    left: left,
    width: box.width,
    height: box.height,
    topWM,
    leftWM,
    rightWM,
    bottomWM,
  };
}

export function isInsideBox(loc: Location, box: ComponentCoords): boolean {
  if (
    box.left <= loc.pageX &&
    box.left + box.width >= loc.pageX &&
    box.top <= loc.pageY &&
    box.top + box.height >= loc.pageY
  ) {
    return true;
  }
  return false;
}

export function isInsideCSSBox(
  loc: { pageX: number; pageY: number },
  coord: ComponentCoordsWM
) {
  if (
    coord.topWM <= loc.pageY &&
    coord.bottomWM >= loc.pageY &&
    coord.leftWM <= loc.pageX &&
    coord.rightWM >= loc.pageX
  ) {
    return true;
  }
  return false;
}

export function horizontalClose(
  loc: { pageX: number; pageY: number },
  coord: ComponentCoordsWM
) {
  return loc.pageX - coord.leftWM < coord.rightWM - loc.pageX
    ? "left"
    : "right";
}

export function verticalClose(
  loc: { pageX: number; pageY: number },
  coord: ComponentCoordsWM
) {
  return loc.pageY - coord.topWM < coord.bottomWM - loc.pageY
    ? "top"
    : "bottom";
}

// A region that is delta pixels inside the box is considered marginal region.
// We are assuming that this function is being run after it has been estbalished that
// the mouse is inside the box using isInsideBox.
export function inMarginalRegion(loc: Location, box: ComponentCoords): boolean {
  let delta = 4;
  if (box.left + delta >= loc.pageX && box.left <= loc.pageX) {
    return true;
  }
  if (
    box.left + box.width - delta <= loc.pageX &&
    box.left + box.width >= loc.pageX
  ) {
    return true;
  }
  if (box.top + delta >= loc.pageY && box.top <= loc.pageY) {
    return true;
  }
  if (
    box.top + box.height - delta <= loc.pageY &&
    box.top + box.height >= loc.pageY
  ) {
    return true;
  }
  return false;
}

export function _triangulate(
  currId: string,
  tree: CanvasComponentTree,
  store: CanvasComponentStore,
  loc: Location
): string | null {
  let resultId: string | null = null;
  if (store[currId]) {
    // get coords of current component
    const currComp = store[currId];
    if (currComp.ref.current) {
      const element = currComp.ref.current;
      const coords = getCoords(element);
      // check if mouse pointer is inside
      const isInsideBoxRes = isInsideBox(loc, coords);
      if (isInsideBoxRes) {
        // store result in resultId
        resultId = currId;
        // If current component location (parent) +/- 4 <= mouse location
        // then don't loop over children, thus, considering current component
        // as the catcher.
        if (inMarginalRegion(loc, coords)) {
          return resultId;
        }
        const children = tree[currId];
        if (children) {
          // Loop over all it's child.
          // It might happen that mouse is inside parent but not inside any of it's child
          // hence, check if result from child is not null before assigning it to result.
          // We can safely assume that the pointer can be inside one child only,
          // hence, we can break out loop once a child returns non-null result.
          for (let i = 0; i < children.length; i++) {
            const childId = children[i]!;
            const childResultId = _triangulate(childId, tree, store, loc);
            if (childResultId) {
              resultId = childResultId;
              break;
            }
          }
        }
      }
    } else {
      console.error(
        `Unexpected: component ref.current is null during triangulation.`
      );
      return null;
    }
  }
  return resultId;
}

export function triangulate(
  tree: CanvasComponentTree,
  store: CanvasComponentStore,
  loc: Location
) {
  let currId = "body";
  return _triangulate(currId, tree, store, loc);
}

export function bubbleUp(
  canvasComp: CanvasComponent,
  catcherData: CatcherData,
  loc: Location,
  canvasComponentStore: CanvasComponentStore
): CanvasComponent | null {
  // run a match against all catcher
  const catchers = canvasComp.catchers;
  for (let i = 0; i < catchers.length; i++) {
    const catcher = catchers[i]!;
    const isCaught = catcher(catcherData, loc);
    if (isCaught) {
      return canvasComp;
    }
  }
  // can't bubble up beyond body
  if (canvasComp.id === "body") {
    return null;
  }
  // bubble up to parent
  const parentId = canvasComp.parent.id;
  const parentCanvasComp = canvasComponentStore[parentId];
  return bubbleUp(parentCanvasComp, catcherData, loc, canvasComponentStore);
}

export function findCatcher(
  tree: CanvasComponentTree,
  store: CanvasComponentStore,
  catcherData: CatcherData,
  loc: Location
) {
  const triangulatedBy = triangulate(tree, store, loc);
  if (triangulatedBy) {
    const triangulatedByComp = store[triangulatedBy]!;
    const caughtBy = bubbleUp(triangulatedByComp, catcherData, loc, store);
    return caughtBy;
  }
  return null;
}

export function getAllDescendants(compId: string): string[] {
  const descendants: string[] = [];
  if (canvasComponentTree[compId]) {
    descendants.push(...canvasComponentTree[compId]);
    let curr = 0;
    while (curr < descendants.length) {
      const currId = descendants[curr];
      if (canvasComponentTree[currId]) {
        descendants.push(...canvasComponentTree[currId]);
      }
      curr++;
    }
  }
  return descendants;
}

export function dudCallback() {}
