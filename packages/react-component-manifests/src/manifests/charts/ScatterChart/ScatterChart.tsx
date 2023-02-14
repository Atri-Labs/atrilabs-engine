import React, { forwardRef, useMemo } from "react";
import {
  ScatterChart as ScatterChartRechart,
  CartesianGrid,
  YAxis,
  XAxis,
  ZAxis,
  Scatter,
  Tooltip,
  Legend,
} from "recharts";
import type { SymbolType } from "recharts/types/util/types";
import { getColorAt } from "../utils/colors";

export const ScatterChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      cartesianGrid?: { show?: boolean; strokeDasharray?: string };
      data:
        | {
            [key: string]: number;
          }[]
        | {
            [key: string]: number;
          }[][];
      options?: {
        name?: string;
        stroke?: string;
        fill?: string;
        type?: string;
        animate?: boolean;
        order?: number;
        shape?: SymbolType;
      }[];
      toolTip?: { show?: boolean };
      legend?: { show?: boolean };
      xAxis?: { show?: boolean; key?: string; name?: string; unit?: string };
      yAxis?: { show?: boolean; key?: string; name?: string; unit?: string };
      zAxis?: {
        show?: boolean;
        key?: string;
        name?: string;
        unit?: string;
        range?: [number, number];
      };
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

  const zAxisKey = useMemo(() => {
    return props.custom.zAxis?.key || "z";
  }, [props.custom]);

  const zAxisRange = useMemo(() => {
    return props.custom.zAxis?.range || [50, 200];
  }, [props.custom]);

  const reshapedData = useMemo(() => {
    if (
      Array.isArray(props.custom.data) &&
      !Array.isArray(props.custom.data[0])
    ) {
      return [props.custom.data] as {
        [key: string]: number;
      }[][];
    }
    return props.custom.data as {
      [key: string]: number;
    }[][];
  }, [props.custom]);

  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <ScatterChartRechart
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        data={props.custom.data}
      >
        {props.custom.cartesianGrid?.show ? (
          <CartesianGrid
            strokeDasharray={props.custom.cartesianGrid?.strokeDasharray}
          />
        ) : null}
        {props.custom.xAxis?.show ? (
          <XAxis
            dataKey={xAxisKey}
            type="number"
            name={props.custom.xAxis.name}
            unit={props.custom.xAxis.unit}
          />
        ) : null}
        {props.custom.yAxis?.show ? (
          <YAxis
            dataKey={yAxisKey}
            type="number"
            name={props.custom.yAxis.name}
            unit={props.custom.yAxis.unit}
          />
        ) : null}
        {props.custom.zAxis?.show ? (
          <ZAxis
            dataKey={zAxisKey}
            type="number"
            name={props.custom.zAxis.name}
            unit={props.custom.zAxis.unit}
            range={zAxisRange}
          />
        ) : null}
        {props.custom.toolTip?.show ? <Tooltip /> : null}
        {props.custom.legend?.show ? <Legend /> : null}
        {reshapedData.map((data, index) => {
          const fillColor =
            props.custom.options?.[index]?.fill || getColorAt(index);
          const strokeColor =
            props.custom.options?.[index]?.stroke || fillColor;
          return (
            <Scatter
              key={index}
              data={data}
              type={props.custom.options?.[index]?.type}
              stroke={strokeColor}
              fill={fillColor}
              isAnimationActive={props.custom.options?.[index]?.animate}
              name={props.custom.options?.[index]?.name}
              shape={props.custom.options?.[index]?.shape}
            />
          );
        })}
      </ScatterChartRechart>
    </div>
  );
});

export default ScatterChart;
