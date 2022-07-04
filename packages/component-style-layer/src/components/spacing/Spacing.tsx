import React from "react";
import { MarginTop, MarginLeft, MarginRight, MarginBottom } from "./Margin";
import {
  PaddingTop,
  PaddingLeft,
  PaddingRight,
  PaddingBottom,
} from "./Padding";

type SpacingProp = {
  onMouseDownMarginTop: (event: any) => void;
  onMouseDownMarginRight: (event: any) => void;
  onMouseDownMarginBottom: (event: any) => void;
  onMouseDownMarginLeft: (event: any) => void;
  onMouseDownPaddingTop: (event: any) => void;
  onMouseDownPaddingRight: (event: any) => void;
  onMouseDownPaddingBottom: (event: any) => void;
  onMouseDownPaddingLeft: (event: any) => void;
  marginTop: React.CSSProperties["marginTop"];
  paddingTop: React.CSSProperties["paddingTop"];
};

const Spacing: React.FC<SpacingProp> = ({
  onMouseDownMarginTop,
  onMouseDownMarginRight,
  onMouseDownMarginBottom,
  onMouseDownMarginLeft,
  onMouseDownPaddingTop,
  onMouseDownPaddingRight,
  onMouseDownPaddingBottom,
  onMouseDownPaddingLeft,
  marginTop,
  paddingTop,
}) => {
  return (
    <svg
      width="202"
      height="100"
      viewBox="0 0 202 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <MarginTop
        onMouseDown={onMouseDownMarginTop}
      />
      <MarginLeft />
      <MarginRight />
      <MarginBottom />
      <PaddingTop />
      <PaddingLeft />
      <PaddingRight />
      <PaddingBottom />
    </svg>
  );
};

export default Spacing;
