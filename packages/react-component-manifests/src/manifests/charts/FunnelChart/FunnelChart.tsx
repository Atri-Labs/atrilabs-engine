import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import {
  FunnelChart as FunnelChartRechart,
  Funnel,
  Legend,
  Tooltip,
} from "recharts";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import Color from "color";
import { getColorAt } from "../utils/colors";
import { ReactComponent as Icon } from "./icon.svg";

export const FunnelChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      //cartesianGrid?: { show?: boolean; strokeDasharray?: string };
      // row-wise data
      data: {
        [key: string]: number | string | number[];
      }[];
      // options for each funnel
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
      // xAxis?: { show?: boolean; key?: string };
      // yAxis?: { show?: boolean };
      // funnel Chart specific options
      // stacked?: boolean;
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

  const sortedKeys = useMemo(() => {
    if (props.custom.data.length > 0) {
      return Object.keys(props.custom.data[0])
        .filter((key) => key !== xAxisKey)
        .sort((a, b) => {
          if (areOrderProvided) {
            return (
              props.custom.options![a]!.order! -
              props.custom.options![b]!.order!
            );
          }
          return a < b ? -1 : 0;
        });
    }
    return [];
  }, [areOrderProvided, props.custom, xAxisKey]);

  return (
    <div ref={ref} style={{ display: "inline-block", ...props.styles }}>
      <FunnelChartRechart
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
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        data={props.custom.data}
      >
        {/* {props.custom.cartesianGrid?.show ? (
          <CartesianGrid
            strokeDasharray={props.custom.cartesianGrid?.strokeDasharray}
          />
        ) : null} */}
        {/* {props.custom.xAxis?.show ? <XAxis dataKey={xAxisKey} /> : null}
        {props.custom.yAxis?.show ? <YAxis /> : null} */}
        {props.custom.toolTip?.show ? <Tooltip /> : null}
        //{props.custom.legend?.show ? <Legend /> : null}
        {sortedKeys.map((key, index) => {
          const fillColor =
            props.custom.options?.[key]?.fill || getColorAt(index);
          const strokeColor =
            props.custom.options?.[key]?.stroke ||
            Color(fillColor).darken(0.3).hex();
          return (
            <Funnel
              key={key}
              dataKey={key}
              //stackId={props.custom.stacked ? "1" : undefined}
              type={props.custom.options?.[key]?.type}
              stroke={strokeColor}
              fill={fillColor}
              isAnimationActive={props.custom.options?.[key]?.animate}
            />
          );
        })}
      </FunnelChartRechart>
    </div>
  );
});

export const DevFunnelChart: typeof FunnelChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = 
      [{ name: 'a', value: 12, }, { name: 'v', value: [5, 12] }]
    ;
    const options = {
      // uv: { animate: false },
      value: { animate: false },
      // amt: { animate: false },
    };
    return { ...props.custom, data: data, options };
  }, [props.custom]);

  return <FunnelChart {...props} ref={ref} custom={custom} />;
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
    //cartesianGrid: "map",
    data: "array",
    //options: "map",
    toolTip: "map",
    legend: "map",
   // xAxis: "map",
    //yAxis: "map",
    //stacked: "boolean",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "FunnelChart", category: "Data" },
  render: {
    comp: FunnelChart,
  },
  dev: {
    comp: DevFunnelChart,
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
          // xAxis: { show: true, key: "x" },
          // yAxis: { show: true },
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
  panel: { comp: CommonIcon, props: { name: "Funnel", svg: CommonIcon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Funnel", containerStyle: { padding: "1rem" }, svg: CommonIcon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};

