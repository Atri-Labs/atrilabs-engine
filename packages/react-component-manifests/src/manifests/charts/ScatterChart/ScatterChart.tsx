import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import {
  ScatterChart as ScatterChartRechart,
  CartesianGrid,
  YAxis,
  XAxis,
  ZAxis,
  Scatter,
  Tooltip,
  Legend,
} from "recharts";
import type { SymbolType } from "recharts/types/util/types";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { getColorAt } from "../utils/colors";
import { ReactComponent as Icon } from "./icon.svg";

export const ScatterChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      cartesianGrid?: { show?: boolean; strokeDasharray?: string };
      data:
        | {
            [key: string]: number;
          }[]
        | {
            [key: string]: number;
          }[][];
      options?: {
        name?: string;
        stroke?: string;
        fill?: string;
        type?: string;
        animate?: boolean;
        order?: number;
        shape?: SymbolType;
      }[];
      toolTip?: { show?: boolean };
      legend?: { show?: boolean };
      xAxis?: { show?: boolean; key?: string; name?: string; unit?: string };
      yAxis?: { show?: boolean; key?: string; name?: string; unit?: string };
      zAxis?: {
        show?: boolean;
        key?: string;
        name?: string;
        unit?: string;
        range?: [number, number];
      };
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

  const zAxisKey = useMemo(() => {
    return props.custom.zAxis?.key || "z";
  }, [props.custom]);

  const zAxisRange = useMemo(() => {
    return props.custom.zAxis?.range || [50, 200];
  }, [props.custom]);

  const reshapedData = useMemo(() => {
    if (
      Array.isArray(props.custom.data) &&
      !Array.isArray(props.custom.data[0])
    ) {
      return [props.custom.data] as {
        [key: string]: number;
      }[][];
    }
    return props.custom.data as {
      [key: string]: number;
    }[][];
  }, [props.custom]);

  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <ScatterChartRechart
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        data={props.custom.data}
      >
        {props.custom.cartesianGrid?.show ? (
          <CartesianGrid
            strokeDasharray={props.custom.cartesianGrid?.strokeDasharray}
          />
        ) : null}
        {props.custom.xAxis?.show ? (
          <XAxis
            dataKey={xAxisKey}
            type="number"
            name={props.custom.xAxis.name}
            unit={props.custom.xAxis.unit}
          />
        ) : null}
        {props.custom.yAxis?.show ? (
          <YAxis
            dataKey={yAxisKey}
            type="number"
            name={props.custom.yAxis.name}
            unit={props.custom.yAxis.unit}
          />
        ) : null}
        {props.custom.zAxis?.show ? (
          <ZAxis
            dataKey={zAxisKey}
            type="number"
            name={props.custom.zAxis.name}
            unit={props.custom.zAxis.unit}
            range={zAxisRange}
          />
        ) : null}
        {props.custom.toolTip?.show ? <Tooltip /> : null}
        {props.custom.legend?.show ? <Legend /> : null}
        {reshapedData.map((data, index) => {
          const fillColor =
            props.custom.options?.[index]?.fill || getColorAt(index);
          const strokeColor =
            props.custom.options?.[index]?.stroke || fillColor;
          return (
            <Scatter
              key={index}
              data={data}
              type={props.custom.options?.[index]?.type}
              stroke={strokeColor}
              fill={fillColor}
              isAnimationActive={props.custom.options?.[index]?.animate}
              name={props.custom.options?.[index]?.name}
              shape={props.custom.options?.[index]?.shape}
            />
          );
        })}
      </ScatterChartRechart>
    </div>
  );
});

export const DevBarChart: typeof ScatterChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = [
      [
        { x: 100, y: 200, z: 400 },
        { x: 120, y: 100, z: 260 },
        { x: 170, y: 300, z: 400 },
        { x: 140, y: 250, z: 280 },
        { x: 150, y: 400, z: 500 },
        { x: 110, y: 280, z: 200 },
      ],
      [
        { x: 200, y: 260, z: 240 },
        { x: 240, y: 290, z: 220 },
        { x: 190, y: 290, z: 250 },
        { x: 198, y: 250, z: 210 },
        { x: 180, y: 280, z: 260 },
        { x: 210, y: 220, z: 230 },
      ],
    ];
    const options = [
      { name: "pv", shape: "circle" as SymbolType, animate: false },
      { name: "uv", shape: "cross" as SymbolType, animate: false },
    ];

    return {
      ...props.custom,
      data,
      options,
      zAxis: { range: [50, 200] as [number, number], show: true },
    };
  }, [props.custom]);

  return <ScatterChart {...props} ref={ref} custom={custom} />;
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
        { fieldName: "show", type: "text" },
        { fieldName: "strokeDasharray", type: "text" },
      ],
    },
    data: { type: "array" },
    options: {
      type: "array_map",
      attributes: [
        { fieldName: "name", type: "text" },
        { fieldName: "stroke", type: "text" },
        { fieldName: "fill", type: "boolean" },
        { fieldName: "type", type: "text" },
        { fieldName: "animate", type: "boolean" },
        { fieldName: "order", type: "number" },
        {
          fieldName: "shape",
          type: "enum",
          options: [
            "circle",
            "cross",
            "diamond",
            "square",
            "star",
            "triangle",
            "wye",
          ],
        },
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
        { fieldName: "name", type: "text" },
        { fieldName: "unit", type: "text" },
      ],
    },
    yAxis: {
      type: "map",
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "key", type: "text" },
        { fieldName: "name", type: "text" },
        { fieldName: "unit", type: "text" },
      ],
    },
    zAxis: {
      type: "map",
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "key", type: "text" },
        { fieldName: "name", type: "text" },
        { fieldName: "unit", type: "text" },
        { fieldName: "range", type: "number" },
      ],
    },
    chartHeight: { type: "number" },
    chartWidth: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "ScatterChart", category: "Data" },
  render: {
    comp: ScatterChart,
  },
  dev: {
    comp: DevBarChart,
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
  panel: { comp: CommonIcon, props: { name: "Scatter", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Scatter", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
