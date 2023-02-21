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
    value: { type: "text" },
    placeholder: { type: "text" },
    isPasswordField: { type: "boolean" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Textarea", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          boxSizing: "",
          fontVariant: "",
          fontFeatureSettings: "",
          paddingTop: "",
          paddingLeft: "",
          paddingBottom: "",
          paddingRight: "",
          color: "",
          fontSize: "",
          backgroundColor: "",
          backgroundImage: "",
          borderWidth: "",
          borderStyle: "",
          borderColor: "",
          borderRadius: "",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          value: "",
          placeholder: "Placeholder Text",
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "value"] }],
      onPressEnter: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Textarea" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Textarea", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
