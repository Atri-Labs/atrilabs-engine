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
    hover: { type: "boolean" },
    rootOptions: { type: "array" },
    options: {
      type: "array_map",
      singleObjectName: "option",
      attributes: [
        { type: "number", fieldName: "level" },
        { type: "text", fieldName: "parent" },
        { type: "array", fieldName: "children" },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Cascader", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          width: "160px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          hover: false,
          rootOptions: ["India", "USA", "France", "Canada"],
          options: [
            {
              level: 1,
              parent: "India",
              children: ["Goa", "Maharashtra", "Delhi"],
            },
            {
              level: 1,
              parent: "USA",
              children: ["California", "Washington DC", "Texas"],
            },
            {
              level: 1,
              parent: "France",
              children: ["Corsica", "Brittany"],
            },
            {
              level: 1,
              parent: "Canada",
              children: ["Ontario", "Montreal"],
            },
            {
              level: 2,
              parent: "Goa",
              children: ["Mapusa", "Panaji", "Margao"],
            },
            {
              level: 2,
              parent: "California",
              children: ["LA", "San Diego", "San Francisco"],
            },
          ],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {
      onClick: [{ sendEventData: true }],
    },
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Cascader" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Cascader", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
