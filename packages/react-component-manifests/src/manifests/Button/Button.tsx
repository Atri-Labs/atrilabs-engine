import React, { forwardRef } from "react";
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
    onClick: (event: React.MouseEvent) => void;
  }
>((props, ref) => {
  return (
    <button ref={ref} style={props.styles} onClick={props.onClick}>
      {props.custom.text}
    </button>
  );
});

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: false,
  flexChildOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
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
        initialValue: { background: "pink" },
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
