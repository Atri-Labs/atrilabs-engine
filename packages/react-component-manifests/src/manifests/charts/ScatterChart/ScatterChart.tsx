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
      zAxis?: { show?: boolean; key?: string; name?: string; unit?: string };
    };
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
    <div ref={ref} style={{ display: "inline-block" }}>
      <ScatterChartRechart
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
          />
        ) : null}
        {props.custom.toolTip?.show ? <Tooltip /> : null}
        {props.custom.legend?.show ? <Legend /> : null}
        {reshapedData.map((data, index) => {
          return (
            <Scatter
              key={index}
              data={data}
              type={props.custom.options?.[index]?.type}
              stroke={props.custom.options?.[index]?.stroke}
              fill={props.custom.options?.[index]?.fill}
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
        { x: 100, y: 200, z: 200 },
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
    return { ...props.custom, data, options };
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
  backgroundOptions: false,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    data: "array",
    options: "array",
    toolTip: "map",
    legend: "map",
    xAxis: "map",
    yAxis: "map",
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
  panel: { comp: CommonIcon, props: { name: "Scatter" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Scatter", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
