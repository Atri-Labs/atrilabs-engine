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
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { getColorAt } from "../utils/colors";
import Color from "color";
import { ReactComponent as Icon } from "./icon.svg";

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

export const DevHistogramChart: typeof HistogramChart = forwardRef(
  (props, ref) => {
    const custom = useMemo(() => {
      const data = [
        {
          x: 0,
          y: 4000,
        },
        {
          x: 1,
          y: 3000,
        },
        {
          x: 2,
          y: 2000,
        },
        {
          x: 3,
          y: 2780,
        },
        {
          x: 4,
          y: 1890,
        },
        {
          x: 5,
          y: 2390,
        },
        {
          x: 6,
          y: 3490,
        },
        {
          x: 7,
          y: 3000,
        },
        {
          x: 8,
          y: 2990,
        },
        {
          x: 9,
          y: 2590,
        },
        {
          x: 10,
          y: 2090,
        },
        {
          x: 11,
          y: 1890,
        },
        {
          x: 12,
          y: 1690,
        },
      ];
      const options = {
        line: { ...props.custom.options?.line, animate: false },
        bar: { ...props.custom.options?.bar, animate: false },
      };
      return { ...props.custom, data, options };
    }, [props.custom]);

    return <HistogramChart {...props} ref={ref} custom={custom} />;
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
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "key", type: "text" },
      ],
    },
    yAxis: {
      type: "map",
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "key", type: "text" },
      ],
    },
    chartHeight: { type: "number" },
    chartWidth: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "HistogramChart", category: "Data" },
  render: {
    comp: HistogramChart,
  },
  dev: {
    comp: DevHistogramChart,
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
          cartesianGrid: { show: true, strokeDasharray: "3" },

          xAxis: { show: true, key: "x" },
          yAxis: { show: true, key: "y" },
          options: { line: { type: "monotone", strokeWidth: 2 } },
          toolTip: { show: true },
          legend: { show: true },
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
  panel: { comp: CommonIcon, props: { name: "Histogram", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: {
      name: "Histogram",
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
