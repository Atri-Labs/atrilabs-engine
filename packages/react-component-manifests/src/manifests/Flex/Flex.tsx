import React, { forwardRef } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/index";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { gray500 } from "@atrilabs/design-system";

export const DevFlex = forwardRef<
  HTMLDivElement,
  { styles: React.CSSProperties; children: React.ReactNode[] }
>((props, ref) => {
  if (props.children.length > 0) {
    return <Flex ref={ref} {...props} />;
  } else {
    return (
      <div
        ref={ref}
        style={{
          ...props.styles,
          minHeight: "100px",
          minWidth: "100%",
          border: `2px dashed ${gray500}`,
          boxSizing: "border-box",
        }}
      ></div>
    );
  }
});

export const Flex = forwardRef<
  HTMLDivElement,
  { styles: React.CSSProperties; children: React.ReactNode[] }
>((props, ref) => {
  return (
    <div ref={ref} style={props.styles}>
      {props.children}
    </div>
  );
});

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Flex" },
  render: {
    comp: Flex,
  },
  dev: {
    comp: DevFlex,
    decorators: [],
    attachProps: {
      styles: { treeId: CSSTreeId, initialValue: {} },
    },
    attachCallbacks: {},
    acceptsChild: true,
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Flex" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Flex", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
