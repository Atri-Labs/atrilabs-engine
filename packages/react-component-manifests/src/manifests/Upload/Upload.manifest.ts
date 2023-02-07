import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/src/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/src/customPropsTree?id";
import { ReactComponent as Icon } from "./upload.svg";
import { fileIoProp } from "./Upload";

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
    multuple: { type: "boolean" },
    showFilename: { type: "boolean" },
    text: { type: "text" },
    disabled: { type: "boolean" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Upload", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          alignItems: "center",
          color: "#fff",
          backgroundColor: "#1890ff",
          paddingTop: "8px",
          paddingLeft: "15px",
          paddingBottom: "8px",
          paddingRight: "15px",
          fontSize: "16px",
          borderRadius: "2px",
          outline: "none",
          fontWeight: 400,
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#1890ff",
          cursor: "pointer",
          userSelect: "none",
          columnGap: "12px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          multiple: false,
          showFilename: true,
          text: "Upload",
          disabled: false,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "file_input", selector: ["io", "files"] }],
    },
    defaultCallbackHandlers: {
      onChange: [{ sendFile: { self: true, props: ["io", "files"] } }],
    },
    ioProps: {
      io: {
        files: fileIoProp,
      },
    },
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Upload", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Upload", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
