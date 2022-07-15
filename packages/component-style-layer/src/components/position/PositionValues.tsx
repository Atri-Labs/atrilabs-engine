import React from "react";
import { gray600 } from "@atrilabs/design-system";
import "./PostionValues.css";
const fillColor = "rgba(75, 85, 99, 0.4)";
export type PositionInput = {
  onMouseDown: (event: any) => void;
};
export const PositionTop: React.FC<PositionInput> = ({ onMouseDown }) => {
  return (
    <path
      id="positionTopTrapezoid"
      fill={fillColor}
      d="M 37,22 h 128 l -34,19 h -60 Z"
      onMouseDown={onMouseDown}
    />
  );
};
export const PositionLeft: React.FC<PositionInput> = ({ onMouseDown }) => {
  return (
    <path
      id="positionLeftTrapezoid"
      fill={gray600}
      d="M 37,22 v 56 l 34,-19 v -18 Z"
      onMouseDown={onMouseDown}
    />
  );
};
export const PositionRight: React.FC<PositionInput> = ({ onMouseDown }) => {
  return (
    <path
      id="positionRightTrapezoid"
      fill={gray600}
      d="M 165,22 v 56 l -34,-19 v -18 Z"
      onMouseDown={onMouseDown}
    />
  );
};

export const PositionBottom: React.FC<PositionInput> = ({ onMouseDown }) => {
  return (
    <path
      id="positionBottomTrapezoid"
      fill={fillColor}
      d="M 37,78 h 128 l -34,-19 h -60 Z"
      onMouseDown={onMouseDown}
    />
  );
};
