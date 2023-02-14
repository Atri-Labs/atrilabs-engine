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
  panel: { comp: "CommonIcon", props: { name: "Treemap" } },
  drag: {
    comp: "CommonIcon",
    props: {
      name: "Treemap",
      containerStyle: { padding: "1rem" },
    },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
