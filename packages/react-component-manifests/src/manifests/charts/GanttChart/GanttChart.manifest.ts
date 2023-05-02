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
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "strokeDasharray", type: "text" },
      ],
    },
    data: { type: "array" },
    options: { type: "array" },
    toolTip: {
      type: "map",
      attributes: [{ fieldName: "show", type: "boolean" }],
    },
    legend: {
      type: "map",
      attributes: [{ fieldName: "show", type: "boolean" }],
    },
    keys: {
      type: "map",
      attributes: [{ fieldName: "value", type: "text" }],
    },
    xAxis: {
      type: "map",
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "key", type: "text" },
        { fieldName: "type", type: "text" },
      ],
    },
    yAxis: {
      type: "map",
      attributes: [
        { fieldName: "show", type: "boolean" },
        { fieldName: "type", type: "text" },
      ],
    },
    chartHeight: { type: "number" },
    chartWidth: { type: "number" },
  },
};
const compManifest: ReactComponentManifestSchema = {
  meta: { key: "GanttChart", category: "Data" },
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
          xAxis: { show: true, key: "name", type: "number" },
          yAxis: { show: true, type: "category" },
          toolTip: { show: true },
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
  panel: { comp: "CommonIcon", props: { name: "Gantt" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Gantt", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
// Source code for Granttchart : https://codesandbox.io/s/recharts-gantt-forked-dzqlox?file=/src/index.js:2033-2046
