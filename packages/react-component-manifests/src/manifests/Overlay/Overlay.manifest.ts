import { Id as reactSchemaId } from "@atrilabs/react-component-manifest-schema";
import type {
  AcceptsChildFunction,
  ReactComponentManifestSchema,
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
    closeOverlayAfter: { type: "number" },
    open: { type: "boolean" },
  },
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

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Overlay", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          backgroundColor: "#00000073",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          open: true,
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
    attachCallbacks: {},
    defaultCallbackHandlers: {},
    acceptsChild,
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Overlay" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Overlay", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
