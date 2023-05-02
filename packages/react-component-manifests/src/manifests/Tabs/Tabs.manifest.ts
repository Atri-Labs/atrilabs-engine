import { CSSTreeOptions } from "@atrilabs/app-design-forest/src/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/src/customPropsTree";
import {
  ReactComponentManifestSchema,
  AcceptsChildFunction,
} from "@atrilabs/react-component-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";
import { Id as reactSchemaId } from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";
import {
  Id as AttributesTreeId,
  AttributesTreeOptionsBoolean,
} from "@atrilabs/app-design-forest/src/attributesTree";

const attributesTreeOptions: AttributesTreeOptionsBoolean = {
  basics: true,
  ariaLabelledBy: false,
};

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

const acceptsChild: AcceptsChildFunction = (info: any) => {
  return 1;
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    defaultActiveKey: { type: "text" },
    centered: { type: "boolean" },
    animated: { type: "boolean" },
    tabPosition: {
      type: "enum",
      options: ["top", "bottom", "left", "right"],
    },
    size: {
      type: "enum",
      options: ["middle", "large", "small"],
    },
    type: {
      type: "enum",
      options: ["line", "card"],
    },
    inActiveTabColor: { type: "color" },
    activeTabColor: { type: "color" },
    items: {
      type: "array_map",
      singleObjectName: "item",
      attributes: [
        { fieldName: "key", type: "number" },
        { fieldName: "label", type: "text" },
        { fieldName: "children", type: "text" },
        { fieldName: "disabled", type: "boolean" },
        { fieldName: "icon", type: "static_asset" },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Tabs", category: "Basics" },
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
          items: [
            {
              key: "1",
              label: `Tab 1`,
              children: `Content of Tab Pane 1`,
            },
            {
              key: "2",
              label: `Tab 2`,
              children: `Content of Tab Pane 2`,
            },
            {
              key: "3",
              label: `Tab 3`,
              children: `Content of Tab Pane 3`,
            },
          ],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
      attrs: {
        treeId: AttributesTreeId,
        initialValue: {},
        treeOptions: attributesTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onTabClick: [{ type: "controlled", selector: ["custom", "open"] }],
    },
    defaultCallbackHandlers: {},
    acceptsChild,
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Tabs" } },
  drag: {
    comp: "CommonIcon",
    props: {
      name: "Tabs",
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
