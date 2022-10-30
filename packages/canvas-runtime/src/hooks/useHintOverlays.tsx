import React, { useCallback, useEffect, useMemo, useState } from "react";
import { canvasComponentStore } from "../CanvasComponentData";
import { BoxDimension, Position } from "../types";
import { ComponentCoords, getCoords } from "../utils";

type HintDimension = {
  position: Position;
  dimension: { width: number; height: number };
};

type BoxOverlay = (comp: { dimension: BoxDimension }) => HintDimension;

export type HintOverlay = {
  overlayId: string;
  compId: string;
  comp: React.ReactNode;
  box: BoxOverlay;
};

type HintOverlayDimension = {
  box: HintDimension;
  bodyCoords: ComponentCoords;
  compCoords: ComponentCoords;
};

let hintOverlays: { [overlayId: string]: HintOverlay } = {};
let hintOverlaySubscriber: (() => void) | undefined;

export function addOrModifyHintOverlays(overlays: {
  [overlayId: string]: HintOverlay;
}) {
  hintOverlays = { ...hintOverlays, ...overlays };
  if (hintOverlaySubscriber) {
    hintOverlaySubscriber();
  }
}

export function removeHintOverlays(overlayIds: string[]) {
  overlayIds.forEach((overlayId) => {
    if (hintOverlays[overlayId]) {
      delete hintOverlays[overlayId];
    }
  });
  if (hintOverlaySubscriber) {
    hintOverlaySubscriber();
  }
}

function calculateBoxDimensions(
  props: HintOverlay
): HintOverlayDimension | null {
  if (canvasComponentStore[props.compId]) {
    if (
      canvasComponentStore["body"].ref.current &&
      canvasComponentStore[props.compId].ref.current
    ) {
      const body = canvasComponentStore["body"].ref.current;
      const comp = canvasComponentStore[props.compId].ref.current!;
      const bodyCoords = getCoords(body);
      const compCoords = getCoords(comp);
      const {
        marginBottom,
        marginTop,
        marginLeft,
        marginRight,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
      } = getComputedStyle(comp);
      const box = props.box({
        dimension: {
          height: compCoords.height,
          width: compCoords.width,
          marginBottom: parseFloat(marginBottom),
          marginLeft: parseFloat(marginLeft),
          marginRight: parseFloat(marginRight),
          marginTop: parseFloat(marginTop),
          paddingBottom: parseFloat(paddingBottom),
          paddingTop: parseFloat(paddingTop),
          paddingLeft: parseFloat(paddingLeft),
          paddingRight: parseFloat(paddingRight),
        },
      });
      return { box, bodyCoords, compCoords };
    }
  }
  return null;
}

const HintOverlayBox: React.FC<HintOverlay & { scale: number }> = (props) => {
  const boxDimensions = useMemo(() => {
    return calculateBoxDimensions(props);
  }, [props]);
  if (!boxDimensions) {
    return <></>;
  }
  const { box, bodyCoords, compCoords } = boxDimensions;
  const bodyPosition = { top: bodyCoords.top, left: bodyCoords.left };
  const compPosition = { top: compCoords.top, left: compCoords.left };

  return (
    <React.Fragment>
      {box && compPosition && bodyPosition ? (
        <div
          style={{
            position: "absolute",
            top:
              (compPosition.top - bodyPosition.top + box.position.top) /
              props.scale,
            left:
              (compPosition.left - bodyPosition.left + box.position.left) /
              props.scale,
            width: box.dimension.width / props.scale,
            height: box.dimension.height / props.scale,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {props.comp}
        </div>
      ) : null}
    </React.Fragment>
  );
};

export const useHintOverlays = () => {
  const [hintNodes, setHintNodes] = useState<React.ReactNode[]>([]);

  const setNodesCb = useCallback(() => {
    const hintNodeIds = Object.keys(hintOverlays);
    const hintNodes = hintNodeIds.map((hintNodeId) => {
      const hintOverlay = hintOverlays[hintNodeId]!;
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
  }, []);

  useEffect(() => {
    // set nodes whenever a overlay data structure is changed
    hintOverlaySubscriber = () => {
      setNodesCb();
    };
  }, [setNodesCb]);

  useEffect(() => {
    // set nodes whenever dimension of screen changes
    setNodesCb();
  }, [setNodesCb]);
  return hintNodes;
};
