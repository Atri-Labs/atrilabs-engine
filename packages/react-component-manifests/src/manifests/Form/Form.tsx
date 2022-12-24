import React, { forwardRef } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { ReactComponent as Icon } from "./icon.svg";

type inputTypes = {
  label?: string;
  id?: string;
  placeholder?: string;
};

export const Form = forwardRef<
  HTMLFormElement,
  {
    styles: React.CSSProperties;
    custom: {
      target: string;
      autocomplete: string;
      // types: string[];
      // labels: string[];
      // placeholders: string[];
      // ids: string[];
      showResetButton: boolean;
      submitButtonBgColor?: string;
      submitButtonColor?: string;
      resetButtonBgColor?: string;
      resetButtonColor?: string;
      form: {
        selectedOption: string;
        text: inputTypes;
        password: inputTypes;
        color: inputTypes;
        date: inputTypes;
        datetimeLocal: inputTypes;
        email: inputTypes;
        url: inputTypes;
        search: inputTypes;
        radio: {
          name?: string;
          label?: string[];
          id?: string[];
          value?: string[];
        };
        checkbox: {
          label?: string[];
          id?: string[];
          value?: string[];
        };
        time: Pick<inputTypes, "id" | "label">;
        file: Pick<inputTypes, "id" | "label"> & {
          multiple?: boolean;
        };
        image: {
          width?: number;
          height?: number;
          alt?: string;
          src?: string;
        };
        select: {
          selectOptions?: string[];
          selectLabel?: string;
          selectIdentifier?: string;
          multiple?: boolean;
        };
      }[];
    };
    onClick: (buttonClicked: "Submit" | "Reset") => void;
    className?: string;
  }
>((props, ref) => {
  console.log("Form", props.custom.form);
  return (
    <form
      ref={ref}
      className={props.className}
      style={props.styles}
      target={props.custom.target}
      autoComplete={props.custom.autocomplete}
    >
      {/* {props.custom.types.map((type, index) => {
        const labelText =
          props.custom.labels?.[index] !== undefined
            ? props.custom.labels?.[index]
            : "";
        const id =
          props.custom.ids?.[index] !== undefined
            ? props.custom.ids?.[index]
            : "";
        const placeholderText =
          props.custom.placeholders?.[index] !== undefined
            ? props.custom.placeholders?.[index]
            : "";

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              columnGap: "1em",
              alignItems: "baseline",
            }}
            key={index}
          >
            <label htmlFor={id}>{labelText}</label>
            <input
              type={type}
              placeholder={placeholderText}
              id={id}
              style={{ padding: "0.5em" }}
            />
          </div>
        );
      })} */}
      {/* {props.custom.form.selectedOption !== "none" && (
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            columnGap: "1em",
            alignItems: "baseline",
          }}
        >
          <label htmlFor={props.custom.form.selectAttribute.selectIdentifier}>
            {props.custom.form.selectAttribute.selectLabel}
          </label>
          <select
            id={props.custom.form.selectAttribute.selectIdentifier}
            style={{ padding: "0.5em" }}
          >
            {props.custom.form.selectAttribute.selectOptions?.map(
              (option, index) => {
                return <option key={index}>{option}</option>;
              }
            )}
          </select>
        </div>
      )} */}
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          columnGap: "1em",
          alignItems: "baseline",
        }}
      >
        <button
          style={{
            padding: "4px 15px",
            color: props.custom.submitButtonColor,
            backgroundColor: props.custom.submitButtonBgColor,
            border: "1px solid transparent",
          }}
        >
          Submit
        </button>
        {props.custom.showResetButton && (
          <button
            style={{
              padding: "4px 15px",
              color: props.custom.resetButtonColor,
              backgroundColor: props.custom.resetButtonBgColor,
              border: "1px solid #d9d9d9",
            }}
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
});

const cssTreeOptions: CSSTreeOptions = {
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
    // types: { type: "array" },
    // labels: { type: "array" },
    // placeholders: { type: "array" },
    // ids: { type: "array" },
    showResetButton: { type: "boolean" },
    submitButtonBgColor: { type: "color" },
    submitButtonColor: { type: "color" },
    resetButtonBgColor: { type: "color" },
    resetButtonColor: { type: "color" },
    // form: {
    //   type: "typed_map",
    //   attributes: [
    //     {
    //       fieldName: "select",
    //       type: "map",
    //       attributes: [
    //         { fieldName: "selectLabel", type: "text" },
    //         { fieldName: "selectIdentifier", type: "text" },
    //         { fieldName: "selectOptions", type: "array" },
    //         { fieldName: "multiple", type: "boolean" },
    //       ],
    //     },
    //   ],
    // },
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
            { fieldName: "name", type: "text" },
            { fieldName: "label", type: "array" },
            { fieldName: "id", type: "array" },
            { fieldName: "value", type: "array" },
          ],
        },
        {
          fieldName: "checkbox",
          type: "map",
          attributes: [
            { fieldName: "label", type: "array" },
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
            { fieldName: "placeholder", type: "text" },
          ],
        },
        {
          fieldName: "date",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
            { fieldName: "placeholder", type: "text" },
          ],
        },
        {
          fieldName: "datetimeLocal",
          type: "map",
          attributes: [
            { fieldName: "label", type: "text" },
            { fieldName: "id", type: "text" },
            { fieldName: "placeholder", type: "text" },
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
          fieldName: "image",
          type: "map",
          attributes: [
            { fieldName: "width", type: "number" },
            { fieldName: "height", type: "number" },
            { fieldName: "alt", type: "text" },
            { fieldName: "src", type: "static_asset" },
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
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Form", category: "Basics" },
  render: {
    comp: Form,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          display: "inline-flex",
          flexDirection: "column",
          rowGap: "1em",
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
          form: [],
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
  panel: { comp: CommonIcon, props: { name: "Form", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Form", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
