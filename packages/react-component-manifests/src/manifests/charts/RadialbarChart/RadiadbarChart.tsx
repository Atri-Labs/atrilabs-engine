import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import {
  RadialBarChart as RadialBarChartRechart,
  RadialBar,
  Legend,
} from "recharts";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { ReactComponent as Icon } from "./icon.svg";
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
      innerRadius?: number;
      barSize?: number;
      radialBar?: {
        show?: boolean;
        key: string;
        options?: {
          [key: string]: {
            position?: string;
            fill?: string;
          };
        };
      };
      chartWidth: number;
      chartHeight: number;
    };
    className?: string;
  }
>((props, ref) => {
  const modifiedData = useMemo(() => {
    // add colors to the data points
    return props.custom.data.map((item, index) => {
      return (props.custom.data[index] = {
        ...props.custom.data[index],
        fill: getColorAt(index),
      });
    });
  }, [props.custom]);
  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <RadialBarChartRechart
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        innerRadius={props.custom.innerRadius}
        barSize={props.custom.barSize}
        data={modifiedData}
      >
        {props.custom.legend?.show && <Legend />}
        {props.custom.radialBar?.show && (
          <RadialBar
            label={{ ...props.custom.radialBar.options }}
            dataKey={props.custom.radialBar.key}
          />
        )}
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
        },
        {
          name: "B",
          uv: 26.69,
        },
        {
          name: "C",
          uv: 15.69,
        },
        {
          name: "D",
          uv: 8.22,
        },
        {
          name: "E",
          uv: 8.63,
        },
        {
          name: "F",
          uv: 2.63,
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
        { fieldName: "show", type: "text" },
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
    radialBar: {
      type: "map",
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "key", type: "text" },
      ],
    },
    innerRadius: { type: "number" },
    barSize: { type: "number" },
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
          legend: { show: true },
          chartHeight: 400,
          chartWidth: 400,
          radialBar: {
            show: true,
            key: "uv",
            options: {
              position: "insideStart",
              fill: "#fff",
            },
          },
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
