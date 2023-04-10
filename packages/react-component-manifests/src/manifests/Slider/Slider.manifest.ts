import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import CSSTreeId from "@atrilabs/app-design-forest/src/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import CustomTreeId from "@atrilabs/app-design-forest/src/customPropsTree?id";

const cssTreeOptions: CSSTreeOptions = {
  boxShadowOptions: true,
  flexContainerOptions: false,
  flexChildOptions: true,
  positionOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    range: { type: "boolean" },
    value: { type: "array_number" },
    min: { type: "number" },
    max: { type: "number" },
    defaultValue: { type: "array_number" },
    disabled: { type: "boolean" },
    vertical: { type: "boolean" },
    draggableTrack: { type: "boolean" },
    reverse: { type: "boolean" },
    marks: {
      type: "array_map",
      singleObjectName: "mark",
      attributes: [
        {
          fieldName: "value",
          type: "number",
        },
        {
          fieldName: "label",
          type: "text",
        },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Slider", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          margin: "0 30px",
          minWidth: "500px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          min: 0,
          max: 100,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "value"] }],
      onAfterChange: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Slider" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Slider", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
