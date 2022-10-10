import { getId } from "@atrilabs/core";
import {
  addOrModifyHintOverlays,
  removeHintOverlays,
} from "@atrilabs/canvas-runtime";
import { orange600 } from "@atrilabs/design-system";

type FilledLineProps = {
  fill: string;
};

const FilledLine: React.FC<FilledLineProps> = (props) => {
  return (
    <div
      style={{ border: `solid ${props.fill} 2px`, height: "100%", width: "100%" }}
    ></div>
  );
};

export const clickOverlay = getId();
export const hoverOverlay = getId();

export const useMarginOverlay = (overlay: string) => {
  const createMarginOverlay = (compId: string) => {
    addOrModifyHintOverlays({
      [overlay]: {
        overlayId: overlay,
        compId,
        comp: <FilledLine fill={orange600} />,
        box: (dim) => {
          return {
            dimension: dim.dimension,
            position: { top: 0, left: 0 },
          };
        },
      },
    });
  };
  const removeMarginOverlay = () => {
    removeHintOverlays([overlay]);
  };
  return { createMarginOverlay, removeMarginOverlay };
}
