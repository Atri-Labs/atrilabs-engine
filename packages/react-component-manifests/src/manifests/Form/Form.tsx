import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import "./Form.css";

export const Form = forwardRef<
  HTMLFormElement,
  {
    styles: React.CSSProperties;
    custom: {
      types: string[];
      labels: string[];
      placeholders: string[];
      ids: string[];
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
              padding: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label htmlFor="id">{labelText}</label>
            <input
              style={{ marginTop: "10px" }}
              type={type}
              key={index}
              placeholder={placeholderText}
              id={id}
              onClick={onClick}
            />
          </div>
        );
      })}
      {/* {props.custom.types} */}
      <button>Submit</button>
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
    types: { type: "array_enum", options: ["text", "password"] },
    labels: { type: "array" },
    placeholders: { type: "array" },
    ids: { type: "array" },
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
        initialValue: {},
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          types: [],
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
