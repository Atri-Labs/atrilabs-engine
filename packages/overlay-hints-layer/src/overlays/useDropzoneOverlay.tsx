import {
  addOrModifyHintOverlays,
  removeHintOverlays,
  subscribeCanvasActivity,
} from "@atrilabs/canvas-runtime";
import { getId } from "@atrilabs/core";
import { orange600 } from "@atrilabs/design-system";
import { useCallback, useEffect, useRef } from "react";
import { FilledLine } from "../components/FilledLine";

const thickness = 2;

export const useDropzoneOverlay = () => {
  const topLineHoverId = useRef<string | null>(null);
  const rightLineHoverId = useRef<string | null>(null);
  const bottomLineHoverId = useRef<string | null>(null);
  const leftLineHoverId = useRef<string | null>(null);
  const clearOverlay = useCallback(() => {
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
  useEffect(() => {
    const unsub = subscribeCanvasActivity("dropzoneCreated", (context) => {
      topLineHoverId.current = getId();
      rightLineHoverId.current = getId();
      bottomLineHoverId.current = getId();
      leftLineHoverId.current = getId();
      if (context.currentDropzone === undefined) {
        clearOverlay();
        return;
      }
      // top line
      addOrModifyHintOverlays({
        [topLineHoverId.current]: {
          compId: context.currentDropzone!.id!,
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
          compId: context.currentDropzone!.id!,
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
          compId: context.currentDropzone!.id!,
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
          compId: context.currentDropzone!.id!,
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
  }, [clearOverlay]);
  useEffect(() => {
    const unsub = subscribeCanvasActivity(
      "dropzoneDestroyed",
      (context, event) => {
        clearOverlay();
      }
    );
    return unsub;
  }, [clearOverlay]);
};
