import React from "react";
import {gray600} from "@atrilabs/design-system";
import "./Padding.css";
const fillColor = "rgba(75, 85, 99, 0.4)";

export const PaddingTop = () => {
  return (
    <path
      id="paddingTopTrapezoid"
      fill={fillColor}
      d="M 37,22 h 128 l -34,19 h -60 Z"
    />
  );
};
export const PaddingLeft = () => {
  return (
    <path
      id="paddingLeftTrapezoid"
      fill={gray600}
      d="M 37,22 v 56 l 34,-19 v -18 Z"
    />
  );
};
export const PaddingRight = () => {
  return (
    <path
      id="paddingRightTrapezoid"
      fill={gray600}
      d="M 165,22 v 56 l -34,-19 v -18 Z"
    />
  );
};

export const PaddingBottom = () => {
  return (
    <path
      id="paddingBottomTrapezoid"
      fill={fillColor}
      d="M 37,78 h 128 l -34,-19 h -60 Z"
    />
  );
};
