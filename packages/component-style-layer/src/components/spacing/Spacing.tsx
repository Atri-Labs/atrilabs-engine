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
}) => {
  return (
    <svg
      width="202"
      height="100"
      viewBox="0 0 202 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <MarginTop onMouseDown={onMouseDownMarginTop} />
      <MarginLeft onMouseDown={onMouseDownMarginLeft} />
      <MarginRight onMouseDown={onMouseDownMarginRight} />
      <MarginBottom onMouseDown={onMouseDownMarginBottom} />
      <PaddingTop onMouseDown={onMouseDownPaddingTop} />
      <PaddingLeft onMouseDown={onMouseDownPaddingLeft} />
      <PaddingRight onMouseDown={onMouseDownPaddingRight} />
      <PaddingBottom onMouseDown={onMouseDownPaddingBottom} />
    </svg>
  );
};

export default Spacing;
