import React, { useCallback, useEffect, useState } from "react";
import { canvasComponentStore } from "../CanvasComponentData";
import { BoxDimension, Dimension, Position } from "../types";
import { getCoords } from "../utils";

export type HintOverlay = {
  overlayId: string;
  compId: string;
  comp: React.ReactNode;
  box: (comp: { dimension: BoxDimension }) => {
    position: Position;
    dimension: BoxDimension;
  };
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

const HintOverlayBox: React.FC<HintOverlay & { scale: number }> = (props) => {
  const [box, setBox] = useState<ReturnType<HintOverlay["box"]> | null>(null);
  const [bodyPosition, setBodyPosition] = useState<Position | null>(null);
  const [compPosition, setCompPosition] = useState<Position | null>(null);
  useEffect(() => {
    if (canvasComponentStore[props.compId]) {
      if (
        canvasComponentStore["body"].ref.current &&
        canvasComponentStore[props.compId].ref.current
      ) {
        const body = canvasComponentStore["body"].ref.current;
        const comp = canvasComponentStore[props.compId].ref.current!;
        const bodyCoords = getCoords(body);
        const compCoords = getCoords(comp);
        const box = props.box({
          dimension: { height: compCoords.height, width: compCoords.width },
        });
        setBox(box);
        setBodyPosition({ top: bodyCoords.top, left: bodyCoords.left });
        setCompPosition({ top: compCoords.top, left: compCoords.left });
      }
    }
  }, [props]);

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

export const useHintOverlays = (dimension: Dimension | undefined) => {
  const [hintNodes, setHintNodes] = useState<React.ReactNode[]>([]);

  const setNodesCb = useCallback(() => {
    if (dimension) {
      const hintNodeIds = Object.keys(hintOverlays);
      const hintNodes = hintNodeIds.map((hintNodeId) => {
        const hintOverlay = hintOverlays[hintNodeId]!;
        return (
          <HintOverlayBox
            {...hintOverlay}
            scale={dimension.scale}
            key={hintOverlay.overlayId}
          />
        );
      });
      setHintNodes(hintNodes);
    }
  }, [dimension]);

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
