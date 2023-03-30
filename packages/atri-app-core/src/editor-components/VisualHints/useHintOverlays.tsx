import { useState, useCallback, useEffect } from "react";
import {
  getHintOverlays,
  subscribeHintOverlay,
  getHintOverlayIds,
} from "./hintOverlays";
import { HintOverlayBox } from "./HintOverlayBox";

export const useHintOverlays = (canvasZoneId: string) => {
  const [hintNodes, setHintNodes] = useState<React.ReactNode[]>([]);

  const setNodesCb = useCallback(() => {
    const hintOverlays = getHintOverlays();
    const hintHoverlayIds = getHintOverlayIds(canvasZoneId);
    const hintNodes = Array.from(hintHoverlayIds).map((hoverlayId) => {
      const hintOverlay = hintOverlays[hoverlayId];
      return (
        <HintOverlayBox
          {...hintOverlay}
          // Since overlays are already inside the iframe, we don't need to scale
          // overlays again.
          scale={1}
          key={hintOverlay.overlayId}
        />
      );
    });
    setHintNodes(hintNodes);
  }, [canvasZoneId]);

  useEffect(() => {
    // set nodes whenever a overlay data structure is changed
    subscribeHintOverlay(canvasZoneId, () => {
      setNodesCb();
    });
  }, [setNodesCb, canvasZoneId]);

  useEffect(() => {
    // set nodes whenever dimension of screen changes
    setNodesCb();
  }, [setNodesCb]);
  return hintNodes;
};
