import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import CustomTreeId from "@atrilabs/app-design-forest/src/customPropsTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import CSSTreeId from "@atrilabs/app-design-forest/src/cssTree?id";

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
    data: { type: "array" },
    options: {
      type: "array_map",
      attributes: [
        { fieldName: "cx", type: "text" },
        { fieldName: "cy", type: "text" },
        { fieldName: "outerRadius", type: "text" },
        { fieldName: "innerRadius", type: "text" },
        { fieldName: "fill", type: "text" },
        { fieldName: "showLabel", type: "boolean" },
        { fieldName: "animate", type: "boolean" },
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
    keys: {
      type: "map",
      attributes: [{ fieldName: "value", type: "text" }],
    },
    chartHeight: { type: "number" },
    chartWidth: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "PieChart", category: "Data" },
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
  panel: { comp: "CommonIcon", props: { name: "Pie" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Pie", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
