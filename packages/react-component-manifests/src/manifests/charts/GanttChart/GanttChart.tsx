import React, { forwardRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  convertTasksToRechartsData,
  noLine,
  CustomizedDot,
} from "./components";

export const GanttChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      cartesianGrid?: { show?: boolean; strokeDasharray?: string };
      data: {
        [key: string]: number | string | Date;
      }[];
      options?: {
        margin?: {
          top: number;
          right: number;
          left: number;
          bottom: number;
        };
      };
      toolTip?: { show?: boolean };
      legend?: { show?: boolean };
      keys?: { value?: string };
      xAxis?: { show?: boolean; key?: string; type?: "category" | "number" };
      yAxis?: { show?: boolean; type?: "category" | "number" };
      chartWidth: number;
      chartHeight: number;
    };
    className?: string;
  }
>((props, ref) => {
  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <LineChart
        layout="vertical"
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        data={convertTasksToRechartsData(props.custom.data)}
        margin={{ ...props.custom.options?.margin }}
      >
        {props.custom.cartesianGrid?.show && (
          <CartesianGrid
            strokeDasharray={props.custom.cartesianGrid?.strokeDasharray}
          />
        )}
        {props.custom.xAxis?.show && <XAxis type={props.custom.xAxis?.type} />}
        {props.custom.yAxis?.show && (
          <YAxis
            dataKey={props.custom.xAxis?.key}
            type={props.custom.yAxis?.type}
          />
        )}
        {props.custom.toolTip?.show && <Tooltip />}
        <Line
          dataKey="value"
          type={noLine}
          dot={<CustomizedDot cx={0} cy={0} payload={{}} />}
          activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
});

export default GanttChart;
