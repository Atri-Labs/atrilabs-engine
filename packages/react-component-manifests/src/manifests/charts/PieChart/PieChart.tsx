import React, { forwardRef, useMemo } from "react";
import { PieChart as PieChartRechart, Pie, Tooltip, Legend } from "recharts";
import { getColorAt } from "../utils/colors";

export const PieChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      data:
        | {
            [key: string]: string | number;
          }[]
        | {
            [key: string]: string | number;
          }[][];
      options?: {
        cx?: string;
        cy?: string;
        outerRadius?: number | string;
        innerRadius?: number | string;
        fill?: string;
        showLabel?: boolean;
        animate?: boolean;
      }[];
      toolTip?: { show?: boolean };
      legend?: { show?: boolean };
      keys?: { value?: string };
      chartWidth: number;
      chartHeight: number;
    };
    className?: string;
  }
>((props, ref) => {
  const valueKey = useMemo(() => {
    return props.custom.keys?.value || "value";
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
      <PieChartRechart
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        data={props.custom.data}
      >
        {props.custom.toolTip?.show ? <Tooltip /> : null}
        {props.custom.legend?.show ? <Legend /> : null}
        {reshapedData.map((data, index) => {
          const fillColor =
            props.custom.options?.[index]?.fill || getColorAt(index);
          return (
            <Pie
              key={index}
              data={data}
              dataKey={valueKey}
              fill={fillColor}
              isAnimationActive={props.custom.options?.[index]?.animate}
              cx={props.custom?.options?.[index]?.cx}
              cy={props.custom?.options?.[index]?.cy}
              innerRadius={props.custom?.options?.[index]?.innerRadius}
              outerRadius={props.custom?.options?.[index]?.outerRadius}
              label={props.custom?.options?.[index]?.showLabel}
            />
          );
        })}
      </PieChartRechart>
    </div>
  );
});

export default PieChart;
