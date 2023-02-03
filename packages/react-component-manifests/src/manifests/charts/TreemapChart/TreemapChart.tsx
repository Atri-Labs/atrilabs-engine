import React, { forwardRef } from "react";
import { Treemap as TreemapChartRechart } from "recharts";

export const TreemapChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      data: {
        name: string;
        children: {}[];
      }[];
      treemap: {
        key: string;
        stroke?: string;
        fill?: string;
      };
      chartWidth: number;
      chartHeight: number;
    };
    className?: string;
  }
>((props, ref) => {
  // REFERENCE: https://recharts.org/en-US/api/Treemap
  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <TreemapChartRechart
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        data={props.custom.data}
        dataKey={props.custom.treemap.key}
        stroke={props.custom.treemap.stroke}
        fill={props.custom.treemap.fill}
      ></TreemapChartRechart>
    </div>
  );
});

export default TreemapChart;
