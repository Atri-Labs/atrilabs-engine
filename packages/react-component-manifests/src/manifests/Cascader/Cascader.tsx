import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";

export const Cascader = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {};
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
    <div
      ref={ref}
      className={props.className}
      style={{
        ...props.styles,
        display: "inline-flex",
        flexDirection: "column",
      }}
      onClick={onClick}
    >
      <label
        style={{ position: "relative", width: props.styles.width || "160px" }}
      >
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="down"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            color: "#ccc",
          }}
        >
          <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
        </svg>
        <input
          type="search"
          placeholder="Please select"
          style={{
            padding: "0.5em",
            borderRadius: "5px",
            color: "#ccc",
            border: "1px solid #ccc",
            width: props.styles.width || "160px",
          }}
        />
      </label>
      <div
        style={{
          display: "flex",
          zIndex: "2",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            minWidth: "110px",
          }}
        >
          <button>Hello1</button>
          <button>Hello2</button>
          <button>Hello3</button>
          <button>Hello4</button>
          <button>Hello5</button>
        </div>
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            minWidth: "110px",
          }}
        >
          <button>Hello1</button>
          <button>Hello2</button>
          <button>Hello3</button>
          <button>Hello4</button>
          <button>Hello5</button>
        </div>
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            minWidth: "110px",
          }}
        >
          <button>Hello1</button>
          <button>Hello2</button>
          <button>Hello3</button>
          <button>Hello4</button>
          <button>Hello5</button>
        </div>
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            minWidth: "110px",
          }}
        >
          <button>Hello1</button>
          <button>Hello2</button>
          <button>Hello3</button>
          <button>Hello4</button>
          <button>Hello5</button>
        </div>
      </div>
    </div>
  );
});

const cssTreeOptions: CSSTreeOptions = {
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
    text: { type: "text" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Cascader", category: "Basics" },
  render: {
    comp: Cascader,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          width: "160px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {},
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
  panel: { comp: CommonIcon, props: { name: "Cascader" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Cascader", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
