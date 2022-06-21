import React, { forwardRef } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
// import type {
//   AcceptsChildFunction,
//   ReactComponentManifestSchema,
// } from "@atrilabs/react-component-manifest-schema/lib/types";
import {
  flexRowSort,
  flexColSort,
  flexRowReverseSort,
  flexColReverseSort,
} from "@atrilabs/react-component-manifest-schema/lib/utils";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { gray500 } from "@atrilabs/design-system";

type A = { s: string };

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

const acceptsChild = (info: any) => {
  if (info.childCoordinates.length === 0) {
    return 0;
  }
  const flexDirection: "row" | "column" | "row-reverse" | "column-reverse" =
    info.props.styles["flexDirection"] || "row";
  let index = 0;
  switch (flexDirection) {
    case "row":
      index = flexRowSort(info.loc, info.childCoordinates) || 0;
      break;
    case "column":
      index = flexColSort(info.loc, info.childCoordinates) || 0;
      break;
    case "row-reverse":
      index = flexRowReverseSort(info.loc, info.childCoordinates) || 0;
      break;
    case "column-reverse":
      index = flexColReverseSort(info.loc, info.childCoordinates) || 0;
      break;
  }
  return index;
};

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: true,
  flexChildOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
};

const compManifest = {
  meta: { key: "Flex" },
  render: {
    comp: Flex,
  },
  dev: {
    comp: DevFlex,
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: { display: "flex" },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
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
