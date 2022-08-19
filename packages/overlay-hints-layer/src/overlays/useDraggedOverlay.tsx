import {
  addOrModifyHintOverlays,
  removeHintOverlays,
  subscribeCanvasActivity,
  CanvasActivityContext,
} from "@atrilabs/canvas-runtime";
import { getId } from "@atrilabs/core";
import { useCallback, useEffect, useRef } from "react";
import { OpacityBox } from "../components/OpacityBox";
import { useSubscribeComponentRendered } from "./hooks/useSubscribeComponentRendered";

export const useDraggedOverlay = () => {
  const boxOverlayId = useRef<string | null>(null);
  const currentRenderedContext = useRef<CanvasActivityContext | null>(null);
  const clearOverlay = useCallback(() => {
    if (boxOverlayId.current) {
      removeHintOverlays([boxOverlayId.current]);
      boxOverlayId.current = null;
      currentRenderedContext.current = null;
    }
  }, []);
  // An overlay is rendered whenever the canvas activity happens
  // or when the component has been re-rendered due to change in it's props
  const renderFn = useCallback(() => {
    if (
      boxOverlayId.current &&
      currentRenderedContext.current &&
      currentRenderedContext.current.dragged?.id &&
      currentRenderedContext.current.dragged.id !== "body"
    ) {
      // top line
      addOrModifyHintOverlays({
        [boxOverlayId.current]: {
          compId: currentRenderedContext.current.dragged?.id!,
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
    const unsub = subscribeCanvasActivity("dragStart", (context) => {
      if (context.dragged && context.dragged.id === "body") {
        return;
      }
      boxOverlayId.current = getId();
      currentRenderedContext.current = context;
      renderFn();
    });
    return unsub;
  }, [renderFn]);
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
  useSubscribeComponentRendered(renderFn);
};
