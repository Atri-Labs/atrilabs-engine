import { Id as reactSchemaId } from "@atrilabs/react-component-manifest-schema";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";

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
      attributes: [{ fieldName: "show", type: "boolean" }],
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
    xAxis: {
      type: "map",
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "key", type: "text" },
      ],
    },
    yAxis: {
      type: "map",
      attributes: [{ fieldName: "show", type: "boolean" }],
    },
    chartHeight: { type: "number" },
    chartWidth: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "AreaChart", category: "Data" },
  dev: {
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
          cartesianGrid: { show: true, strokeDasharray: "3" },
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
  panel: { comp: "CommonIcon", props: { name: "Area" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Area", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
