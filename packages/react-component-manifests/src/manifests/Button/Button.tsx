import React, { forwardRef } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/index";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";

export const Button = forwardRef<
  HTMLButtonElement,
  { styles: React.CSSProperties }
>((props, ref) => {
  return (
    <button ref={ref} style={props.styles}>
      Click Me!
    </button>
  );
});

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: false,
  flexChildOptions: true,
  topographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
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
    },
    attachCallbacks: {},
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
