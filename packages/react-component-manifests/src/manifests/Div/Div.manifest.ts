import { Id as reactSchemaId } from "@atrilabs/react-component-manifest-schema";
import type {
  AcceptsChildFunction,
  ReactComponentManifestSchema,
} from "@atrilabs/react-component-manifest-schema";
import {
  flexRowSort,
  flexColSort,
} from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import AttributesTreeId from "@atrilabs/app-design-forest/src/attributesTree?id";
import {AttributesTreeOptionsBoolean} from "@atrilabs/app-design-forest/src/attributesTree";

const attributesTreeOptions: AttributesTreeOptionsBoolean = {
  basics: true,
  ariaLabelledBy: false,
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

const cssTreeOptions: CSSTreeOptions = {
  boxShadowOptions: true,
  css2DisplayOptions: true,
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

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Div", category: "Layout" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {},
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      attrs: {
        treeId: AttributesTreeId,
        initialValue: {},
        treeOptions: attributesTreeOptions,
        canvasOptions: {groupByBreakpoint: false},
      },
    },
    attachCallbacks: {
      onClick: [{ type: "do_nothing" }],
    },
    acceptsChild,
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Div" } },
  drag: {
    comp: "CommonIcon",
    props: {
      name: "Div",
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
