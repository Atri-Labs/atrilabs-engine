import { getId } from "@atrilabs/core";
import {
  addOrModifyHintOverlays,
  removeHintOverlays,
} from "@atrilabs/canvas-runtime";
import { sky500 } from "@atrilabs/design-system";

const topLineId = getId();
const bottomLineId = getId();
const rightLineId = getId();
const leftLineId = getId();

type FilledLineProps = {
  fill: string;
};

const FilledLine: React.FC<FilledLineProps> = (props) => {
  return (
    <div
      style={{ background: props.fill, height: "100%", width: "100%" }}
    ></div>
  );
};

export const useMarginOverlay = () => {
  const createMarginOverlay = (compId: string) => {
    addOrModifyHintOverlays({
      [topLineId]: {
        overlayId: topLineId,
        compId,
        comp: <FilledLine fill={sky500} />,
        box: (dim) => {
          return {
            dimension: { width: 2, height: dim.dimension.marginTop },
            position: {
              top: -dim.dimension.marginTop,
              left: dim.dimension.width / 2,
            },
          };
        },
      },
      [bottomLineId]: {
        overlayId: bottomLineId,
        compId,
        comp: <FilledLine fill={sky500} />,
        box: (dim) => {
          return {
            dimension: { width: 2, height: dim.dimension.marginBottom },
            position: {
              top: dim.dimension.height,
              left: dim.dimension.width / 2,
            },
          };
        },
      },
      [rightLineId]: {
        overlayId: rightLineId,
        compId,
        comp: <FilledLine fill={sky500} />,
        box: (dim) => {
          return {
            dimension: { width: dim.dimension.marginRight, height: 2 },
            position: {
              top: dim.dimension.height / 2,
              left: dim.dimension.width,
            },
          };
        },
      },
      [leftLineId]: {
        overlayId: leftLineId,
        compId,
        comp: <FilledLine fill={sky500} />,
        box: (dim) => {
          return {
            dimension: { width: dim.dimension.marginLeft, height: 2 },
            position: {
              top: dim.dimension.height / 2,
              left: -dim.dimension.marginLeft,
            },
          };
        },
      },
    });
  };
  const removeMarginOverlay = () => {
    removeHintOverlays([topLineId, rightLineId, bottomLineId, leftLineId]);
  };
  return { createMarginOverlay, removeMarginOverlay };
};
