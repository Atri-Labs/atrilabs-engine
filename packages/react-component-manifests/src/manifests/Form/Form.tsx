import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";

export const Form = forwardRef<
  HTMLFormElement,
  {
    styles: React.CSSProperties;
    custom: {
      types: string[];
      labels: string[];
      placeholders: string[];
      ids: string[];
      showResetButton: boolean;
      submitButtonBgColor?: string;
      submitButtonColor?: string;
      resetButtonBgColor?: string;
      resetButtonColor?: string;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );
  return (
    <form ref={ref} className={props.className} style={props.styles}>
      {props.custom.types.map((type, index) => {
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
            <label htmlFor="id">{labelText}</label>
            <input
              type={type}
              placeholder={placeholderText}
              id={id}
              style={{ padding: "0.5em" }}
              onClick={onClick}
            />
          </div>
        );
      })}
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
    types: { type: "array" },
    labels: { type: "array" },
    placeholders: { type: "array" },
    ids: { type: "array" },
    showResetButton: { type: "boolean" },
    submitButtonBgColor: { type: "color" },
    submitButtonColor: { type: "color" },
    resetButtonBgColor: { type: "color" },
    resetButtonColor: { type: "color" },
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
          types: ["text", "password"],
          labels: ["Enter your name:", "Password:"],
          placeholders: ["Enter your name", "Password"],
          ids: ["name", "pwd"],
          showResetButton: true,
          submitButtonBgColor: "#1890ff",
          submitButtonColor: "#fff",
          resetButtonBgColor: "#fff",
          resetButtonColor: "#000",
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
  panel: { comp: CommonIcon, props: { name: "Form" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Form", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
