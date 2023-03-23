import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type {
  AcceptsChildFunction,
  ReactComponentManifestSchema,
} from "@atrilabs/react-component-manifest-schema";
import { flexColSort } from "@atrilabs/react-component-manifest-schema";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import CSSTreeId from "@atrilabs/app-design-forest/src/cssTree?id";
import CustomTreeId from "@atrilabs/app-design-forest/src/customPropsTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import Joi from "joi";

const acceptsChild: AcceptsChildFunction = (info: any) => {
  if (info.childCoordinates.length === 0) {
    return 0;
  }
  return flexColSort(info.loc, info.childCoordinates) || 0;
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
    mode: {
      type: "enum",
      options: ["vertical", "horizontal", "inline"],
    },
    theme: {
      type: "enum",
      options: ["light", "dark"],
    },
    multiple: { type: "boolean" },
    selectable: { type: "boolean" },
    selectedKeys: { type: "array" },
    defaultOpenKeys: { type: "array" },
    defaultSelectedKeys: { type: "array" },
    expandIcon: { type: "static_asset" },
    openKeys: { type: "array" },
    items: {
      type: "json",
      schema: Joi.array()
        .unique()
        .items(
          Joi.object({
            key: Joi.string(),
            label: Joi.string().required(),
            disabled: Joi.boolean(),
            icon: Joi.string(),
            type: Joi.string(),
            children: Joi.link("#menuData"),
          })
        )
        .id("menuData"),
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Menu", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: { display: "inline-block" },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          items: [
            {
              label: "Navigation One",
              key: "mail",
              icon: "",
            },
            {
              label: "Navigation Two",
              key: "app",
              icon: "",
              disabled: true,
            },
            {
              label: "Navigation Three - Submenu",
              key: "SubMenu",
              icon: "",
              children: [
                {
                  type: "group",
                  label: "Item 1",
                  children: [
                    {
                      label: "Option 1",
                      key: "setting:1",
                    },
                    {
                      label: "Option 2",
                      key: "setting:2",
                    },
                  ],
                },
                {
                  type: "group",
                  label: "Item 2",
                  children: [
                    {
                      label: "Option 3",
                      key: "setting:3",
                    },
                    {
                      label: "Option 4",
                      key: "setting:4",
                    },
                  ],
                },
              ],
            },
          ],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "controlled", selector: ["custom", "open"] }],
      onOpenChange: [{ type: "controlled", selector: ["custom", "open"] }],
      onSelect: [{ type: "controlled", selector: ["custom", "open"] }],
    },
    defaultCallbackHandlers: {},
    acceptsChild,
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Menu" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Menu", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
