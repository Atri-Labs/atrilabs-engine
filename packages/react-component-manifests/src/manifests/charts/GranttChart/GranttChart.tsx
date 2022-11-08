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
import { getColorAt } from "../utils/colors";
import { ReactComponent as Icon } from "../PieChart/icon.svg";
export const GranttChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      cartesianGrid?: { show?: boolean; strokeDasharray?: string };
      data: {
        [key: string]: number | string | Date;
      }[];
      options?: {
        [key: string]: {
          height?: number;
          width?: number;
          margin?: {
            [key: string]: {
              top: number;
              right: number;
              left: number;
              bottom: number;
            };
          };
        };
      };
      toolTip?: { show?: boolean };
      legend?: { show?: boolean };
      keys?: { value?: string };
      xAxis?: { show?: boolean; key?: string; type?: string };
      yAxis?: { show?: boolean; type?: string };
      chartWidth: number;
      chartHeight: number;
    };
    className?: string;
  }
>((props, ref) => {
  function convertTasksToRechartsData(tasks: any) {
    const minTimestamp = tasks[0].startDate.valueOf();
    return tasks.map((task: any) => {
      const startTimestamp = task.startDate.getTime();
      const duration = task.endDate.valueOf() - startTimestamp;
      return {
        ...task,
        value: startTimestamp - minTimestamp + duration / 2,
      };
    });
  }

  const noLine = () => ({
    lineStart() {},
    lineEnd() {},
    point(x: number, y: number) {},
  });
  const CustomizedDot = (props: {
    cx: number;
    cy: number;
    height: number;
    width: number;
    payload: {
      startDate: string;
      endDate: string;
      name: string;
      status: "RUNNING" | "FAILED";
      value: number;
    };
  }) => {
    const { cx, cy, height, width, payload: task } = props;
    return (
      <rect
        width={width}
        height={height}
        x={cx - width / 2}
        y={cy - height / 2}
        fill={task.status === "FAILED" ? "red" : "green"}
      />
    );
  };
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
        margin={{ ...props.custom.options.margin }}
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
          dot={<CustomizedDot {...props.custom.options} />}
          activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
});

export const DevPieChart: typeof GranttChart = forwardRef((props, ref) => {
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
      height: 16,
      width: 80,
      margin: {
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      },
    };
    return { ...props.custom, data, options };
  }, [props.custom]);

  return <GranttChart {...props} ref={ref} custom={custom} />;
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
    data: { type: "array" },
    options: { type: "array" },
    toolTip: { type: "map" },
    legend: { type: "map" },
    keys: { type: "map" },
    chartHeight: { type: "number" },
    chartWidth: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "GranttChart", category: "Data" },
  render: {
    comp: GranttChart,
  },
  dev: {
    comp: DevPieChart,
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
  panel: { comp: CommonIcon, props: { name: "Grantt", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Grantt", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
