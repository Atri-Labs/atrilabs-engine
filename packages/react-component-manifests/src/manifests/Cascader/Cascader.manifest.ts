import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import CSSTreeId from "@atrilabs/app-design-forest/src/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import CustomTreeId from "@atrilabs/app-design-forest/src/customPropsTree?id";
import Joi from "joi";

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
    options: {
      type: "json",
      schema: Joi.array()
        .unique()
        .items(
          Joi.object({
            value: Joi.string().required(),
            label: Joi.string().required(),
            children: Joi.link("#cascaderData"),
            disabled: Joi.boolean(),
            code: Joi.number(),
          })
        )
        .id("cascaderData"),
    },
    placeholder: { type: "text" },
    allowClear: { type: "boolean" },
    multiple: { type: "boolean" },
    showCheckedStrategy: {
      type: "enum",
      options: ["SHOW_PARENT", "SHOW_CHILD"],
    },
    maxTagCount: { type: "number" },
    maxTagTextLength: { type: "number" },
    size: { type: "enum", options: ["large", "middle", "small"] },
    disabled: { type: "boolean" },
    bordered: { type: "boolean" },
    showSearch: { type: "boolean" },
    open: { type: "boolean" },
    placement: {
      type: "enum",
      options: ["bottomLeft", "bottomRight", "topLeft", "topRight"],
    },
    suffixIcon: { type: "static_asset" },
    removeIcon: { type: "static_asset" },
    clearIcon: { type: "static_asset" },
    expandIcon: { type: "static_asset" },
    expandTrigger: { type: "enum", options: ["click", "hover"] },
    status: { type: "enum", options: ["none", "error", "warning"] },
    notFoundContent: { type: "text" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Cascader", category: "Basics" },
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
          options: [
            {
              value: "india",
              label: "India",
              children: [
                {
                  value: "gujarat",
                  label: "Gujarat",
                  children: [
                    {
                      value: "gandhinagar",
                      label: "Gandhinagar",
                    },
                  ],
                },
                {
                  value: "odisha",
                  label: "Odisha",
                  children: [
                    {
                      value: "bhubaneshwar",
                      label: "Bhubaneshwar",
                      code: 123,
                    },
                  ],
                },
              ],
            },
            {
              value: "bhutan",
              label: "Bhutan",
              disabled: true,
            },
          ],
          placeholder: "Please Select",
          size: "middle",
          allowClear: true,
          bordered: true,
          expandTrigger: "click",
          notFoundContent: "Not Found",
          placement: "bottomLeft",
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {
      onChange: [{ sendEventData: true }],
      onDropdownVisibleChange: [{ sendEventData: true }],
      onSearch: [{ sendEventData: true }],
    },
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Cascader" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Cascader", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
