import React, { forwardRef, useMemo } from "react";
import {
  ComposedChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Bar,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { getColorAt } from "../utils/colors";
import Color from "color";

export const HistogramChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      cartesianGrid?: { show?: boolean; strokeDasharray?: string };
      // row-wise data
      data: {
        [key: string]: number;
      }[];
      // options for each bar
      options?: {
        line?: {
          stroke?: string;
          animate?: boolean;
          type?: string;
          strokeWidth?: number;
          hide?: boolean;
        };
        bar?: {
          fill?: string;
          stroke?: string;
          animate?: boolean;
          hide?: boolean;
        };
      };
      toolTip?: { show?: boolean };
      legend?: { show?: boolean };
      xAxis?: { show?: boolean; key?: string };
      yAxis?: { show?: boolean; key?: string };
      chartWidth: number;
      chartHeight: number;
    };
    className?: string;
  }
>((props, ref) => {
  const xAxisKey = useMemo(() => {
    return props.custom.xAxis?.key || "x";
  }, [props.custom]);

  const yAxisKey = useMemo(() => {
    return props.custom.yAxis?.key || "y";
  }, [props.custom]);

  const bar = useMemo(() => {
    const fillColor = props.custom.options?.bar?.fill || getColorAt(1);
    return {
      ...props.custom.options?.bar,
      fill: fillColor,
      stroke: props.custom.options?.bar?.stroke || fillColor,
      hide: props.custom.options?.bar?.hide || false,
    };
  }, [props.custom]);

  const line = useMemo(() => {
    const strokeColor =
      props.custom.options?.line?.stroke || Color(bar.fill).darken(0.4).hex();
    return {
      ...props.custom.options?.line,
      stroke: strokeColor,
      hide: props.custom.options?.bar?.hide || false,
    };
  }, [props.custom, bar]);

  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <ComposedChart
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        data={props.custom.data}
        barGap={0}
        barCategoryGap={0}
      >
        {props.custom.cartesianGrid?.show ? (
          <CartesianGrid
            strokeDasharray={props.custom.cartesianGrid?.strokeDasharray}
          />
        ) : null}
        {props.custom.xAxis?.show ? (
          <XAxis
            dataKey={xAxisKey}
            type={"number"}
            padding={{ left: 40, right: 40 }}
          />
        ) : null}
        {props.custom.yAxis?.show ? <YAxis /> : null}
        {props.custom.toolTip?.show ? <Tooltip /> : null}
        {props.custom.legend?.show ? <Legend /> : null}

        {bar.hide ? null : (
          <Bar
            dataKey={yAxisKey}
            stroke={bar.stroke}
            fill={bar.fill}
            isAnimationActive={bar.animate}
          />
        )}
        {line.hide ? null : (
          <Line
            type={props.custom.options?.line?.type}
            dataKey={yAxisKey}
            stroke={line.stroke}
            isAnimationActive={line.animate}
            strokeWidth={line.strokeWidth}
          />
        )}
      </ComposedChart>
    </div>
  );
});

export default HistogramChart;
