import React, { forwardRef, useMemo } from "react";
import {
  BarChart as BarChartRechart,
  CartesianGrid,
  YAxis,
  XAxis,
  Bar,
  Tooltip,
  Legend,
} from "recharts";
import Color from "color";
import { getColorAt } from "../utils/colors";

export const BarChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      cartesianGrid?: { show?: boolean; strokeDasharray?: string };
      // row-wise data
      data: {
        [key: string]: number | string | number[];
      }[];
      // options for each bar
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
      xAxis?: { show?: boolean; key?: string };
      yAxis?: { show?: boolean };
      // Bar Chart specific options
      stacked?: boolean;
      chartWidth: number;
      chartHeight: number;
    };
    className?: string;
  }
>((props, ref) => {
  const xAxisKey = useMemo(() => {
    return props.custom.xAxis?.key || "x";
  }, [props.custom]);

  const areOrderProvided = useMemo(() => {
    if (props.custom.data.length > 0) {
      const keys = Object.keys(props.custom.data[0]);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key === xAxisKey) continue;
        if (props.custom.options?.[key]?.order === undefined) {
          return false;
        }
      }
    }
    return true;
  }, [props.custom, xAxisKey]);
  const sortedKeys = useMemo(() => {
    if (props.custom.data.length > 0) {
      return Object.keys(props.custom.data[0])
        .filter((key) => key !== xAxisKey)
        .sort((a, b) => {
          if (areOrderProvided) {
            return (
              props.custom.options![a]!.order! -
              props.custom.options![b]!.order!
            );
          }
          return a < b ? -1 : 0;
        });
    }
    return [];
  }, [areOrderProvided, props.custom, xAxisKey]);

  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <BarChartRechart
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        data={props.custom.data}
      >
        {props.custom.cartesianGrid?.show ? (
          <CartesianGrid
            strokeDasharray={props.custom.cartesianGrid?.strokeDasharray}
          />
        ) : null}
        {props.custom.xAxis?.show ? <XAxis dataKey={xAxisKey} /> : null}
        {props.custom.yAxis?.show ? <YAxis width={40} /> : null}
        {props.custom.toolTip?.show ? <Tooltip /> : null}
        {props.custom.legend?.show ? <Legend /> : null}
        {sortedKeys.map((key, index) => {
          const fillColor =
            props.custom.options?.[key]?.fill || getColorAt(index);
          const strokeColor =
            props.custom.options?.[key]?.stroke ||
            Color(fillColor).darken(0.3).hex();
          return (
            <Bar
              key={key}
              dataKey={key}
              stackId={props.custom.stacked ? "1" : undefined}
              type={props.custom.options?.[key]?.type}
              stroke={strokeColor}
              fill={fillColor}
              isAnimationActive={props.custom.options?.[key]?.animate}
            />
          );
        })}
      </BarChartRechart>
    </div>
  );
});

export default BarChart;
