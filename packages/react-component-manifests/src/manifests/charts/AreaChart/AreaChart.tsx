import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import {
  AreaChart as AreaChartRechart,
  CartesianGrid,
  YAxis,
  XAxis,
  Area,
  Tooltip,
  Legend,
} from "recharts";

export const AreaChart = forwardRef<
  HTMLDivElement,
  {
    custom: {
      width: number;
      height: number;
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

  return (
    <div ref={ref} style={{ display: "inline-block" }}>
      <AreaChartRechart
        width={props.custom.width}
        height={props.custom.height}
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
        {props.custom.data.length > 0
          ? Object.keys(props.custom.data[0])
              .filter((key) => key !== xAxisKey)
              .sort((a, b) => {
                if (areOrderProvided) {
                  return (
                    props.custom.options![a]!.order! -
                    props.custom.options![b]!.order!
                  );
                }
                return a < b ? -1 : 0;
              })
              .map((key) => {
                return (
                  <Area
                    key={key}
                    dataKey={key}
                    stackId="1"
                    type={props.custom.options?.[key]?.type}
                    stroke={props.custom.options?.[key]?.stroke}
                    fill={props.custom.options?.[key]?.fill}
                    isAnimationActive={props.custom.options?.[key]?.animate}
                  />
                );
              })
          : null}
      </AreaChartRechart>
    </div>
  );
});

export const DevBarChart: typeof AreaChart = forwardRef((props, ref) => {
  props.custom.data = [
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
  props.custom.options = {
    uv: { animate: false },
    pv: { animate: false },
    amt: { animate: false },
  };
  return <AreaChart {...props} ref={ref} />;
});

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
  meta: { key: "AreaChart", category: "Data" },
  render: {
    comp: AreaChart,
  },
  dev: {
    comp: DevBarChart,
    decorators: [],
    attachProps: {
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          width: 400,
          height: 400,
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
  panel: { comp: CommonIcon, props: { name: "AreaChart" } },
  drag: {
    comp: CommonIcon,
    props: { name: "AreaChart", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
