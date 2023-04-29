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
import {
  CSSTreeOptions,
  CustomPropsTreeOptions,
} from "@atrilabs/app-design-forest";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";

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

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    href: { type: "text" },
    download: { type: "text" },
    referrerPolicy: {
      type: "enum",
      options: [
        "no-referrer",
        "no-referrer-when-downgrade",
        "origin",
        "origin-when-cross-origin",
        "same-origin",
        "strict-origin-when-cross-origin",
        "unsafe-url",
      ],
    },
    rel: {
      type: "enum",
      options: [
        "",
        "alternate",
        "author",
        "bookmark",
        "external",
        "help",
        "license",
        "next",
        "nofollow",
        "noreferrer",
        "noopener",
        "prev",
        "search",
        "tag",
      ],
    },
    target: {
      type: "enum",
      options: ["_blank", "_parent", "_self", "_top"],
    },
    hreflang: { type: "text" },
    ping: { type: "text" },
    type: { type: "text" },
    disabled: { type: "boolean" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Anchor", category: "Basics" },
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
          referrerPolicy: "no-referrer-when-downgrade",
          target: "_self",
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
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
  panel: { comp: "CommonIcon", props: { name: "Anchor" } },
  drag: {
    comp: "CommonIcon",
    props: {
      name: "Anchor",
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
