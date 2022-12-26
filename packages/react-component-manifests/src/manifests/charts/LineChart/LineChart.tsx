import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import {
  LineChart as LineChartRechart,
  CartesianGrid,
  YAxis,
  XAxis,
  Line,
  Tooltip,
  Legend,
} from "recharts";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { getColorAt } from "../utils/colors";
import Color from "color";
import { ReactComponent as Icon } from "./icon.svg";

export const LineChart = forwardRef<
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
      xAxis?: { show?: boolean; key?: string };
      yAxis?: { show?: boolean };
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
      <LineChartRechart
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
        {props.custom.yAxis?.show ? <YAxis /> : null}
        {props.custom.toolTip?.show ? <Tooltip /> : null}
        {props.custom.legend?.show ? <Legend /> : null}
        {sortedKeys.map((key, index) => {
          const fillColor =
            props.custom.options?.[key]?.fill || getColorAt(index);
          const strokeColor =
            props.custom.options?.[key]?.stroke ||
            Color(fillColor).darken(0.3).hex();
          return (
            <Line
              key={key}
              dataKey={key}
              type={props.custom.options?.[key]?.type}
              stroke={strokeColor}
              fill={fillColor}
              isAnimationActive={props.custom.options?.[key]?.animate}
            />
          );
        })}
      </LineChartRechart>
    </div>
  );
});

export const DevLineChart: typeof LineChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = [
      {
        x: "Page A",
        uv: 4000,
        pv: 2400,
        amt: 2400,
      },
      {
        x: "Page B",
        uv: 3000,
        pv: 1398,
        amt: 2210,
      },
      {
        x: "Page C",
        uv: 2000,
        pv: 9800,
        amt: 2290,
      },
      {
        x: "Page D",
        uv: 2780,
        pv: 3908,
        amt: 2000,
      },
      {
        x: "Page E",
        uv: 1890,
        pv: 4800,
        amt: 2181,
      },
      {
        x: "Page F",
        uv: 2390,
        pv: 3800,
        amt: 2500,
      },
      {
        x: "Page G",
        uv: 3490,
        pv: 4300,
        amt: 2100,
      },
    ];
    const options = {
      uv: { animate: false },
      pv: { animate: false },
      amt: { animate: false },
    };
    return { ...props.custom, data: data, options };
  }, [props.custom]);

  return <LineChart {...props} ref={ref} custom={custom} />;
});

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
    options: {
      type: "variable_key_map",
      attributes: [
        { fieldName: "stroke", type: "text" },
        { fieldName: "fill", type: "text" },
        { fieldName: "type", type: "text" },
        { fieldName: "animate", type: "boolean" },
        { fieldName: "order", type: "number" },
      ],
    },
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
      attributes: [{ fieldName: "show", type: "boolean" }],
    },
    chartHeight: { type: "number" },
    chartWidth: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "LineChart", category: "Data" },
  render: {
    comp: LineChart,
  },
  dev: {
    comp: DevLineChart,
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
          yAxis: { show: true },
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
  panel: { comp: CommonIcon, props: { name: "Line", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Line", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
