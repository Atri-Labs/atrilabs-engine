import {
  ComponentCoordsWM,
  horizontalClose,
  isInsideCSSBox,
} from "@atrilabs/canvas-runtime";
import { lrtbSort } from "./utils";

export function computeBodyChildIndex(info: {
  coords: ComponentCoordsWM;
  childCoordinates: ComponentCoordsWM[];
  loc: { pageX: number; pageY: number };
}) {
  // index will be 0 if no children already
  let index: number = 0;
  if (info.childCoordinates.length > 0) {
    const coords = info.childCoordinates;
    // scenario - inside a box
    const insideBoxIndex = coords.findIndex((coord) => {
      return isInsideCSSBox(info.loc, coord);
    });
    if (insideBoxIndex >= 0) {
      const side = horizontalClose(info.loc, coords[insideBoxIndex]);
      if (side === "left") {
        index = insideBoxIndex;
      } else {
        index = insideBoxIndex + 1;
      }
      return index;
    }
    // scenario - traverse until hit a top greater than pageY
    lrtbSort(coords);
    const nextIndex = coords.findIndex((coord) => {
      return coord.topWM >= info.loc.pageY;
    });
    if (nextIndex >= 0) {
      index = nextIndex;
    } else {
      index = coords.length;
    }
  }
  return index;
}
