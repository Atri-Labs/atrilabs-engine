import { componentStoreApi } from "../../api";
import { HintOverlay } from "./types";

const hintOverlays: { [overlayId: string]: HintOverlay } = {};
const overlayCanvasZoneMap: { [canvasZoneId: string]: string[] } = {};
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
      ? overlayCanvasZoneMap[canvasZoneId].push(overlayId)
      : (overlayCanvasZoneMap[canvasZoneId] = [overlayId]);
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
    const canvasZoneId = componentStoreApi.getComponent(overlay.compId)!.parent
      .canvasZoneId;
    affectedCanvasZones.add(canvasZoneId);
    if (hintOverlays[overlayId]) {
      delete hintOverlays[overlayId];
    }
    const foundIndex = overlayCanvasZoneMap[canvasZoneId].findIndex(
      (curr) => curr === overlayId
    );
    if (foundIndex >= 0) {
      overlayCanvasZoneMap[canvasZoneId].splice(foundIndex, 1);
    }
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
