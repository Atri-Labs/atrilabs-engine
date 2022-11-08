import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import Color from "color";
import {
  RadialBarChart as RadialBarChartRechart,
  RadialBar,
  Legend,
  Tooltip,
} from "recharts";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { ReactComponent as Icon } from "../PieChart/icon.svg";
import { getColorAt } from "../utils/colors";
export const RadialbarChart = forwardRef<
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
  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <RadialBarChartRechart
        width={500}
        height={500}
        cx={350}
        cy={200}
        innerRadius={20}
        outerRadius={140}
        barSize={20}
        data={props.custom.data}
      >
        <RadialBar
          label={{ position: "insideStart", fill: "#fff" }}
          background
          dataKey="uv"
        />
        {/* <Legend
          iconSize={10}
          width={120}
          height={140}
          layout="vertical"
          verticalAlign="middle"
          align="right"
        /> */}
        <Tooltip />
      </RadialBarChartRechart>
    </div>
  );
});

export const DevRadialbarChart: typeof RadialbarChart = forwardRef(
  (props, ref) => {
    const custom = useMemo(() => {
      const data = [
        {
          name: "A",
          uv: 31.47,
          pv: 2400,
          fill: "#8884d8",
        },
        {
          name: "B",
          uv: 26.69,
          pv: 4567,
          fill: "#83a6ed",
        },
        {
          name: "C",
          uv: 15.69,
          pv: 1398,
          fill: "#8dd1e1",
        },
        {
          name: "D",
          uv: 8.22,
          pv: 9800,
          fill: "#82ca9d",
        },
        {
          name: "E",
          uv: 8.63,
          pv: 3908,
          fill: "#a4de6c",
        },
        {
          name: "F",
          uv: 2.63,
          pv: 4800,
          fill: "#d0ed57",
        },
      ];
      const options = {
        uv: { animate: false },
        pv: { animate: false },
        amt: { animate: false },
      };
      return { ...props.custom, data: data, options };
    }, [props.custom]);

    return <RadialbarChart {...props} ref={ref} custom={custom} />;
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
    cartesianGrid: { type: "map" },
    data: { type: "array" },
    options: { type: "map" },
    toolTip: { type: "map" },
    legend: { type: "map" },
    xAxis: { type: "map" },
    yAxis: { type: "map" },
    chartHeight: { type: "number" },
    chartWidth: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "RadialbarChart", category: "Data" },
  render: {
    comp: RadialbarChart,
  },
  dev: {
    comp: DevRadialbarChart,
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
  panel: { comp: CommonIcon, props: { name: "Radialbar", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: {
      name: "Radialbar",
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
