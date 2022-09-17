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
    Tooltip
} from "recharts";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import Color from "color";
import { getColorAt } from "../utils/colors";


export const RadialBarChart = forwardRef<
    HTMLDivElement,
    {
        styles: React.CSSProperties;
        custom: {                        
            data: {
                [key: string]: number | string | number[];
            }[];          
            width:string;
            height:string;
            startAngle: number;
            endAngle: number;
            minAngle:number;
            toolTip: boolean;
            legend: boolean;            
        };
    }
>((props, ref) => {
    

    
    console.log(props,"props")

    return (
        <div ref={ref} style={{ display: "inline-block", ...props.styles }}>
            <RadialBarChartRechart
                width={
                    typeof props.custom.width === "string"
                        ? parseInt(props.custom.width)
                        : props.custom.width
                }
                height={
                    typeof props.custom.height === "string"
                        ? parseInt(props.custom.height)
                        : props.custom.height
                }
                innerRadius={"10%"}
                outerRadius={"80%"}
                margin={{ top: 5, right: 0, left: 0, bottom: 80 }}
                data={props.custom.data}
                startAngle={props.custom.startAngle} 
                endAngle={props.custom.endAngle}
            >
                <RadialBar minAngle={props.custom.minAngle} label={{ fill: '#666', position:'insideStart' }} background clockWise={true} dataKey='uv' />
                {props.custom.legend?<Legend   width={120} height={140} layout='vertical' verticalAlign='middle' align="left"/>:<></>}
                {props.custom.toolTip?<Tooltip />:<></>}
            </RadialBarChartRechart>
        </div>
    );
});

export const DevRadialBarChart: typeof RadialBarChart = forwardRef((props, ref) => {
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
        
        return { ...props.custom, data: data };
    }, [props.custom]);

    return <RadialBarChart {...props} ref={ref} custom={custom} />;
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
        data: "array",          
        startAngle: "number",
        endAngle: "number",
        minAngle:"number",
        toolTip:"boolean", 
        legend:"boolean",           
        
    },
};

const compManifest: ReactComponentManifestSchema = {
    meta: { key: "RadialBarChart", category: "Data" },
    render: {
        comp: RadialBarChart,
    },
    dev: {
        comp: DevRadialBarChart,
        decorators: [],
        attachProps: {
            styles: {
                treeId: CSSTreeId,
                initialValue: {
                    width: "400px",
                    height: "400px",
                },
                treeOptions: cssTreeOptions,
                canvasOptions: { groupByBreakpoint: true },
            },
            custom: {
                treeId: CustomTreeId,
                initialValue: {
                    data: [],  
                    width: "400px",
                    height: "400px",   
                    minAngle:15,                   
                    startAngle: 180,
                    endAngle: 0,
                    toolTip: true,
                    legend:  true,
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
    panel: { comp: CommonIcon, props: { name: "RadialBarChart" } },
    drag: {
        comp: CommonIcon,
        props: { name: "RadialBarChart", containerStyle: { padding: "1rem" } },
    },
    renderSchema: compManifest,
};

export default {
    manifests: {
        [reactSchemaId]: [compManifest],
        [iconSchemaId]: [iconManifest],
    },
};
