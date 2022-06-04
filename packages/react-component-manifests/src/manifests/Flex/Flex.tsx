import React, { forwardRef } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type {
  AcceptsChildFunction,
  ReactComponentManifestSchema,
} from "@atrilabs/react-component-manifest-schema/lib/index";
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

const acceptsChild: AcceptsChildFunction = (info) => {
  const { childCoordinates, relativePointerLoc } = info;
  let minDist = Infinity;
  let minSide: "left" | "top" | "right" | "bottom" = "top";
  let minIndex: number = 0;
  if (
    info.props.styles.flexDirection &&
    info.props.styles.flexDirection.match("column")
  ) {
    for (let i = 0; i < childCoordinates.length; i++) {
      const child = childCoordinates[i]!;
      if (Math.abs(child.top - relativePointerLoc.top) < minDist) {
        minSide = "top";
        minDist = Math.abs(child.top - relativePointerLoc.top);
        minIndex = i;
      }
      if (
        Math.abs(child.top + child.height - relativePointerLoc.top) < minDist
      ) {
        minSide = "bottom";
        minDist = Math.abs(child.top + child.height - relativePointerLoc.top);
        minIndex = i;
      }
    }
  } else {
    for (let i = 0; i < childCoordinates.length; i++) {
      const child = childCoordinates[i]!;
      if (Math.abs(child.left - relativePointerLoc.left) < minDist) {
        minSide = "left";
        minDist = Math.abs(child.left - relativePointerLoc.left);
        minIndex = i;
      }
      if (
        Math.abs(child.left + child.width - relativePointerLoc.left) < minDist
      ) {
        minSide = "right";
        minDist = Math.abs(child.left + child.width - relativePointerLoc.left);
        minIndex = i;
      }
    }
  }
  if (minSide! === "left" || minSide! === "top") {
    return minIndex! - 1;
  } else {
    return minIndex! + 1;
  }
};

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
    acceptsChild,
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
