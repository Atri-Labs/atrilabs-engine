import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";

export const Button = forwardRef<
  HTMLButtonElement,
  {
    styles: React.CSSProperties;
    custom: { text: string };
    onClick: (event: { pageX: number; pageY: number }) => void;
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );
  return (
    <button ref={ref} style={props.styles} onClick={onClick}>
      {props.custom.text}
    </button>
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
  backgroundOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    text: "text",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Button" },
  render: {
    comp: Button,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          backgroundColor: "#E0E1E2",
          cursor: "pointer",
          display: "inline-block",
          minHeight: "1em",
          outline: "0",
          border: "none",
          lineHeight: "1em",
          verticalAlign: "baseline",
          margin: "0 0.25em 0 0",
          padding: "0.78571429em 1.5em 0.78571429em",
          textTransform: "none",
          textShadow: "none",
          fontWeight: "700",
          color: "rgba(0, 0, 0, 0.6)",
          paddingTop: ".78571429em",
          textDecoration: "none",
          fontStyle: "normal",
          textAlign: "center",
          borderRadius: "0.28571429rem",
          userSelect: "none",
          boxShadow:
            "0 0 0 1px transparent inset, 0 0 0 0 rgb(34 36 38 / 15%) inset",
          transition:
            "opacity .1s ease,background-color .1s ease,color .1s ease,box-shadow .1s ease,background .1s ease,-webkit-box-shadow .1s ease",
          fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          text: "Submit",
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
  panel: { comp: CommonIcon, props: { name: "Button" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Button", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
