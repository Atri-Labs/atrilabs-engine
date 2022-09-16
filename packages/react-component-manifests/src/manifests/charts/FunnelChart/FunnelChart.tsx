import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import {
  FunnelChart as FunnelChartRechart,
  Tooltip,
  Legend,
  Funnel,
  LabelList,
} from "recharts";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { ReactComponent as Icon } from "./icon.svg";

export const FunnelChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
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
    };
  }
>((props, ref) => {

  const funnelOrderProvided = useMemo(() => {
    if (props.custom.data.length > 0) {
      const keys = Object.keys(props.custom.data[0]);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (props.custom.options?.[key]?.order === undefined) {
          return false;
        }
      }
    }
    return true;
  }, [props.custom]);

  const sortedKeys = useMemo(() => {
    if (props.custom.data.length > 0) {
      return Object.keys(props.custom.data[0])
        .sort((a, b) => {
          if (funnelOrderProvided) {
            return (
              props.custom.options![a]!.order! -
              props.custom.options![b]!.order!
            );
          }
          return a < b ? -1 : 0;
        });
    }
    return [];
  }, [funnelOrderProvided, props.custom]);

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
      >
        {props.custom.toolTip?.show ? <Tooltip /> : null}
        {props.custom.legend?.show ? <Legend /> : null}
        {sortedKeys.map((key, index) => {
          return (
            <Funnel
              data={props.custom.data}
              dataKey={key}
              type={props.custom.options?.[key]?.type}
              isAnimationActive={props.custom.options?.[key]?.animate}
            >
                <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
            </Funnel>
          );
        })}
      </FunnelChartRechart>
    </div>
  );
});

export const DevBarChart: typeof FunnelChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = [
        {
          value: 100,
          name: "Page A",
          fill: "#8884d8"
        },
        {
          value: 80,
          name: "Page B",
          fill: "#83a6ed"
        },
        {
          value: 50,
          name: "Page C",
          fill: "#8dd1e1"
        },
        {
          value: 40,
          name: "Page D",
          fill: "#82ca9d"
        },
        {
          value: 26,
          name: "Page E",
          fill: "#a4de6c"
        }
      ]
      
    const options = {
      value: { animate: false },
      fill: { animate: false },
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
    data: "array",
    options: "map",
    toolTip: "map",
    legend: "map",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "FunnelChart", category: "Data" },
  render: {
    comp: FunnelChart,
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
  panel: { comp: CommonIcon, props: { name: "Funnel", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Funnel", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
