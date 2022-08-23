import {
  addOrModifyHintOverlays,
  CanvasActivityContext,
  removeHintOverlays,
  subscribeCanvasActivity,
} from "@atrilabs/canvas-runtime";
import { getId } from "@atrilabs/core";
import { orange600 } from "@atrilabs/design-system";
import { useCallback, useEffect, useRef } from "react";
import { FilledLine } from "../components/FilledLine";
import { useSubscribeComponentRendered } from "./hooks/useSubscribeComponentRendered";

const thickness = 2;

export const useHoverWhileSelectedOverlay = () => {
  const topLineHoverId = useRef<string | null>(null);
  const rightLineHoverId = useRef<string | null>(null);
  const bottomLineHoverId = useRef<string | null>(null);
  const leftLineHoverId = useRef<string | null>(null);
  const currentRenderedContext = useRef<CanvasActivityContext | null>(null);
  const clearOverlay = useCallback(() => {
    currentRenderedContext.current = null;
    if (topLineHoverId.current) {
      removeHintOverlays([topLineHoverId.current]);
      topLineHoverId.current = null;
    }
    if (rightLineHoverId.current) {
      removeHintOverlays([rightLineHoverId.current]);
      rightLineHoverId.current = null;
    }
    if (bottomLineHoverId.current) {
      removeHintOverlays([bottomLineHoverId.current]);
      bottomLineHoverId.current = null;
    }
    if (leftLineHoverId.current) {
      removeHintOverlays([leftLineHoverId.current]);
      leftLineHoverId.current = null;
    }
  }, []);
  const renderFn = useCallback(() => {
    if (
      topLineHoverId.current &&
      rightLineHoverId.current &&
      bottomLineHoverId.current &&
      leftLineHoverId.current &&
      currentRenderedContext.current &&
      currentRenderedContext.current.hover?.id &&
      currentRenderedContext.current.hover.id !== "body"
    ) {
      // top line
      addOrModifyHintOverlays({
        [topLineHoverId.current]: {
          compId: currentRenderedContext.current.hover?.id!,
          comp: <FilledLine fill={orange600} />,
          overlayId: topLineHoverId.current,
          box: (dim) => {
            return {
              dimension: {
                width: dim.dimension.width,
                height: thickness,
              },
              position: { top: -thickness, left: 0 },
            };
          },
        },
      });
      // right line
      addOrModifyHintOverlays({
        [rightLineHoverId.current]: {
          compId: currentRenderedContext.current.hover?.id!,
          comp: <FilledLine fill={orange600} />,
          overlayId: rightLineHoverId.current,
          box: (dim) => {
            return {
              dimension: {
                width: thickness,
                height: dim.dimension.height + 2 * thickness,
              },
              position: { top: -thickness, left: dim.dimension.width },
            };
          },
        },
      });
      // bottom line
      addOrModifyHintOverlays({
        [bottomLineHoverId.current]: {
          compId: currentRenderedContext.current.hover?.id!,
          comp: <FilledLine fill={orange600} />,
          overlayId: bottomLineHoverId.current,
          box: (dim) => {
            return {
              dimension: {
                width: dim.dimension.width,
                height: thickness,
              },
              position: { top: dim.dimension.height, left: 0 },
            };
          },
        },
      });
      // left line
      addOrModifyHintOverlays({
        [leftLineHoverId.current]: {
          compId: currentRenderedContext.current.hover?.id!,
          comp: <FilledLine fill={orange600} />,
          overlayId: leftLineHoverId.current,
          box: (dim) => {
            return {
              dimension: {
                width: thickness,
                height: dim.dimension.height + 2 * thickness,
              },
              position: { top: -thickness, left: -thickness },
            };
          },
        },
      });
    }
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity(
      "hoverWhileSelected",
      (context, _event) => {
        topLineHoverId.current = getId();
        rightLineHoverId.current = getId();
        bottomLineHoverId.current = getId();
        leftLineHoverId.current = getId();
        currentRenderedContext.current = context;
        renderFn();
      }
    );
    return unsub;
  }, [renderFn]);
  useEffect(() => {
    const unsub = subscribeCanvasActivity(
      "hoverWhileSelectedEnd",
      (_context, _event) => {
        clearOverlay();
      }
    );
    return unsub;
  }, [clearOverlay]);
  useSubscribeComponentRendered(renderFn);
};
