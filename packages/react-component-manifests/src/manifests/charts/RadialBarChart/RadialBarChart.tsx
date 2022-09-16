import React, { forwardRef, useCallback, useMemo } from "react";
import {RadialBarChart as RadialBarChartRechart, RadialBar, Tooltip, Legend } from "recharts"
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import { CommonIcon } from "../../CommonIcon";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";

export const RadialBarChart = forwardRef<
    HTMLDivElement,
    {
    styles: React.CSSProperties;
    custom: {
      data:
        | {
            [key: string]: string | number;
          }[]
        | {
            [key: string]: string | number;
          }[][];
      options?: {
        outerRadius?: number | string;
        innerRadius?: number | string;
        fill?: string;
        showLabel?: boolean;
        animate?: boolean;
        startAngle?: number;
        endAngle?: number;
        position?: string;
      };
      toolTip?: { show?: boolean };
      legend?: { show?: boolean };
      keys?: { value?: string };
      };
    }>((props, ref)=>{
    return (
    <div ref={ref} style={{ display: "inline-block", ...props.styles }}>
        <RadialBarChartRechart
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
            startAngle={props.custom.options?.startAngle} 
            endAngle={props.custom.options?.endAngle}
            innerRadius={props.custom.options?.innerRadius}
            outerRadius={props.custom.options?.outerRadius}
        >
          
            <RadialBar isAnimationActive={props.custom.options?.animate} label={{ fill: props.custom.options?.fill, position:  props.custom.options?.position || "insideStart" }} background direction={"left"} dataKey='uv' />
            {props.custom.legend && <Legend/>}
            {props.custom.toolTip && <Tooltip />}
        </RadialBarChartRechart>
    </div>
    )
})

const DevRadialChart: typeof RadialBarChart = forwardRef((props, ref)=>{
    const custom = useMemo(() => {
        const data = [
            {
              "name": "18-24",
              "uv": 31.47,
              "pv": 2400,
              "fill": "#8884d8"
            },
            {
              "name": "25-29",
              "uv": 26.69,
              "pv": 4567,
              "fill": "#83a6ed"
            },
            {
              "name": "30-34",
              "uv": -15.69,
              "pv": 1398,
              "fill": "#8dd1e1"
            },
            {
              "name": "35-39",
              "uv": 8.22,
              "pv": 9800,
              "fill": "#82ca9d"
            },
            {
              "name": "40-49",
              "uv": -8.63,
              "pv": 3908,
              "fill": "#a4de6c"
            },
            {
              "name": "50+",
              "uv": -2.63,
              "pv": 4800,
              "fill": "#d0ed57"
            },
            {
              "name": "unknow",
              "uv": 6.67,
              "pv": 4800,
              "fill": "#ffc658"
            }
          ]
          
        const options = {
            innerRadius:"10%",
            outerRadius: "80%",
            showLabel: true,
            animate: false,
            startAngle: 180,
            endAngle: 0
        }
        
        return { ...props.custom, data, options };
      }, [props.custom]);

    return <RadialBarChart {...props} ref={ref} custom={custom} />;
}) 

const cssTreeOptions: CSSTreeOptions = {
    flexContainerOptions: false,
    flexChildOptions: false,
    positionOptions: true,
    typographyOptions: true,
    spacingOptions: false,
    sizeOptions: true,
    borderOptions: false,
    outlineOptions: true,
    backgroundOptions: true,
    miscellaneousOptions: true,

};

const customTreeOptions: CustomPropsTreeOptions = {
    dataTypes: {
        data: "array",
        options: "array",
        toolTip: "map",
        legend: "map",
        keys: "map",
    },
};

const compManifest: ReactComponentManifestSchema = {
    meta: { key: "RadialBarChart", category: "Data" },
    render: {
      comp: RadialBarChart,
    },
    dev: {
      comp: DevRadialChart,
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
    panel: { comp: CommonIcon, props: { name: "Radial Bar Chart" } },
    drag: {
        comp: CommonIcon,
        props: { name: "Radial Bar", containerStyle: { padding: "1rem" } },
    },
    renderSchema: compManifest,
};
  
export default {
    manifests: {
        [reactSchemaId]: [compManifest],
        [iconSchemaId]: [iconManifest],
    },
};