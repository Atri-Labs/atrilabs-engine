import { Id as reactSchemaId } from "@atrilabs/react-component-manifest-schema";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/src/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/src/customPropsTree";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";

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
    text: { type: "text" },
    variant: {
      type: "enum",
      options: ["default", "success", "processing", "error", "warning"],
    },
    icon: { type: "static_asset" },
    iconVariant: {
      type: "enum",
      options: [
        "default",
        "success",
        "waiting",
        "error",
        "warning",
        "processing",
      ],
    },
    closable: { type: "boolean" },
    closeIcon: { type: "static_asset" },
    link: { type: "text" },
    color: { type: "color" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Tag", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          height: "20px",
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          text: "Tag",
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
  panel: { comp: "CommonIcon", props: { name: "Tag" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Tag", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
