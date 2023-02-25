import { subscribeCanvasMachine } from "../../../api";
import { getId } from "../../../utils/getId";
import {
  removeHintOverlays,
  addOrModifyHintOverlays,
} from "../../VisualHints/hintOverlays";
import { useCallback, useEffect, useRef } from "react";
import { OpacityBox } from "../components/OpacityBox";

export const useDraggedOverlay = () => {
  const boxOverlayId = useRef<string | null>(null);
  const compId = useRef<string | null>(null);

  const clearOverlay = useCallback(() => {
    if (boxOverlayId.current) {
      removeHintOverlays([boxOverlayId.current]);
      boxOverlayId.current = null;
    }
  }, []);

  const renderFn = useCallback(() => {
    if (boxOverlayId.current && compId.current) {
      // top line
      addOrModifyHintOverlays({
        [boxOverlayId.current]: {
          compId: compId.current,
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
    }
  }, []);

  useEffect(() => {
    const unsub = subscribeCanvasMachine("reposition", (context) => {
      if (!context.repositionComponent) {
        return;
      }
      boxOverlayId.current = getId();
      compId.current = context.repositionComponent;
      renderFn();
    });
    return unsub;
  }, [renderFn]);

  useEffect(() => {
    const unsub = subscribeCanvasMachine("repositionSuccess", () => {
      clearOverlay();
    });
    return unsub;
  }, [clearOverlay]);

  useEffect(() => {
    const unsub = subscribeCanvasMachine("repositionFailed", () => {
      clearOverlay();
    });
    return unsub;
  }, [clearOverlay]);
};
