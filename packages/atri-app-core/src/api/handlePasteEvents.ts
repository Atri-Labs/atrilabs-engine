import { ClipboardPasteObject, Location } from "../types";
import { getId } from "../utils/getId";
import { componentStoreApi } from "./componentStoreApi";
import { CANVAS_ZONE_ROOT_ID } from "./consts";
import {
  getComponentIndexInsideParentComponent,
  getCSSBoxCoords,
} from "./utils";

const lastPasted: { lastPastedCompId: string | null } = {
  lastPastedCompId: null,
};

function handlePasteInCanvasZone(pasteObject: ClipboardPasteObject) {
  const { pasteTargetCanvasZone } = pasteObject;
  if (pasteTargetCanvasZone) {
  } else {
    console.log(
      `pasteTargetCanvasZone expected to be defined, got ${pasteTargetCanvasZone}`
    );
  }
}

export function handlePasteEvents(pasteObject: ClipboardPasteObject) {
  const { copiedCompId, pasteTargetComp, pasteTargetCanvasZone } = pasteObject;
  if (pasteTargetCanvasZone) {
    handlePasteInCanvasZone(pasteObject);
  } else if (pasteTargetComp) {
    // get parent id
    let parentId: string | null = null;
    if (pasteTargetComp === copiedCompId) {
      parentId = componentStoreApi.getComponentParent(pasteTargetComp).id;
    } else if (pasteTargetComp === lastPasted.lastPastedCompId) {
      parentId = componentStoreApi.getComponentParent(pasteTargetComp).id;
    } else if (pasteTargetComp) {
      if (componentStoreApi.getComponent(pasteTargetComp)?.acceptsChild) {
        parentId = pasteTargetComp;
      } else {
        parentId = componentStoreApi.getComponentParent(pasteTargetComp).id;
      }
    }

    if (parentId === null) {
      return;
    }
    if (parentId === CANVAS_ZONE_ROOT_ID) {
      handlePasteInCanvasZone({
        ...pasteObject,
        pasteTargetCanvasZone:
          componentStoreApi.getComponentParent(pasteTargetComp).canvasZoneId,
      });
      return;
    }

    // compute child index by creating/mimicing a synthetic loc
    let index = 0;
    const pasteTargetRef = componentStoreApi.getComponent(pasteTargetComp)?.ref;
    if (pasteTargetRef && pasteTargetRef.current) {
      const selectedBoxCoords = getCSSBoxCoords(pasteTargetRef.current);
      const bottomWM = selectedBoxCoords.bottomWM;
      const rightWM = selectedBoxCoords.rightWM;

      // get location pageX, pageY
      const loc: Location = { pageX: rightWM, pageY: bottomWM };

      index = getComponentIndexInsideParentComponent(parentId, loc);
    }

    const canvasZoneId =
      componentStoreApi.getComponent(parentId)?.parent.canvasZoneId;
    lastPasted.lastPastedCompId = getId();
    window.top?.postMessage(
      {
        ...pasteObject,
        type: "PASTE_EVENTS",
        parent: { id: parentId, index, canvasZoneId },
        newTemplateRootId: lastPasted.lastPastedCompId,
      },
      "*"
    );
  }
}
