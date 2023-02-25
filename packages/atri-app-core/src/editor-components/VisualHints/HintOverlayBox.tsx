import React, { useMemo } from "react";
import { componentStoreApi } from "../../api";
import { getCSSBoxCoords } from "../../api/utils";
import { HintOverlay, HintOverlayDimension } from "./types";

function calculateBoxDimensions(props: HintOverlay): HintOverlayDimension {
  const canvasComponent = componentStoreApi.getComponent(props.compId);
  if (canvasComponent?.ref.current) {
    const comp = canvasComponent.ref.current!;
    const canvasZoneId = canvasComponent.parent.canvasZoneId;
    const canvasZone = componentStoreApi.getCanvasZoneComponent(canvasZoneId);
    if (!canvasZone) {
      throw Error(`Canvas zone with canvas zone id ${canvasZoneId} not found.`);
    }
    const canvasZoneCoords = getCSSBoxCoords(canvasZone);
    const compCoords = getCSSBoxCoords(comp);
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
    return { box, canvasZoneCoords, compCoords };
  }

  return {
    box: { position: { top: 0, left: 0 }, dimension: { width: 0, height: 0 } },
    canvasZoneCoords: { top: 0, left: 0, height: 0, width: 0 },
    compCoords: { top: 0, left: 0, width: 0, height: 0 },
  };
}

export const HintOverlayBox: React.FC<HintOverlay & { scale: number }> = (
  props
) => {
  const { box, canvasZoneCoords, compCoords } = useMemo(() => {
    return calculateBoxDimensions(props);
  }, [props]);

  const { top, left, width, height } = useMemo(() => {
    const canvasZonePosition = {
      top: canvasZoneCoords.top,
      left: canvasZoneCoords.left,
    };
    const compPosition = { top: compCoords.top, left: compCoords.left };
    const top =
      (compPosition.top - canvasZonePosition.top + box.position.top) /
      props.scale;
    const left =
      (compPosition.left - canvasZonePosition.left + box.position.left) /
      props.scale;
    const width = box.dimension.width / props.scale;
    const height = box.dimension.height / props.scale;

    return { top, left, width, height };
  }, [box, canvasZoneCoords, compCoords, props.scale]);

  return (
    <React.Fragment>
      {box ? (
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
