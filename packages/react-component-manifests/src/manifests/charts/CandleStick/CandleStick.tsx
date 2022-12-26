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
import { getColorAt } from "../utils/colors";
import { ReactComponent as Icon } from "./icon.svg";

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
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    cartesianGrid: {
      type: "map",
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "strokeDasharray", type: "text" },
      ],
    },
    data: { type: "array" },
    toolTip: {
      type: "map",
      attributes: [{ fieldName: "show", type: "boolean" }],
    },
    legend: {
      type: "map",
      attributes: [{ fieldName: "show", type: "boolean" }],
    },
    xAxis: {
      type: "map",
      attributes: [{ fieldName: "show", type: "boolean" }],
    },
    yAxis: {
      type: "map",
      attributes: [{ fieldName: "show", type: "boolean" }],
    },
    chartHeight: { type: "number" },
    chartWidth: { type: "number" },
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
        initialValue: {},
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          data: [],
          options: {
            whisker: {
              strokeWidth: "5",
              strokeDasharray: "5",
            },
          },
          toolTip: { show: true },
          legend: { show: true },
          xAxis: { show: true },
          yAxis: { show: true },
          chartHeight: 400,
          chartWidth: 400,
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
  panel: { comp: CommonIcon, props: { name: "Candle Stick", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: {
      name: "Candle Stick",
      containerStyle: { padding: "1rem" },
      svg: Icon,
    },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
