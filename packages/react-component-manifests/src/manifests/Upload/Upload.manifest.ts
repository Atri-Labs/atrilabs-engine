import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import CSSTreeId from "@atrilabs/app-design-forest/src/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import CustomTreeId from "@atrilabs/app-design-forest/src/customPropsTree?id";
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
    text: { type: "text" },
    listType: {
      type: "enum",
      options: ["text", "picture-card", "picture-circle"],
    },
    dragger: { type: "boolean" },
    maxCount: { type: "number" },
    multiple: { type: "boolean" },
    disabled: { type: "boolean" },
    directory :{ type: "boolean" },
    allowFiles : {type : "enum",
     options : [ "all" ,"image" ,"video"]
  },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Upload", category: "Basics" },
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
          text: "Click to Upload",
          listType: "text",
          dragger: false,
          disabled : false,
          directory : false,  
          allowFiles :  "all",   
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
  panel: { comp: "CommonIcon", props: { name: "Upload" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Upload", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
