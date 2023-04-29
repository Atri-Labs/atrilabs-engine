import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type {
  ReactComponentManifestSchema,
  AcceptsChildFunction,
} from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";
import {
  flexRowSort,
  flexColSort,
} from "@atrilabs/react-component-manifest-schema";

const cssTreeOptions: CSSTreeOptions = {
  boxShadowOptions: true,
  css2DisplayOptions: true,
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

const acceptsChild: AcceptsChildFunction = (info: any) => {
  if (info.childCoordinates.length === 0) {
    return 0;
  }
  const display: "block" | "inline-block" | "table" =
    info.props.styles["display"] || "block";
  let index = 0;
  // TODO: the logic is incorrect.
  switch (display) {
    case "inline-block":
      index = flexRowSort(info.loc, info.childCoordinates) || 0;
      break;
    case "block" || "block":
      index = flexColSort(info.loc, info.childCoordinates) || 0;
      break;
    default:
      index = flexColSort(info.loc, info.childCoordinates) || 0;
  }
  return index;
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    size: { type: "enum", options: ["default", "large", "small"] },
    itemLayout: { type: "enum", options: ["horizontal", "vertical"] },
    bordered: { type: "boolean" },
    split: { type: "boolean" },
    items: {
      type: "array_map",
      singleObjectName: "item",
      attributes: [
        {
          fieldName: "title",
          type: "text",
        },
        {
          fieldName: "description",
          type: "text",
        },
        {
          fieldName: "icon",
          type: "static_asset",
        },
      ],
    },
    actionAdd: { type: "boolean" },
    actionUpdate: { type: "boolean" },
    actionDelete: { type: "boolean" },
    pagination: { type: "boolean" },
    paginationPosition: { type: "enum", options: ["bottom", "top", "both"] },
    paginationAlign: { type: "enum", options: ["end", "start", "center"] },
    grid: { type: "boolean" },
    gutter: { type: "number" },
    column: { type: "number" },
    xs: { type: "number" },
    sm: { type: "number" },
    md: { type: "number" },
    lg: { type: "number" },
    xl: { type: "number" },
    xxl: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "UnorderedList", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: { minWidth: "1000px" },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          size: "default",
          itemLayout: "horizontal",
          items: [{ title: "Atri Labs", description: "Atri Labs..." }],
          split: true,
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
    acceptsChild,
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "UnorderedList" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "UnorderedList", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
