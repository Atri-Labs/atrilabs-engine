import React from "react";
import { gray600 } from "@atrilabs/design-system";
import "./Margin.css";
export const fillColor = "rgba(75, 85, 99, 0.4)";
export type MarginInput = {
  onMouseDown: (event: any) => void;
};
export const MarginTop: React.FC<MarginInput> = ({ onMouseDown }) => {
  return (
    <path
      id="marginTopTrapezoid"
      fill={fillColor}
      d="M 0,0 h 202 l -35,20 h -132 Z"
      onMouseDown={onMouseDown}
    />
  );
};
export const MarginLeft: React.FC<MarginInput> = ({ onMouseDown }) => {
  return (
    <path
      id="marginLeftTrapezoid"
      fill={gray600}
      d="m 0,0 v 100 l 35,-20 v -60 Z"
      onMouseDown={onMouseDown}
    />
  );
};
export const MarginRight: React.FC<MarginInput> = ({ onMouseDown }) => {
  return (
    <path
      id="marginRightTrapezoid"
      fill={gray600}
      d="M 202,0 v 100 l -35,-20 v -60 Z"
      onMouseDown={onMouseDown}
    />
  );
};
export const MarginBottom: React.FC<MarginInput> = ({ onMouseDown }) => {
  return (
    <path
      id="marginBottomTrapezoid"
      fill={fillColor}
      d="M 0,100 h 202 l -35,-20 h -132 Z"
      onMouseDown={onMouseDown}
    />
  );
};
