import { CSSTreeOptions } from "@atrilabs/app-design-forest/src/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/src/customPropsTree";
import {
  ReactComponentManifestSchema,
  AcceptsChildFunction,
} from "@atrilabs/react-component-manifest-schema";
import CSSTreeId from "@atrilabs/app-design-forest/src/cssTree?id";
import CustomTreeId from "@atrilabs/app-design-forest/src/customPropsTree?id";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";

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
    centered: { type: "boolean" },
    animated: { type: "boolean" },
    addIcon: { type: "static_asset" },
    tabPosition: {
      type: "enum",
      options: ["top", "bottom", "left", "right"],
    },
    size: {
      type: "enum",
      options: ["large", "middle", "small"],
    },
    type: {
      type: "enum",
      options: ["line", "card"],
    },
    items: {
      type: "array_map",
      singleObjectName: "item",
      attributes: [
        { fieldName: "key", type: "number" },
        { fieldName: "label", type: "text" },
        { fieldName: "children", type: "text" },
        { fieldName: "disabled", type: "boolean" },
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
              children: [],
            },
            {
              key: "2",
              label: `Tab 2`,
              children: [],
            },
            {
              key: "3",
              label: `Tab 3`,
              children: [],
            },
          ],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onTitleClick: [{ type: "controlled", selector: ["custom", "open"] }],
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
