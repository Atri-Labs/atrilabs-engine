import React from "react";
import {
  PositionTop,
  PositionLeft,
  PositionRight,
  PositionBottom,
} from "./PositionValues";

type PositionProp = {
  onMouseDownPositionTop: (event: any) => void;
  onMouseDownPositionRight: (event: any) => void;
  onMouseDownPositionBottom: (event: any) => void;
  onMouseDownPositionLeft: (event: any) => void;
};

const PositionTrapezoid: React.FC<PositionProp> = ({
  onMouseDownPositionTop,
  onMouseDownPositionRight,
  onMouseDownPositionBottom,
  onMouseDownPositionLeft,
}) => {
  return (
    <svg
      width="202"
      height="100"
      viewBox="0 0 202 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <PositionTop onMouseDown={onMouseDownPositionTop} />
      <PositionLeft onMouseDown={onMouseDownPositionLeft} />
      <PositionRight onMouseDown={onMouseDownPositionRight} />
      <PositionBottom onMouseDown={onMouseDownPositionBottom} />
    </svg>
  );
};

export default PositionTrapezoid;
