import { ComponentCoords } from "@atrilabs/canvas-runtime";

export function computeBodyChildIndex(info: {
  coords: ComponentCoords;
  childCoordinates: ComponentCoords[];
  relativePointerLoc: Pick<ComponentCoords, "top" | "left">;
}) {
  const { childCoordinates, relativePointerLoc } = info;
  let minDist = Infinity;
  let minSide: "left" | "top" | "right" | "bottom" = "top";
  let minIndex: number = 0;
  for (let i = 0; i < childCoordinates.length; i++) {
    const curr = childCoordinates[i]!;
    if (Math.abs(curr.left - relativePointerLoc.left) < minDist) {
      minSide = "left";
      minDist = Math.abs(curr.left - relativePointerLoc.left);
      minIndex = i;
    }
    if (Math.abs(curr.left + curr.width - relativePointerLoc.left) < minDist) {
      minSide = "right";
      minDist = Math.abs(curr.left + curr.width - relativePointerLoc.left);
      minIndex = i;
    }
    if (Math.abs(curr.top - relativePointerLoc.top) < minDist) {
      minSide = "top";
      minDist = Math.abs(curr.top - relativePointerLoc.top);
      minIndex = i;
    }
    if (Math.abs(curr.top + curr.height - relativePointerLoc.top) < minDist) {
      minSide = "bottom";
      minDist = Math.abs(curr.top + curr.height - relativePointerLoc.top);
      minIndex = i;
    }
  }
  if (minSide! === "left" || minSide! === "top") {
    return minIndex! - 1;
  } else {
    return minIndex! + 1;
  }
}
