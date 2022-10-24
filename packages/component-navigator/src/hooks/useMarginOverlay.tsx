import { getId } from "@atrilabs/core";
import {
  addOrModifyHintOverlays,
  removeHintOverlays,
} from "@atrilabs/canvas-runtime";
import { orange600 } from "@atrilabs/design-system";

import { FilledLineProps } from "../types";

const FilledLine: React.FC<FilledLineProps> = (props) => {
  return (
    <div
      style={{
        border: `solid ${props.fill} 2px`,
        height: "100%",
        width: "100%",
      }}
    ></div>
  );
};

export const clickOverlay = getId();
export const hoverOverlay = getId();

/**
 * useMarginOverlay hook can be used to create or remove overlays over components in the canvas.
 * This can be reused with different identifier for creating separate overlays
 * @param overlay unique id for the overlay
 * @returns object containing createMarginOverlay and removeMarginOverlay functions
 */
export const useMarginOverlay = (overlay: string) => {
  /**
   * createMarginOverlay draws an overlay over the given component
   * @param compId id of the component to create overlay over
   */
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
  /**
   * removeMarginOverlay removes the over drawn over.
   */
  const removeMarginOverlay = () => {
    removeHintOverlays([overlay]);
  };
  return { createMarginOverlay, removeMarginOverlay };
};
