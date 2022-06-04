import {
  addOrModifyHintOverlays,
  removeHintOverlays,
  subscribeCanvasActivity,
} from "@atrilabs/canvas-runtime";
import { getId } from "@atrilabs/core";
import { useCallback, useEffect, useRef } from "react";
import { OpacityBox } from "../components/OpacityBox";

export const useDraggedOverlay = () => {
  const boxOverlayId = useRef<string | null>(null);
  const clearOverlay = useCallback(() => {
    if (boxOverlayId.current) {
      removeHintOverlays([boxOverlayId.current]);
      boxOverlayId.current = null;
    }
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("dragStart", (context) => {
      boxOverlayId.current = getId();
      // top line
      addOrModifyHintOverlays({
        [boxOverlayId.current]: {
          compId: context.dragged?.id!,
          comp: <OpacityBox opacity={0.5} />,
          overlayId: boxOverlayId.current,
          box: (dim) => {
            return {
              dimension: {
                width: dim.dimension.width,
                height: dim.dimension.height,
              },
              position: { top: 0, left: 0 },
            };
          },
        },
      });
    });
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("dragEnd", (context, event) => {
      clearOverlay();
    });
    return unsub;
  }, [clearOverlay]);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("dragCancel", (context, event) => {
      clearOverlay();
    });
    return unsub;
  }, [clearOverlay]);
};
