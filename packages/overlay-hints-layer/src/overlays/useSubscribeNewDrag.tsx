import {
  addOrModifyHintOverlays,
  removeHintOverlays,
  subscribeNewDrag,
  subscribeNewDrop,
} from "@atrilabs/canvas-runtime";
import { getId } from "@atrilabs/core";
import { orange600 } from "@atrilabs/design-system";
import { useCallback, useEffect, useRef } from "react";
import { FilledLine } from "../components/FilledLine";
import { useSubscribeComponentRendered } from "./hooks/useSubscribeComponentRendered";

const thickness = 2;

export const useSubscribeNewDrag = () => {
  const topLineHoverId = useRef<string | null>(null);
  const rightLineHoverId = useRef<string | null>(null);
  const bottomLineHoverId = useRef<string | null>(null);
  const leftLineHoverId = useRef<string | null>(null);
  const prevCaughtBy = useRef<string | null>(null);
  const clearOverlays = useCallback(() => {
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
      prevCaughtBy.current &&
      prevCaughtBy.current !== "body"
    ) {
      // top line
      addOrModifyHintOverlays({
        [topLineHoverId.current]: {
          compId: prevCaughtBy.current,
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
          compId: prevCaughtBy.current,
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
          compId: prevCaughtBy.current,
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
          compId: prevCaughtBy.current,
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
    const unsub = subscribeNewDrag((_args, _loc, caughtBy) => {
      if (caughtBy) {
        if (prevCaughtBy.current !== caughtBy) {
          clearOverlays();
          topLineHoverId.current = getId();
          rightLineHoverId.current = getId();
          bottomLineHoverId.current = getId();
          leftLineHoverId.current = getId();
        } else {
          return;
        }
        prevCaughtBy.current = caughtBy;
        renderFn();
      } else {
        prevCaughtBy.current = null;
        clearOverlays();
      }
    });
    return unsub;
  }, [clearOverlays, renderFn]);
  useEffect(() => {
    const unsub = subscribeNewDrop(() => {
      prevCaughtBy.current = null;
      clearOverlays();
    });
    return unsub;
  }, [clearOverlays]);
  useSubscribeComponentRendered(renderFn);
};
