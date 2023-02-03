import React, { forwardRef, useMemo } from "react";
import {
  RadialBarChart as RadialBarChartRechart,
  RadialBar,
  Legend,
} from "recharts";
import { getColorAt } from "../utils/colors";

export const RadialbarChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      cartesianGrid?: { show?: boolean; strokeDasharray?: string };
      data: {
        [key: string]: number | string;
      }[];
      options?: {
        [key: string]: {
          stroke?: string;
          fill?: string;
          type?: string;
          animate?: boolean;
          order?: number;
        };
      };
      toolTip?: { show?: boolean };
      legend?: { show?: boolean };
      innerRadius?: number;
      barSize?: number;
      radialBar?: {
        show?: boolean;
        key: string;
        options?: {
          [key: string]: {
            position?: string;
            fill?: string;
          };
        };
      };
      chartWidth: number;
      chartHeight: number;
    };
    className?: string;
  }
>((props, ref) => {
  const modifiedData = useMemo(() => {
    // add colors to the data points
    return props.custom.data.map((item, index) => {
      return (props.custom.data[index] = {
        ...props.custom.data[index],
        fill: getColorAt(index),
      });
    });
  }, [props.custom]);
  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <RadialBarChartRechart
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        innerRadius={props.custom.innerRadius}
        barSize={props.custom.barSize}
        data={modifiedData}
      >
        {props.custom.legend?.show && <Legend />}
        {props.custom.radialBar?.show && (
          <RadialBar
            label={{ ...props.custom.radialBar.options }}
            dataKey={props.custom.radialBar.key}
          />
        )}
      </RadialBarChartRechart>
    </div>
  );
});

export default RadialbarChart;
