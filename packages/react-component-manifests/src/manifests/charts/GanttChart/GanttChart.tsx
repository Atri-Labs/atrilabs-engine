import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { ReactComponent as Icon } from "./icon.svg";
import {
  convertTasksToRechartsData,
  noLine,
  CustomizedDot,
} from "./components";

export const GanttChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      cartesianGrid?: { show?: boolean; strokeDasharray?: string };
      data: {
        [key: string]: number | string | Date;
      }[];
      options?: {
        margin?: {
          top: number;
          right: number;
          left: number;
          bottom: number;
        };
      };
      toolTip?: { show?: boolean };
      legend?: { show?: boolean };
      keys?: { value?: string };
      xAxis?: { show?: boolean; key?: string; type?: "category" | "number" };
      yAxis?: { show?: boolean; type?: "category" | "number" };
      chartWidth: number;
      chartHeight: number;
    };
    className?: string;
  }
>((props, ref) => {
  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <LineChart
        layout="vertical"
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        data={convertTasksToRechartsData(props.custom.data)}
        margin={{ ...props.custom.options?.margin }}
      >
        {props.custom.cartesianGrid?.show && (
          <CartesianGrid
            strokeDasharray={props.custom.cartesianGrid?.strokeDasharray}
          />
        )}
        {props.custom.xAxis?.show && <XAxis type={props.custom.xAxis?.type} />}
        {props.custom.yAxis?.show && (
          <YAxis
            dataKey={props.custom.xAxis?.key}
            type={props.custom.yAxis?.type}
          />
        )}
        {props.custom.toolTip?.show && <Tooltip />}
        <Line
          dataKey="value"
          type={noLine}
          dot={<CustomizedDot cx={0} cy={0} payload={{}} />}
          activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
});

export const DevGanttChart: typeof GanttChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = [
      {
        startDate: new Date("Sun Dec 09 01:36:45 EST 2012"),
        endDate: new Date("Sun Dec 09 02:36:45 EST 2012"),
        name: "A Job",
        status: "FAILED",
      },

      {
        startDate: new Date("Sun Dec 09 01:56:32 EST 2012"),
        endDate: new Date("Sun Dec 09 06:35:47 EST 2012"),
        name: "B Job",
        status: "RUNNING",
      },
      {
        startDate: new Date("Sun Dec 09 04:56:32 EST 2012"),
        endDate: new Date("Sun Dec 09 06:35:47 EST 2012"),
        name: "C Job",
        status: "RUNNING",
      },
    ];
    const options = {
      margin: {
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      },
    };
    return { ...props.custom, data, options };
  }, [props.custom]);
  return <GanttChart {...props} ref={ref} custom={custom} />;
});

const cssTreeOptions: CSSTreeOptions = {
  boxShadowOptions: true,
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
    options: { type: "array" },
    toolTip: {
      type: "map",
      attributes: [{ fieldName: "show", type: "boolean" }],
    },
    legend: {
      type: "map",
      attributes: [{ fieldName: "show", type: "boolean" }],
    },
    keys: {
      type: "map",
      attributes: [{ fieldName: "value", type: "text" }],
    },
    xAxis: {
      type: "map",
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "key", type: "text" },
        { fieldName: "type", type: "text" },
      ],
    },
    yAxis: {
      type: "map",
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "type", type: "text" },
      ],
    },
    chartHeight: { type: "number" },
    chartWidth: { type: "number" },
  },
};
const compManifest: ReactComponentManifestSchema = {
  meta: { key: "GanttChart", category: "Data" },
  render: {
    comp: GanttChart,
  },
  dev: {
    comp: DevGanttChart,
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
          xAxis: { show: true, key: "name", type: "number" },
          yAxis: { show: true, type: "category" },
          toolTip: { show: true },
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
  panel: { comp: CommonIcon, props: { name: "Gantt", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Gantt", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
// Source code for Granttchart : https://codesandbox.io/s/recharts-gantt-forked-dzqlox?file=/src/index.js:2033-2046
