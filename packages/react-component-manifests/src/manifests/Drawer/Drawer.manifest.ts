import { Id as reactSchemaId } from "@atrilabs/react-component-manifest-schema";
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
  flexRowReverseSort,
  flexColReverseSort,
} from "@atrilabs/react-component-manifest-schema";
import {
  Id as AttributesTreeId,
  AttributesTreeOptionsBoolean,
} from "@atrilabs/app-design-forest/src/attributesTree";

const attributesTreeOptions: AttributesTreeOptionsBoolean = {
  basics: true,
  ariaLabelledBy: false,
};

const acceptsChild: AcceptsChildFunction = (info: any) => {
  if (info.childCoordinates.length === 0) {
    return 0;
  }
  const flexDirection: "row" | "column" | "row-reverse" | "column-reverse" =
    info.props.styles["flexDirection"] || "row";
  let index = 0;
  switch (flexDirection) {
    case "row":
      index = flexRowSort(info.loc, info.childCoordinates) || 0;
      break;
    case "column":
      index = flexColSort(info.loc, info.childCoordinates) || 0;
      break;
    case "row-reverse":
      index = flexRowReverseSort(info.loc, info.childCoordinates) || 0;
      break;
    case "column-reverse":
      index = flexColReverseSort(info.loc, info.childCoordinates) || 0;
      break;
  }
  return index;
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
    open: { type: "boolean" },
    title: { type: "text" },
    placement: { type: "enum", options: ["left", "top", "right", "bottom"] },
    size: { type: "enum", options: ["default", "large"] },
    closable: { type: "boolean" },
    destroyOnClose: { type: "boolean" },
    forceRender: { type: "boolean" },
    autoFocus: { type: "boolean" },
    keyboard: { type: "boolean" },
    mask: { type: "boolean" },
    maskClosable: { type: "boolean" },
    zIndex: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Drawer", category: "Basics" },
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
          title: "Title",
          placement: "right",
          autoFocus: true,
          keyboard: true,
          mask: true,
          maskClosable: true,
          closable: true,
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
      onClick: [{ type: "do_nothing" }],
      onClose: [{ type: "do_nothing" }],
      afterOpenChange: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {
      onClick: [{ sendEventData: true }],
    },
    acceptsChild,
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Drawer" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Drawer", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
