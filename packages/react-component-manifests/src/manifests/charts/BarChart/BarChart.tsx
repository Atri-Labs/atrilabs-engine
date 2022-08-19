import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import {
  BarChart as BarChartRechart,
  CartesianGrid,
  YAxis,
  XAxis,
  Bar,
  Tooltip,
  Legend,
} from "recharts";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import Color from "color";
import { getColorAt } from "../utils/colors";
import { ReactComponent as Icon } from "./icon.svg";

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
    };
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
    <div ref={ref} style={{ display: "inline-block", ...props.styles }}>
      <BarChartRechart
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
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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

export const DevBarChart: typeof BarChart = forwardRef((props, ref) => {
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

  return <BarChart {...props} ref={ref} custom={custom} />;
});

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
    cartesianGrid: "map",
    data: "array",
    options: "map",
    toolTip: "map",
    legend: "map",
    xAxis: "map",
    yAxis: "map",
    stacked: "boolean",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "BarChart", category: "Data" },
  render: {
    comp: BarChart,
  },
  dev: {
    comp: DevBarChart,
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
          xAxis: { show: true, key: "x" },
          yAxis: { show: true },
          toolTip: { show: true },
          legend: { show: true },
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
  panel: { comp: CommonIcon, props: { name: "Bar", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Bar", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
