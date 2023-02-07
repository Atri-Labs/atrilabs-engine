import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import CSSTreeId from "@atrilabs/app-design-forest/src/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import CustomTreeId from "@atrilabs/app-design-forest/src/customPropsTree?id";

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
    modalSize: { type: "text" },
    okButtonColor: { type: "color" },
    okButtonBgColor: { type: "color" },
    okButtonBorderColor: { type: "color" },
    cancelButtonColor: { type: "color" },
    cancelButtonBgColor: { type: "color" },
    cancelButtonBorderColor: { type: "color" },
    closeModalAfter: { type: "number" },
    open: { type: "boolean" },
    body: { type: "large_text" },
    title: { type: "text" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Modal", category: "Basics" },
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
          modalSize: "50%",
          okButtonColor: "#fff",
          okButtonBgColor: "#1890ff",
          okButtonBorderColor: "#1890ff",
          cancelButtonColor: "#000",
          cancelButtonBgColor: "#fff",
          cancelButtonBorderColor: "#d9d9d9",
          open: true,
          body: "Type something here!",
          title: "Some Title",
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
  panel: { comp: "CommonIcon", props: { name: "Modal" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Modal", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
