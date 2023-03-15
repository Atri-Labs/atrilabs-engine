import { CSSTreeOptions } from "@atrilabs/app-design-forest/src/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/src/customPropsTree";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
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

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    checkable: { type: "boolean" },
    showLine: { type: "boolean" },
    multiple: { type: "boolean" },
    defaultExpandAll: { type: "boolean" },
    defaultExpandParent: { type: "boolean" },
    treeData: {
      type: "array_map",
      singleObjectName: "item",
      attributes: [
        { fieldName: "title", type: "text" },
        { fieldName: "key", type: "text" },
        { fieldName: "disabled", type: "boolean" },   
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Tree", category: "Basics" },
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
          treeData: [
            {
              title: `0-0`,
              key: `0-0`,
              disabled: false,  
            },
          ],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onCheck: [{ type: "controlled", selector: ["custom", "open"] }],
      onExpand: [{ type: "controlled", selector: ["custom", "open"] }],
      onRightClick: [{ type: "controlled", selector: ["custom", "open"] }],
      onSelect: [{ type: "controlled", selector: ["custom", "open"] }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Tree" } },
  drag: {
    comp: "CommonIcon",
    props: {
      name: "Tree",
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
