import { CSSTreeOptions } from "@atrilabs/app-design-forest/src/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/src/customPropsTree";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";
import { Id as reactSchemaId } from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";

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
    size: {
      type: "enum",
      options: ["middle", "large", "small"],
    },
    expandIconPosition: {
      type: "enum",
      options: ["start", "end"],
    },
    collapse: { type: "boolean" },
    bordered: { type: "boolean" },
    ghost: { type: "boolean" },
    defaultActiveKey: { type: "array" },
    expandIcon: { type: "static_asset" },
    items: {
      type: "array_map",
      singleObjectName: "item",
      attributes: [
        { fieldName: "title", type: "text" },
        { fieldName: "description", type: "text" },
        { fieldName: "key", type: "text" },
        {
          fieldName: "collapsible",
          type: "enum",
          options: ["header", "icon", "disabled"],
        },
        { fieldName: "showArrow", type: "boolean" },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Accordion", category: "Basics" },
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
          bordered: true,
          items: [
            {
              title: `One`,
              description: `Content of Accordion 1`,
              key: "1",
              collapsible: "header",
              showArrow: true,
            },
          ],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "open"] }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Accordion" } },
  drag: {
    comp: "CommonIcon",
    props: {
      name: "Accordion",
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
