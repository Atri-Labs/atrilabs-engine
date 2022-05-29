import {
  CanvasComponent,
  CanvasComponentStore,
  CanvasComponentTree,
  DragData,
  Location,
} from "./types";

type ElementCoords = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function getCoords(elem: HTMLElement): ElementCoords {
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

function insideBox(loc: Location, coords: ElementCoords): boolean {
  if (
    coords.left >= loc.pageX &&
    coords.left + coords.width <= loc.pageX &&
    coords.top >= loc.pageY &&
    coords.top + coords.height <= loc.pageY
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
      const isInsideBox = insideBox(loc, coords);
      if (isInsideBox) {
        // store result in resultId
        resultId = currId;
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
  dragData: DragData,
  loc: Location,
  canvasComponentStore: CanvasComponentStore
): CanvasComponent | null {
  // run a match against all catcher
  const catchers = canvasComp.catchers;
  for (let i = 0; i < catchers.length; i++) {
    const catcher = catchers[i]!;
    const isCaught = catcher(dragData, loc);
    if (isCaught) {
      return canvasComp;
    }
  }
  // can't bubble up beryon body
  if (canvasComp.id === "body") {
    return null;
  }
  // bubble up to parent
  const parentId = canvasComp.parent.id;
  const parentCanvasComp = canvasComponentStore[parentId];
  return bubbleUp(parentCanvasComp, dragData, loc, canvasComponentStore);
}
