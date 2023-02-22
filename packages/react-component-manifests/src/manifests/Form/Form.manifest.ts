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
    target: { type: "enum", options: ["_blank", "_self", "_parent", "_top"] },
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
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
            { fieldName: "placeholder", type: "text" },
          ],
        },
        {
          fieldName: "password",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
            { fieldName: "placeholder", type: "text" },
          ],
        },
        {
          fieldName: "radio",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "name", type: "text" },
            { fieldName: "labels", type: "array" },
            { fieldName: "id", type: "array" },
            { fieldName: "value", type: "array" },
          ],
        },
        {
          fieldName: "checkbox",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "labels", type: "array" },
            { fieldName: "id", type: "array" },
            { fieldName: "value", type: "array" },
          ],
        },
        {
          fieldName: "color",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
          ],
        },
        {
          fieldName: "date",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
          ],
        },
        {
          fieldName: "datetimeLocal",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
          ],
        },
        {
          fieldName: "email",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
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
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
            { fieldName: "placeholder", type: "text" },
          ],
        },
        {
          fieldName: "search",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
            { fieldName: "placeholder", type: "text" },
          ],
        },
        {
          fieldName: "file",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
            { fieldName: "multiple", type: "boolean" },
          ],
        },
        {
          fieldName: "select",
          type: "map",
          attributes: [
            { fieldName: "selectLabel", type: "text" },
            { fieldName: "selectIdentifier", type: "text" },
            { fieldName: "selectOptions", type: "array" },
            { fieldName: "multiple", type: "boolean" },
          ],
        },
      ],
    },
    showResetButton: { type: "boolean" },
    submitButtonBgColor: { type: "color" },
    submitButtonColor: { type: "color" },
    resetButtonBgColor: { type: "color" },
    resetButtonColor: { type: "color" },
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
          //rowGap: "1em",
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
                selectLabel: "Select",
                selectIdentifier: "text",
                // selectOptions: ["hey", "hello", "how are you"],
                selectOptions: [
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
                labels: ["text", "text", "text"],
                id: ["1", "2", "3"],
                value: ["1", "2", "3"],
                selectOptions: [
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
                name: "text",
                labels: ["1", "2", "1"],
                id: "selectid",
                value: ["1", "1", "1"],
                selectOptions: [
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
