import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { PieChart as PieChartRechart, Pie, Tooltip, Legend } from "recharts";

export const PieChart = forwardRef<
  HTMLDivElement,
  {
    custom: {
      width: number;
      height: number;
      data:
        | {
            [key: string]: string | number;
          }[]
        | {
            [key: string]: string | number;
          }[][];
      options?: {
        cx?: string;
        cy?: string;
        outerRadius?: number | string;
        innerRadius?: number | string;
        fill?: string;
        showLabel?: boolean;
        animate?: boolean;
      }[];
      toolTip?: { show?: boolean };
      legend?: { show?: boolean };
      keys?: { value?: string };
    };
  }
>((props, ref) => {
  const valueKey = useMemo(() => {
    return props.custom.keys?.value || "value";
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
      <PieChartRechart
        width={props.custom.width}
        height={props.custom.height}
        data={props.custom.data}
      >
        {props.custom.toolTip?.show ? <Tooltip /> : null}
        {props.custom.legend?.show ? <Legend /> : null}
        {reshapedData.map((data, index) => {
          return (
            <Pie
              key={index}
              data={data}
              dataKey={valueKey}
              fill={props.custom.options?.[index]?.fill}
              isAnimationActive={props.custom.options?.[index]?.animate}
              cx={props.custom?.options?.[index]?.cx}
              cy={props.custom?.options?.[index]?.cy}
              innerRadius={props.custom?.options?.[index]?.innerRadius}
              outerRadius={props.custom?.options?.[index]?.outerRadius}
              label={props.custom?.options?.[index]?.showLabel}
            />
          );
        })}
      </PieChartRechart>
    </div>
  );
});

export const DevPieChart: typeof PieChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = [
      [
        { name: "Group A", value: 400 },
        { name: "Group B", value: 300 },
        { name: "Group C", value: 300 },
        { name: "Group D", value: 200 },
      ],
      [
        { name: "A1", value: 100 },
        { name: "A2", value: 300 },
        { name: "B1", value: 100 },
        { name: "B2", value: 80 },
      ],
    ];
    const options = [
      {
        cx: "50%",
        cy: "50%",
        outerRadius: "40%",
        showLabel: true,
        fill: "#0088FE",
      },
      {
        cx: "50%",
        cy: "50%",
        innerRadius: "65%",
        showLabel: true,
        fill: "#00C49F",
      },
    ];
    return { ...props.custom, data, options };
  }, [props.custom]);

  return <PieChart {...props} ref={ref} custom={custom} />;
});

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    width: "number",
    height: "number",
    data: "array",
    options: "array",
    toolTip: "map",
    legend: "map",
    keys: "map",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "PieChart", category: "Data" },
  render: {
    comp: PieChart,
  },
  dev: {
    comp: DevPieChart,
    decorators: [],
    attachProps: {
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          width: 400,
          height: 400,
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
  panel: { comp: CommonIcon, props: { name: "PieChart" } },
  drag: {
    comp: CommonIcon,
    props: { name: "PieChart", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
