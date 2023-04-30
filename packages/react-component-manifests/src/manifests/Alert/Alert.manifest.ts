import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type {ReactComponentManifestSchema} from "@atrilabs/react-component-manifest-schema";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import CSSTreeId from "@atrilabs/app-design-forest/src/cssTree?id";
import {CSSTreeOptions} from "@atrilabs/app-design-forest/src/cssTree";
import {CustomPropsTreeOptions} from "@atrilabs/app-design-forest/src/customPropsTree";
import {AttributesTreeOptionsBoolean} from "@atrilabs/app-design-forest/src/attributesTree";
import CustomTreeId from "@atrilabs/app-design-forest/src/customPropsTree?id";
import AttributesTreeId from "@atrilabs/app-design-forest/src/attributesTree?id";

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
    text: {type: "text"},
    description: {type: "text"},
    alertType: {
      type: "enum",
      options: ["success", "info", "warning", "error"],
    },
    showIcon: {type: "boolean"},
    icon: {type: "static_asset"},
    isClosable: {type: "boolean"},
    closeText: {type: "text"},
    closeIcon: {type: "static_asset"},
    banner: {type: "boolean"},
  },
};


const compManifest: ReactComponentManifestSchema = {
  meta: {key: "Alert", category: "Basics"},
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {},
        treeOptions: cssTreeOptions,
        canvasOptions: {groupByBreakpoint: true},
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          text: "Alert Title",
          description: "Alert Description",
          isClosable: true,
          showIcon: true,
        },
        treeOptions: customTreeOptions,
        canvasOptions: {groupByBreakpoint: false},
      },
      attrs: {
        treeId: AttributesTreeId,
        initialValue: {},
        treeOptions: attributesTreeOptions,
        canvasOptions: {groupByBreakpoint: false},
      },
    },
    attachCallbacks: {
      onClick: [{type: "do_nothing"}],
    },
    defaultCallbackHandlers: {
      onClick: [{sendEventData: true}],
    },
  },
};

const iconManifest = {
  panel: {comp: "CommonIcon", props: {name: "Alert"}},
  drag: {
    comp: "CommonIcon",
    props: {name: "Alert", containerStyle: {padding: "1rem"}},
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
