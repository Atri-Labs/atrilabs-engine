import React, { forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { Treemap as TreemapChartRechart } from "recharts";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { ReactComponent as Icon } from "./icon.svg";
export const TreemapChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      data: {
        name: string;
        children: {}[];
      }[];
      treemap: {
        key: string;
        stroke?: string;
        fill?: string;
      };
      chartWidth: number;
      chartHeight: number;
    };
    className?: string;
  }
>((props, ref) => {
  // REFERENCE: https://recharts.org/en-US/api/Treemap
  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      className={props.className}
    >
      <TreemapChartRechart
        width={props.custom.chartWidth}
        height={props.custom.chartHeight}
        data={props.custom.data}
        dataKey={props.custom.treemap.key}
        stroke={props.custom.treemap.stroke}
        fill={props.custom.treemap.fill}
      ></TreemapChartRechart>
    </div>
  );
});

export const DevTreemapChart: typeof TreemapChart = forwardRef((props, ref) => {
  const custom = useMemo(() => {
    const data = [
      {
        name: "axis",
        children: [
          { name: "Axes", size: 1302 },
          { name: "Axis", size: 24593 },
          { name: "AxisGridLine", size: 652 },
          { name: "AxisLabel", size: 636 },
          { name: "CartesianAxes", size: 6703 },
        ],
      },
      {
        name: "controls",
        children: [
          { name: "AnchorControl", size: 2138 },
          { name: "ClickControl", size: 3824 },
          { name: "Control", size: 1353 },
          { name: "ControlList", size: 4665 },
          { name: "DragControl", size: 2649 },
          { name: "ExpandControl", size: 2832 },
          { name: "HoverControl", size: 4896 },
          { name: "IControl", size: 763 },
          { name: "PanZoomControl", size: 5222 },
          { name: "SelectionControl", size: 7862 },
          { name: "TooltipControl", size: 8435 },
        ],
      },
      {
        name: "data",
        children: [
          { name: "Data", size: 20544 },
          { name: "DataList", size: 19788 },
          { name: "DataSprite", size: 10349 },
          { name: "EdgeSprite", size: 3301 },
          { name: "NodeSprite", size: 19382 },
          {
            name: "render",
            children: [
              { name: "ArrowType", size: 698 },
              { name: "EdgeRenderer", size: 5569 },
              { name: "IRenderer", size: 353 },
              { name: "ShapeRenderer", size: 2247 },
            ],
          },
          { name: "ScaleBinding", size: 11275 },
          { name: "Tree", size: 7147 },
          { name: "TreeBuilder", size: 9930 },
        ],
      },
      {
        name: "events",
        children: [
          { name: "DataEvent", size: 7313 },
          { name: "SelectionEvent", size: 6880 },
          { name: "TooltipEvent", size: 3701 },
          { name: "VisualizationEvent", size: 2117 },
        ],
      },
      {
        name: "legend",
        children: [
          { name: "Legend", size: 20859 },
          { name: "LegendItem", size: 4614 },
          { name: "LegendRange", size: 10530 },
        ],
      },
      {
        name: "operator",
        children: [
          {
            name: "distortion",
            children: [
              { name: "BifocalDistortion", size: 4461 },
              { name: "Distortion", size: 6314 },
              { name: "FisheyeDistortion", size: 3444 },
            ],
          },
          {
            name: "encoder",
            children: [
              { name: "ColorEncoder", size: 3179 },
              { name: "Encoder", size: 4060 },
              { name: "PropertyEncoder", size: 4138 },
              { name: "ShapeEncoder", size: 1690 },
              { name: "SizeEncoder", size: 1830 },
            ],
          },
          {
            name: "filter",
            children: [
              { name: "FisheyeTreeFilter", size: 5219 },
              { name: "GraphDistanceFilter", size: 3165 },
              { name: "VisibilityFilter", size: 3509 },
            ],
          },
          { name: "IOperator", size: 1286 },
          {
            name: "label",
            children: [
              { name: "Labeler", size: 9956 },
              { name: "RadialLabeler", size: 3899 },
              { name: "StackedAreaLabeler", size: 3202 },
            ],
          },
          {
            name: "layout",
            children: [
              { name: "AxisLayout", size: 6725 },
              { name: "BundledEdgeRouter", size: 3727 },
              { name: "CircleLayout", size: 9317 },
              { name: "CirclePackingLayout", size: 12003 },
              { name: "DendrogramLayout", size: 4853 },
              { name: "ForceDirectedLayout", size: 8411 },
              { name: "IcicleTreeLayout", size: 4864 },
              { name: "IndentedTreeLayout", size: 3174 },
              { name: "Layout", size: 7881 },
              { name: "NodeLinkTreeLayout", size: 12870 },
              { name: "PieLayout", size: 2728 },
              { name: "RadialTreeLayout", size: 12348 },
              { name: "RandomLayout", size: 870 },
              { name: "StackedAreaLayout", size: 9121 },
              { name: "TreeMapLayout", size: 9191 },
            ],
          },
          { name: "Operator", size: 2490 },
          { name: "OperatorList", size: 5248 },
          { name: "OperatorSequence", size: 4190 },
          { name: "OperatorSwitch", size: 2581 },
          { name: "SortOperator", size: 2023 },
        ],
      },
    ];
    return { ...props.custom, data: data };
  }, [props.custom]);

  return <TreemapChart {...props} ref={ref} custom={custom} />;
});

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
    data: {
      type: "array",
    },
    treemap: {
      type: "map",
      attributes: [
        { fieldName: "key", type: "text" },
        { fieldName: "stroke", type: "text" },
        { fieldName: "fill", type: "text" },
      ],
    },
    chartHeight: { type: "number" },
    chartWidth: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "TreemapChart", category: "Data" },
  render: {
    comp: TreemapChart,
  },
  dev: {
    comp: DevTreemapChart,
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
          chartHeight: 400,
          chartWidth: 500,
          treemap: {
            key: "size",
            stroke: "#fff",
            fill: "#38BDF8",
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
  panel: { comp: CommonIcon, props: { name: "Treemap", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: {
      name: "Treemap",
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
