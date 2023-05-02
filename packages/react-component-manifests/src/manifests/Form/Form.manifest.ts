import { Id as reactSchemaId } from "@atrilabs/react-component-manifest-schema";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";
import Joi from "joi";
import {
  Id as AttributesTreeId,
  AttributesTreeOptionsBoolean,
} from "@atrilabs/app-design-forest/src/attributesTree";

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
    autocomplete: {
      type: "enum",
      options: ["on", "off"],
    },
    form: {
      type: "array_typed_map",
      attributes: [
        {
          fieldName: "text",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
            { fieldName: "placeholder", type: "text" },
          ],
        },
        {
          fieldName: "password",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
            { fieldName: "placeholder", type: "text" },
          ],
        },
        {
          fieldName: "radio",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
            {
              fieldName: "options",
              type: "json",
              schema: Joi.array()
                .unique()
                .items(
                  Joi.object({
                    value: Joi.string().required(),
                    label: Joi.string().required(),
                  })
                )
                .id("radio"),
            },
          ],
        },
        {
          fieldName: "checkbox",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
            {
              fieldName: "options",
              type: "json",
              schema: Joi.array()
                .unique()
                .items(
                  Joi.object({
                    value: Joi.string().required(),
                    label: Joi.string().required(),
                  })
                )
                .id("checkbox"),
            },
          ],
        },
        {
          fieldName: "color",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
          ],
        },
        {
          fieldName: "date",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
          ],
        },
        {
          fieldName: "datetimeLocal",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
          ],
        },
        {
          fieldName: "email",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
            { fieldName: "placeholder", type: "text" },
          ],
        },
        {
          fieldName: "time",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
          ],
        },
        {
          fieldName: "url",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
            { fieldName: "placeholder", type: "text" },
          ],
        },
        {
          fieldName: "search",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
            { fieldName: "placeholder", type: "text" },
          ],
        },
        {
          fieldName: "file",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
            { fieldName: "multiple", type: "boolean" },
          ],
        },
        {
          fieldName: "select",
          type: "map",
          attributes: [
            { fieldName: "id", type: "text" },
            { fieldName: "label", type: "text" },
            { fieldName: "multiple", type: "boolean" },
            {
              fieldName: "options",
              type: "json",
              schema: Joi.array()
                .unique()
                .items(
                  Joi.object({
                    value: Joi.string().required(),
                    label: Joi.string().required(),
                  })
                )
                .id("select"),
            },
          ],
        },
      ],
    },
    showSubmitButton: { type: "boolean" },
    showResetButton: { type: "boolean" },
    submitButtonBgColor: { type: "color" },
    submitButtonColor: { type: "color" },
    resetButtonBgColor: { type: "color" },
    resetButtonColor: { type: "color" },
    target: { type: "enum", options: ["_blank", "_self", "_parent", "_top"] },
    disabled: { type: "boolean" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Form", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          display: "inline-flex",
          flexDirection: "column",
          padding: "10px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          target: "_self",
          autocomplete: "off",
          types: ["text", "password"],
          labels: ["Enter your name:", "Password:"],
          placeholders: ["Enter your name", "Password"],
          ids: ["name", "pwd"],
          showResetButton: true,
          showSubmitButton: true,
          submitButtonBgColor: "#1890ff",
          submitButtonColor: "#fff",
          resetButtonBgColor: "#fff",
          resetButtonColor: "#000",
          form: [
            {
              selectedOption: "text",
              text: {
                label: "Name:",
                id: "name",
                placeholder: "Enter Your Name",
              },
            },
            {
              selectedOption: "password",
              password: {
                label: "Password:",
                id: "pwd",
                placeholder: "Enter Your Password",
              },
            },
            {
              selectedOption: "email",
              email: {
                label: "Email",
                id: "Eid",
                placeholder: "Enter Your Email",
              },
            },
            {
              selectedOption: "url",
              url: { label: "url", id: "uid", placeholder: "Enter Your URL" },
            },

            {
              selectedOption: "search",
              search: { label: "Search", id: "sid", placeholder: "Search..." },
            },
            {
              selectedOption: "color",
              color: { label: "Color", id: "text" },
            },

            {
              selectedOption: "time",
              time: { label: "Time", id: "ids" },
            },
            {
              selectedOption: "date",
              date: { label: "Date", id: "ids" },
            },
            {
              selectedOption: "datetimeLocal",
              datetimeLocal: { label: "Date time Local", id: "ids" },
            },

            {
              selectedOption: "select",
              select: {
                label: "Select",
                options: [
                  { value: "one", label: "One" },
                  { value: "two", label: "Two" },
                  { value: "three", label: "Three" },
                ],
                multiple: false,
              },
            },
            {
              selectedOption: "checkbox",
              checkbox: {
                label: "Checkbox",
                options: [
                  { value: "one", label: "One" },
                  { value: "two", label: "Two" },
                  { value: "three", label: "Three" },
                ],
              },
            },
            {
              selectedOption: "radio",
              radio: {
                label: "Radio",
                options: [
                  { value: "one", label: "One" },
                  { value: "two", label: "Two" },
                  { value: "three", label: "Three" },
                ],
              },
            },
            {
              selectedOption: "file",
              file: { label: "Upload File", id: "fileinput", multiple: true },
            },
          ],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
      attrs: {
        treeId: AttributesTreeId,
        initialValue: {},
        treeOptions: attributesTreeOptions,
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
  panel: { comp: "CommonIcon", props: { name: "Form" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Form", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
