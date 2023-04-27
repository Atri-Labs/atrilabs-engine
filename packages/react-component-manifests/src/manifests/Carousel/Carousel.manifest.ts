import { Id as reactSchemaId } from "@atrilabs/react-component-manifest-schema";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";
import { Id as AttributesTreeId } from "@atrilabs/app-design-forest/src/attributesTree?id";
import {AttributesTreeOptionsBoolean} from "@atrilabs/app-design-forest/src/attributesTree";

const attributesTreeOptions: AttributesTreeOptionsBoolean = {
  basics: true,
  ariaLabelledBy: false,
};
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
    autoplay: { type: "boolean" },
    dots: { type: "boolean" },
    dotPosition: {
      type: "enum",
      options: ["bottom", "top", "left", "right"],
    },
    effect: {
      type: "enum",
      options: ["scrollx", "fade"],
    },
    items: {
      type: "array_map",
      singleObjectName: "item",
      attributes: [
        { fieldName: "text", type: "text" },
        { fieldName: "image", type: "static_asset" },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Carousel", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          height: "160px",
          width: "100%",
          color: "#fff",
          lineHeight: "160px",
          textAlign: "center",
          background: "#364d79",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          items: [
            {
              text: "1",
            },
            {
              text: "2",
            },
            {
              text: "3",
            },
            {
              text: "4",
            },
          ],
          dots: true,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
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
      beforeChange: [{ type: "do_nothing" }],
      afterChange: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Carousel" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Carousel", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
