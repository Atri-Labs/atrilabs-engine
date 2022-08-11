// BoxPlot/CandleStickPlot code referenced from https://github.com/recharts/recharts/issues/369
import { RectangleProps } from "recharts";

export const DotBar = (props: RectangleProps) => {
  const { x, y, width, height } = props;

  if (x == null || y == null || width == null || height == null) {
    return null;
  }

  return (
    <line
      x1={x + width / 2}
      y1={y + height}
      x2={x + width / 2}
      y2={y}
      fill={props.fill}
      stroke={props.stroke}
      strokeWidth={props.strokeWidth}
      strokeDasharray={props.strokeDasharray}
    />
  );
};

export const HorizonBar = (props: RectangleProps) => {
  const { x, y, width, height } = props;

  if (x == null || y == null || width == null || height == null) {
    return null;
  }

  return (
    <line
      x1={x}
      y1={y}
      x2={x + width}
      y2={y}
      strokeWidth={3}
      fill={props.fill}
      stroke={props.stroke}
    />
  );
};
