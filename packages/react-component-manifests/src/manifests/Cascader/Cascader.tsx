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
      <input
        type="search"
        placeholder="Select an option: "
        style={{ padding: "0.5em", borderRadius: "5px" }}
      />
      <div
        style={{
          backgroundColor: "blue",
          display: "inline-flex",
          columnGap: "0.5em",
        }}
      >
        <div
          style={{
            backgroundColor: "blue",
            display: "inline-flex",
            flexDirection: "column",
          }}
        >
          <div>123</div>
          <div>456</div>
          <div>789</div>
        </div>
        <div
          style={{
            backgroundColor: "blue",
            display: "inline-flex",
            flexDirection: "column",
          }}
        >
          <div>123</div>
          <div>456</div>
          <div>789</div>
        </div>
        <div
          style={{
            backgroundColor: "blue",
            display: "inline-flex",
            flexDirection: "column",
          }}
        >
          <div>123</div>
          <div>456</div>
          <div>789</div>
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
        initialValue: {},
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
