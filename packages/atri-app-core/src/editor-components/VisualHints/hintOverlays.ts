import { componentStoreApi } from "../../api";
import { HintOverlay } from "./types";

const hintOverlays: { [overlayId: string]: HintOverlay } = {};
const overlayCanvasZoneMap: { [canvasZoneId: string]: Set<string> } = {};
const hintOverlaySubscribers: {
  [canvasZoneId: string]: (() => void) | undefined;
} = {};

export function addOrModifyHintOverlays(overlays: {
  [overlayId: string]: HintOverlay;
}) {
  const overlayIds = Object.keys(overlays);
  const affectedCanvasZones: Set<string> = new Set();
  overlayIds.forEach((overlayId) => {
    const overlay = overlays[overlayId]!;
    hintOverlays[overlayId] = overlay;
    const canvasZoneId = componentStoreApi.getComponent(overlay.compId)!.parent
      .canvasZoneId;
    affectedCanvasZones.add(canvasZoneId);
    overlayCanvasZoneMap[canvasZoneId]
      ? overlayCanvasZoneMap[canvasZoneId].add(overlayId)
      : (overlayCanvasZoneMap[canvasZoneId] = new Set([overlayId]));
  });
  affectedCanvasZones.forEach((canvasZoneId) => {
    hintOverlaySubscribers[canvasZoneId]?.();
  });
}

export function removeHintOverlays(overlayIds: string[]) {
  const affectedCanvasZones: Set<string> = new Set();
  overlayIds.forEach((overlayId) => {
    if (!hintOverlays[overlayId]) {
      return;
    }
    const overlay = hintOverlays[overlayId]!;
    let canvasZoneId: string | null = null;
    for (const property in overlayCanvasZoneMap) {
      if (overlayCanvasZoneMap[property].has(overlay.overlayId))
        canvasZoneId = property;
    }
    if (canvasZoneId === null) {
      throw Error(`Cannot find canvas zone for overlay ${overlay.overlayId}.`);
    }
    affectedCanvasZones.add(canvasZoneId);
    if (hintOverlays[overlayId]) {
      delete hintOverlays[overlayId];
    }
    overlayCanvasZoneMap[canvasZoneId]?.delete(overlayId);
  });
  affectedCanvasZones.forEach((canvasZoneId) => {
    hintOverlaySubscribers[canvasZoneId]?.();
  });
}

export function getHintOverlayIds(canvasZoneId: string) {
  return overlayCanvasZoneMap[canvasZoneId] || [];
}

export function getHintOverlays() {
  return { ...hintOverlays };
}

export function subscribeHintOverlay(canvasZoneId: string, cb: () => void) {
  hintOverlaySubscribers[canvasZoneId] = cb;
}
