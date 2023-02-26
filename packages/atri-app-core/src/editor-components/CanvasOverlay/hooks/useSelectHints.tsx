import { orange600 } from "@atrilabs/design-system";
import { useEffect, useRef, useCallback } from "react";
import { subscribeCanvasMachine } from "../../../api";
import { getId } from "../../../utils/getId";
import {
  removeHintOverlays,
  addOrModifyHintOverlays,
} from "../../VisualHints/hintOverlays";
import { FilledLine } from "../components/FilledLine";

const thickness = 2;

export function useSelectHints() {
  const topLineHoverId = useRef<string | null>(null);
  const rightLineHoverId = useRef<string | null>(null);
  const bottomLineHoverId = useRef<string | null>(null);
  const leftLineHoverId = useRef<string | null>(null);
  const compId = useRef<string | null>(null);

  const clearOverlay = useCallback((canvasZoneIdForSelectEnd?: string) => {
    if (topLineHoverId.current) {
      removeHintOverlays([topLineHoverId.current], canvasZoneIdForSelectEnd);
      topLineHoverId.current = null;
    }
    if (rightLineHoverId.current) {
      removeHintOverlays([rightLineHoverId.current], canvasZoneIdForSelectEnd);
      rightLineHoverId.current = null;
    }
    if (bottomLineHoverId.current) {
      removeHintOverlays([bottomLineHoverId.current], canvasZoneIdForSelectEnd);
      bottomLineHoverId.current = null;
    }
    if (leftLineHoverId.current) {
      removeHintOverlays([leftLineHoverId.current], canvasZoneIdForSelectEnd);
      leftLineHoverId.current = null;
    }
  }, []);

  const renderFn = useCallback(() => {
    if (
      topLineHoverId.current &&
      rightLineHoverId.current &&
      bottomLineHoverId.current &&
      leftLineHoverId.current &&
      compId.current
    ) {
      // top line
      addOrModifyHintOverlays({
        [topLineHoverId.current]: {
          compId: compId.current,
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
          compId: compId.current,
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
          compId: compId.current,
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
          compId: compId.current,
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
    return subscribeCanvasMachine("select", (context, event) => {
      topLineHoverId.current = getId();
      rightLineHoverId.current = getId();
      bottomLineHoverId.current = getId();
      leftLineHoverId.current = getId();
      compId.current = context.selected;
      renderFn();
    });
  }, []);

  useEffect(() => {
    return subscribeCanvasMachine("selectEnd", (context, event: any) => {
      if (event.type === "COMPONENT_DELETED") {
        clearOverlay(event.comp!.parent.canvasZoneId);
      } else {
        clearOverlay();
      }
      compId.current = null;
    });
  }, []);
}
