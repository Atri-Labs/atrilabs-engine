import React, { useMemo } from "react";
import { componentStoreApi } from "../../api";
import { getCSSBoxCoords } from "../../api/utils";
import { HintOverlay, HintOverlayDimension } from "./types";

function calculateBoxDimensions(props: HintOverlay): HintOverlayDimension {
  const canvasComponent = componentStoreApi.getComponent(props.compId);
  const canvasComponentRef = componentStoreApi.getComponentRef(props.compId);
  if (canvasComponent && canvasComponentRef.current) {
    const comp = canvasComponentRef.current!;
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
  const { box, canvasZoneCoords, compCoordsArray } = useMemo(() => {
    const compCoordsArray = componentStoreApi
      .getComponent(props.compId)!
      .ref.filter(
        (currRef) => currRef.current !== null && currRef.current !== undefined
      )
      .map((currRef) => {
        return getCSSBoxCoords(currRef.current!);
      });
    return { ...calculateBoxDimensions(props), compCoordsArray };
  }, [props]);

  const positionAndDims = useMemo(() => {
    return compCoordsArray.map((compCoords) => {
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
    });
  }, [box, canvasZoneCoords, props.scale]);

  return (
    <React.Fragment>
      {positionAndDims.map((dims, index) => {
        return (
          <div
            style={{
              position: "absolute",
              top: dims.top,
              left: dims.left,
              width: dims.width,
              height: dims.height,
              pointerEvents: "none",
              userSelect: "none",
            }}
            key={index}
          >
            {props.comp}
          </div>
        );
      })}
    </React.Fragment>
  );
};
