import {
  addOrModifyHintOverlays,
  removeHintOverlays,
  subscribeCanvasActivity,
} from "@atrilabs/canvas-runtime";
import { getId } from "@atrilabs/core";
import { orange600 } from "@atrilabs/design-system";
import { useEffect, useRef } from "react";
import { FilledLine } from "../components/FilledLine";

const thickness = 2;

export const useHoverOverlay = () => {
  const topLineHoverId = useRef<string | null>(null);
  const rightLineHoverId = useRef<string | null>(null);
  const bottomLineHoverId = useRef<string | null>(null);
  const leftLineHoverId = useRef<string | null>(null);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("hover", (context, event) => {
      topLineHoverId.current = getId();
      rightLineHoverId.current = getId();
      bottomLineHoverId.current = getId();
      leftLineHoverId.current = getId();
      // top line
      addOrModifyHintOverlays({
        [topLineHoverId.current]: {
          compId: context.hover?.id!,
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
          compId: context.hover?.id!,
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
          compId: context.hover?.id!,
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
          compId: context.hover?.id!,
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
    });
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("hoverEnd", (context, event) => {
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
    });
    return unsub;
  }, []);
};
