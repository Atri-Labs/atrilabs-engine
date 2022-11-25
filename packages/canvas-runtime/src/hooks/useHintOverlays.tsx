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

function calculateBoxDimensions(props: HintOverlay): HintOverlayDimension {
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
  return {
    box: { position: { top: 0, left: 0 }, dimension: { width: 0, height: 0 } },
    bodyCoords: { top: 0, left: 0, height: 0, width: 0 },
    compCoords: { top: 0, left: 0, width: 0, height: 0 },
  };
}

const HintOverlayBox: React.FC<HintOverlay & { scale: number }> = (props) => {
  const { box, bodyCoords, compCoords } = useMemo(() => {
    return calculateBoxDimensions(props);
  }, [props]);

  const { top, left, width, height } = useMemo(() => {
    const bodyPosition = { top: bodyCoords.top, left: bodyCoords.left };
    const compPosition = { top: compCoords.top, left: compCoords.left };
    const top =
      (compPosition.top - bodyPosition.top + box.position.top) / props.scale;
    const left =
      (compPosition.left - bodyPosition.left + box.position.left) / props.scale;
    const width = box.dimension.width / props.scale;
    const height = box.dimension.height / props.scale;
    // calculate access
    const topAccess = top < 0 ? Math.abs(top) : 0;
    const leftAccess = left < 0 ? Math.abs(left) : 0;
    let rightAccess = 0;
    if (left + width > bodyCoords.width) {
      rightAccess = left + width - bodyCoords.width;
    }
    return {
      top: top + topAccess,
      left: rightAccess > 0 ? left - rightAccess : left + leftAccess,
      width: width,
      height: height - topAccess > 0 ? height - topAccess : height,
    };
  }, [box, bodyCoords, compCoords, props.scale]);

  const isOverlayInsideCanvas = useMemo(() => {
    if (left < 0) {
      return false;
    }
    if (left + width > bodyCoords.width) {
      return false;
    }
    if (top < 0) {
      return false;
    }
    if (top + height > bodyCoords.height) {
      return false;
    }
    return true;
  }, [left, width, bodyCoords, top, height]);

  return (
    <React.Fragment>
      {box && isOverlayInsideCanvas ? (
        <div
          style={{
            position: "absolute",
            top,
            left,
            width,
            height,
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
