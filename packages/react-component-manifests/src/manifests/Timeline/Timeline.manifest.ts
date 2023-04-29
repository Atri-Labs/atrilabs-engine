import { CSSTreeOptions } from "@atrilabs/app-design-forest/src/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/src/customPropsTree";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
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
    items: {
      type: "array_map",
      singleObjectName: "item",
      attributes: [
        { fieldName: "children", type: "text" },
        { fieldName: "label", type: "text" },
        { fieldName: "color", type: "color" },
        { fieldName: "dot", type: "static_asset" },
      ],
    },
    mode: {
      type: "enum",
      options: ["left", "alternate", "right"],
    },
    pending: { type: "text" },
    pendingDot: { type: "static_asset" },
    reverse: { type: "boolean" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Timeline", category: "Basics" },
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
              children: `Create a services site 2015-09-01`,
              label: `10:00 am`,
              color: "orange",
            },
          ],
          mode: "left",
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
  panel: { comp: "CommonIcon", props: { name: "Timeline" } },
  drag: {
    comp: "CommonIcon",
    props: {
      name: "Timeline",
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
