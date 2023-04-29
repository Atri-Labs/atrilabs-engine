import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";

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
    defaultValue: { type: "text" },
    value: { type: "text" },
    placeholder: { type: "text" },
    isPasswordField: { type: "boolean" },
    size: { type: "enum", options: ["middle", "large", "small"] },
    addonAfter: { type: "text" },
    addonBefore: { type: "text" },
    allowClear: { type: "boolean" },
    bordered: { type: "boolean" },
    disabled: { type: "boolean" },
    id: { type: "text" },
    maxLength: { type: "number" },
    showCount: { type: "boolean" },
    status: { type: "enum", options: ["none", "error", "warning"] },
    prefix: { type: "text" },
    suffix: { type: "text" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Input", category: "Basics" },
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
          placeholder: "Placeholder Text",
          bordered: true,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "value"] }],
      onPressEnter: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Input" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Input", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
