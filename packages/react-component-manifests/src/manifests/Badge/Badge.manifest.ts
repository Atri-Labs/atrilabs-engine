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
import {
  flexRowSort,
  flexColSort,
} from "@atrilabs/react-component-manifest-schema";

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
    title: { type: "text" },
    status: {
      type: "enum",
      options: ["error", "success", "default", "warning"],
    },
    color: { type: "color" },
    dot: { type: "boolean" },
    count: { type: "text" },
    countIcon: { type: "static_asset" },
    text: { type: "text" },
    size: { type: "enum", options: ["default", "small"] },
    showZero: { type: "boolean" },
    overflowCount: { type: "number" },
    ribbon: { type: "boolean" },
    ribbonText: { type: "text" },
    ribbonPlacement: { type: "enum", options: ["start", "end"] },
    ribbonColor: { type: "color" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Badge", category: "Basics" },
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
          dot: false,
          overflowCount: 99,
          showZero: false,
          ribbon: false,
          ribbonPlacement: "end",
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "controlled", selector: ["custom", "open"] }],
    },
    defaultCallbackHandlers: {},
    acceptsChild,
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Badge" } },
  drag: {
    comp: "CommonIcon",
    props: {
      name: "Badge",
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
