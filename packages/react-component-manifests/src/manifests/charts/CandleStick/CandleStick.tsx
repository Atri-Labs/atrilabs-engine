import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
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
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";

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
    };
  }
>((props, ref) => {
  const candleStickData = useCandleStickPlot(props.custom.data);

  return (
    <div ref={ref} style={{ display: "inline-block" }}>
      <ComposedChart
        width={
          typeof props.styles.width === "string"
            ? parseInt(props.styles.width)
            : props.styles.width
        }
        height={
          typeof props.styles.height === "string"
            ? parseInt(props.styles.height)
            : props.styles.height
        }
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
          shape={<HorizonBar {...props.custom.options?.whisker} />}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"bottomWhisker"}
          shape={<DotBar {...props.custom.options?.whisker} />}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"bottomBox"}
          fill={props.custom.options?.box?.fill}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"bar"}
          shape={<HorizonBar {...props.custom.options?.whisker} />}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"topBox"}
          fill={props.custom.options?.box?.fill}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"topWhisker"}
          shape={<DotBar {...props.custom.options?.whisker} />}
          isAnimationActive={props.custom.options?.animate}
        />
        <Bar
          stackId={"a"}
          dataKey={"bar"}
          shape={<HorizonBar {...props.custom.options?.whisker} />}
          isAnimationActive={props.custom.options?.animate}
        />
        {/* <ZAxis type="number" dataKey="size" range={[0, 250]} /> */}

        <Scatter
          dataKey="average"
          fill={props.custom.options?.dot?.fill}
          stroke={props.custom.options?.dot?.stroke}
          isAnimationActive={props.custom.options?.animate}
        />
      </ComposedChart>
    </div>
  );
});

export const DevCandleStickChart: typeof CandleStick = forwardRef(
  (props, ref) => {
    const custom = useMemo(() => {
      const data = [
        {
          min: 100,
          lowerQuartile: 200,
          median: 250,
          upperQuartile: 450,
          max: 650,
          average: 150,
          name: "Page A",
        },
        {
          min: 200,
          lowerQuartile: 400,
          median: 600,
          upperQuartile: 700,
          max: 800,
          average: 550,
          name: "Page B",
        },
        {
          min: 0,
          lowerQuartile: 200,
          median: 400,
          upperQuartile: 600,
          max: 800,
          average: 400,
          name: "Page C",
        },
      ];
      const options = {
        ...props.custom.options,
        animate: false,
      };
      return { ...props.custom, data, options };
    }, [props.custom]);

    return <CandleStick {...props} ref={ref} custom={custom} />;
  }
);

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: false,
  flexChildOptions: false,
  positionOptions: false,
  typographyOptions: false,
  spacingOptions: false,
  sizeOptions: true,
  borderOptions: false,
  backgroundOptions: false,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    width: "number",
    height: "number",
    data: "array",
    options: "map",
    toolTip: "map",
    legend: "map",
    xAxis: "map",
    yAxis: "map",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "CandleStick", category: "Data" },
  render: {
    comp: CandleStick,
  },
  dev: {
    comp: DevCandleStickChart,
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: { width: "400px", height: "400px" },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          data: [],
          options: {
            whisker: {
              fill: "#0088FE",
              stroke: "#0088FE",
              strokeWidth: "5",
              strokeDasharray: "5",
            },
            box: {
              fill: "#00C49F",
            },
            dot: {
              fill: "#FFBB28",
            },
          },
          toolTip: { show: true },
          legend: { show: true },
          xAxis: { show: true },
          yAxis: { show: true },
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {},
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Candle Stick" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Candle Stick", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
