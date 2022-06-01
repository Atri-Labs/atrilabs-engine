import React, { useCallback, useEffect, useState } from "react";
import { canvasComponentStore } from "../CanvasComponentData";
import { Dimension } from "../types";
import { getCoords } from "../utils";

type Position = { top: number; left: number };

type BoxDimension = { width: number; height: number };

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

const HintOverlayBox: React.FC<HintOverlay> = (props) => {
  const [box, setBox] = useState<ReturnType<HintOverlay["box"]> | null>(null);
  const [compPosition, setCompPosition] = useState<Position | null>(null);
  if (canvasComponentStore[props.compId]) {
    if (canvasComponentStore[props.compId].ref.current) {
      const { height, width, top, left } = getCoords(
        canvasComponentStore[props.compId].ref.current
      );
      const box = props.box({ dimension: { height, width } });
      setBox(box);
      setCompPosition({ top, left });
    }
  }
  return (
    <>
      {box && compPosition ? (
        <div
          key={props.overlayId}
          style={{
            position: "absolute",
            top: compPosition.top + box.position.top,
            left: compPosition.left + box.position.left,
            width: box.dimension.width,
            height: box.dimension.height,
          }}
        >
          {props.comp}
        </div>
      ) : null}
    </>
  );
};

export const useHintOverlays = (dimension: Dimension | undefined) => {
  const [hintNodes, setHintNodes] = useState<React.ReactNode[]>([]);

  const setNodesCb = useCallback(() => {
    const hintNodeIds = Object.keys(hintOverlays);
    const hintNodes = hintNodeIds.map((hintNodeId) => {
      const hintOverlay = hintOverlays[hintNodeId]!;
      return <HintOverlayBox {...hintOverlay} />;
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
  }, [dimension, setNodesCb]);
  return hintNodes;
};
