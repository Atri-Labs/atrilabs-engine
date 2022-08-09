import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import {
  BarChart as BarChartRechart,
  CartesianGrid,
  YAxis,
  XAxis,
  Bar,
  Tooltip,
  Legend,
} from "recharts";

export const BarChart = forwardRef<
  HTMLDivElement,
  {
    custom: {
      width: number;
      height: number;
      x: string[];
      bars: {
        name?: string;
        y: number[];
        color?: string;
      }[];
    };
  }
>((props, ref) => {
  const data = useMemo(() => {
    return props.custom.x.map((x, xindex) => {
      const formattedData: { [tabName: string]: number } = {};
      props.custom.bars.forEach((bar, tabIndex) => {
        formattedData[bar.name || `bar_${tabIndex}`] = bar.y[xindex];
      });
      return { ...formattedData, name: x };
    });
  }, [props.custom]);
  return (
    <div ref={ref}>
      <BarChartRechart
        width={props.custom.width}
        height={props.custom.height}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"name"} />
        <YAxis />
        <Tooltip />
        <Legend />
        {props.custom.bars.map((bar, index) => {
          return (
            <Bar
              key={index}
              dataKey={bar.name || `bar_${index}`}
              fill={bar.color}
            />
          );
        })}
      </BarChartRechart>
    </div>
  );
});

export const DevBarChart: typeof BarChart = forwardRef((props, ref) => {
  props.custom.x = ["Year 1", "Year 2", "Year 3"];
  props.custom.bars = [
    { y: [1, 2, 3], color: "red", name: "City A" },
    { y: [1, 2, 3], color: "blue", name: "City B" },
    { y: [1, 2, 3], color: "green", name: "City C" },
  ];
  return <BarChart {...props} ref={ref} />;
});

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    width: "number",
    height: "number",
    x: "array",
    bars: "array",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "BarChart", category: "Data" },
  render: {
    comp: BarChart,
  },
  dev: {
    comp: DevBarChart,
    decorators: [],
    attachProps: {
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          width: 400,
          height: 400,
          x: [],
          bars: [],
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
  panel: { comp: CommonIcon, props: { name: "BarChart" } },
  drag: {
    comp: CommonIcon,
    props: { name: "BarChart", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
