import { Id as reactSchemaId } from "@atrilabs/react-component-manifest-schema";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";
import { Id as AttributesTreeId } from "@atrilabs/app-design-forest/src/attributesTree?id";
import {AttributesTreeOptionsBoolean} from "@atrilabs/app-design-forest/src/attributesTree";

const attributesTreeOptions: AttributesTreeOptionsBoolean = {
  basics: true,
  ariaLabelledBy: true,
};
const cssTreeOptions: CSSTreeOptions = {
  boxShadowOptions: true,
  flexContainerOptions: true,
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
    disabled: { type: "boolean" },
    name: { type: "text" },
    value: { type: "array" },
    optionType: { type: "enum", options: ["default", "button"] },
    buttonStyle: { type: "enum", options: ["outline", "solid"] },
    size: {
      type: "enum",
      options: ["middle", "large", "small"],
    },
    options: {
      type: "array_map",
      singleObjectName: "option",
      attributes: [
        {
          fieldName: "label",
          type: "text",
        },
        {
          fieldName: "value",
          type: "text",
        },
        {
          fieldName: "disabled",
          type: "boolean",
        },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Radio", category: "Basics" },
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
          options: [
            { value: "one", label: "One" },
            { value: "two", label: "Two" },
            { value: "three", label: "Three" },
          ],
          size: "middle",
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
      attrs: {
        treeId: AttributesTreeId,
        initialValue: {},
        treeOptions: attributesTreeOptions,
        canvasOptions: {groupByBreakpoint: false},
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "checked"] }],
    },
    defaultCallbackHandlers: {
      onChange: [{ sendEventData: true }],
    },
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Radio" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Radio", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
