import React, { forwardRef } from "react";
import {
  ComposedChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Bar,
  Scatter,
  Tooltip,
} from "recharts";
import { CandleStickPlot } from "./types";
import { useCandleStickPlot } from "./useCandleStick";
import { DotBar, HorizonBar } from "./components";
import { getColorAt } from "../utils/colors";

export const CandleStick = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      cartesianGrid?: { show?: boolean; strokeDasharray?: string };
      data: CandleStickPlot[];
      options?: {
        animate?: boolean;
        dot?: {
          stroke?: string;
          fill?: string;
        };
        box?: {
          fill?: string;
        };
        whisker?: {
          fill?: string;
          stroke?: string;
          strokeWidth?: string;
          strokeDasharray?: string;
        };
      };
      toolTip?: { show?: boolean };
      legend?: { show?: boolean };
      xAxis?: { show?: boolean };
      yAxis?: { show?: boolean };
      chartWidth: number;
      chartHeight: number;
    };
    className?: string;
  }
>((props, ref) => {
  const candleStickData = useCandleStickPlot(props.custom.data);

  const whisker = {
    ...props.custom.options?.whisker,
    stroke: props.custom.options?.whisker?.stroke || getColorAt(0),
    fill: props.custom.options?.whisker?.fill || getColorAt(0),
  };

  const box = {
    ...props.custom.options?.box,
    fill: props.custom.options?.box?.fill || getColorAt(9),
  };

  const dot = {
    ...props.custom.options?.dot,
    stroke: props.custom.options?.dot?.stroke || getColorAt(3),
    fill: props.custom.options?.dot?.fill || getColorAt(3),
  };

  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <ComposedChart
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        data={candleStickData}
      >
        {props.custom.cartesianGrid?.show ? (
          <CartesianGrid
            strokeDasharray={props.custom.cartesianGrid?.strokeDasharray}
          />
        ) : null}
        {props.custom.xAxis?.show ? <XAxis dataKey={"name"} /> : null}
        {props.custom.yAxis?.show ? <YAxis /> : null}
        {props.custom.toolTip?.show ? <Tooltip /> : null}
        <Bar
          stackId={"a"}
          dataKey={"min"}
          fill={"none"}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"bar"}
          label={"min"}
          shape={<HorizonBar {...whisker} />}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"bottomWhisker"}
          label={""}
          shape={<DotBar {...whisker} />}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"bottomBox"}
          fill={box.fill}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"bar"}
          label={"median"}
          shape={<HorizonBar {...whisker} />}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"topBox"}
          fill={box.fill}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"topWhisker"}
          label={""}
          shape={<DotBar {...whisker} />}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"bar"}
          label={"max"}
          shape={<HorizonBar {...whisker} />}
          isAnimationActive={props.custom.options?.animate}
        />
        {/* <ZAxis type="number" dataKey="size" range={[0, 250]} /> */}

        <Scatter
          dataKey="average"
          fill={dot.fill}
          stroke={dot.stroke}
          isAnimationActive={props.custom.options?.animate}
        />
      </ComposedChart>
    </div>
  );
});

export default CandleStick;
