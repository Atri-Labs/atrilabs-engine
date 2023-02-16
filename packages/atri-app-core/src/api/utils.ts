import { ComponentCoordsWM, Location } from "../types";
import { componentStoreApi } from "./componentStoreApi";
import {
  ReactComponentManifestSchema,
  AcceptsChildFunction,
} from "@atrilabs/react-component-manifest-schema";
import { manifestRegistryController } from "@atrilabs/manifest-registry";

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

export function lrtbSort(coords: ComponentCoordsWM[]) {
  coords.sort((a, b) => {
    const topDiff = a.topWM - b.topWM;
    if (topDiff === 0) {
      return a.leftWM - b.leftWM;
    }
    return topDiff;
  });
  return coords;
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

export function computeCanvasZoneChildIndex(info: {
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

export function computeFactoredIndex(index: number, siblingsId: string[]) {
  const { getComponentParent } = componentStoreApi;
  if (index === 0 && siblingsId.length === 0) {
    return 1;
  } else if (index === 0) {
    // NOTE: we are relying on the fact the getComponentChildrenId will return
    // children id in order
    const nextSiblingId = siblingsId[0];
    const nextSiblingIndex = getComponentParent(nextSiblingId).index;
    const newIndex = nextSiblingIndex / 2;
    return newIndex;
  } else if (index === siblingsId.length) {
    const prevSiblingId = siblingsId[index - 1];
    const prevSiblingIndex = getComponentParent(prevSiblingId).index;
    const newIndex = prevSiblingIndex * 2;
    return newIndex;
  } else {
    const prevSiblingId = siblingsId[index - 1];
    const nextSiblingId = siblingsId[index];
    const prevSiblingIndex = getComponentParent(prevSiblingId).index;
    const nextSiblingIndex = getComponentParent(nextSiblingId).index;
    const newIndex = (prevSiblingIndex + nextSiblingIndex) / 2;
    return newIndex;
  }
}

export function getComponentIndexInsideCanvasZone(
  canvasZoneId: string,
  loc: Location
): number {
  const canvasZoneElement =
    componentStoreApi.getCanvasZoneComponent(canvasZoneId)!;
  const coords = getCSSBoxCoords(canvasZoneElement);
  const siblingsId = componentStoreApi.getCanvasZoneChildrenId(canvasZoneId);
  const childCoordinates: ComponentCoordsWM[] = [];
  for (let i = 0; i < siblingsId.length; i++) {
    const siblingEl = componentStoreApi.getComponentRef(siblingsId[i]).current!;
    const coords = getCSSBoxCoords(siblingEl);
    if (coords) {
      childCoordinates.push(coords!);
    }
  }
  if (coords) {
    const index = computeCanvasZoneChildIndex({
      coords,
      childCoordinates,
      loc,
    });
    return computeFactoredIndex(index, siblingsId);
  } else {
    console.error(
      `coords & relativePointerLoc were expected to be defined. Please report this error to Atri Labs.`
    );
    return 0;
  }
}

export function getComponentIndexInsideParentComponent(
  parentCompId: string,
  loc: Location
) {
  const {
    pkg: parentPkg,
    key: parentKey,
    manifestSchemaId: parentManifestSchemaId,
  } = componentStoreApi.getComponent(parentCompId)!.meta;

  const parentEl = componentStoreApi.getComponentRef(parentCompId).current!;

  const parentFullManifest = manifestRegistryController
    .readManifestRegistry()
    [parentManifestSchemaId].manifests.find((curr) => {
      return curr.pkg === parentPkg && curr.manifest.meta.key === parentKey;
    });
  const parentManifest = parentFullManifest!
    .manifest as ReactComponentManifestSchema;
  if (!parentManifest.dev.acceptsChild) {
    console.error(
      "Parent manifest component must have a dev.acceptsChild field."
    );
  }
  const acceptsChild: AcceptsChildFunction = parentManifest.dev.acceptsChild!;
  const coords = getCSSBoxCoords(parentEl);
  const siblingsId = componentStoreApi.getComponentChildrenId(parentCompId);
  const childCoordinates: ComponentCoordsWM[] = [];
  for (let i = 0; i < siblingsId.length; i++) {
    const coords = getCSSBoxCoords(
      componentStoreApi.getComponentRef(siblingsId[i]).current!
    );
    if (coords) {
      childCoordinates.push(coords!);
    }
  } // TODO: send original props of parent
  const props = componentStoreApi.getComponentProps(parentCompId);
  if (coords) {
    const index = acceptsChild({
      coords,
      childCoordinates,
      loc,
      props,
      ref: componentStoreApi.getComponentRef(parentCompId),
    });
    return computeFactoredIndex(index, siblingsId);
  } else {
    console.error(
      `coords & relativePointerLoc were expected to be defined. Please report this error to Atri Labs.`
    );
    return 0;
  }
}
