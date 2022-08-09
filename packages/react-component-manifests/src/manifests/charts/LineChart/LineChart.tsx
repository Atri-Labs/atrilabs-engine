import React, { forwardRef } from "react";
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

export const LineChart = forwardRef<
  HTMLDivElement,
  {
    custom: {
      width: number;
      height: number;
      series: {
        name: string;
        data: { category: string | number; value: number }[];
        color?: string;
        type?: string;
        animate?: boolean;
      }[];
    };
  }
>((props, ref) => {
  return (
    <div ref={ref}>
      <LineChartRechart
        width={props.custom.width}
        height={props.custom.height}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"category"} allowDuplicatedCategory={false} />
        <YAxis dataKey={"value"} />
        <Tooltip />
        <Legend />
        {props.custom.series.map((s) => {
          return (
            <Line
              type={s.type || "linear"}
              dataKey={"value"}
              data={s.data}
              name={s.name}
              key={s.name}
              stroke={s.color || "#8884d8"}
              isAnimationActive={s.animate}
            />
          );
        })}
      </LineChartRechart>
    </div>
  );
});

export const DevLineChart: typeof LineChart = forwardRef((props, ref) => {
  props.custom.series = [
    {
      name: "Series 1",
      data: [
        { category: "A", value: 2400 },
        { category: "B", value: 1398 },
        { category: "C", value: 9800 },
        { category: "D", value: 3908 },
        { category: "E", value: 4800 },
        { category: "F", value: 3800 },
        { category: "G", value: 4300 },
      ],
      color: "#8884d8",
      type: "monotone",
      animate: false,
    },
  ];
  return <LineChart {...props} ref={ref} />;
});

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    width: "number",
    height: "number",
    series: "array",
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
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          width: 400,
          height: 400,
          series: [],
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
  panel: { comp: CommonIcon, props: { name: "LineChart" } },
  drag: {
    comp: CommonIcon,
    props: { name: "LineChart", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
