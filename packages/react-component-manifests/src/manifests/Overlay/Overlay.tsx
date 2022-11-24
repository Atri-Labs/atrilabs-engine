import React, { forwardRef, useContext, useEffect, useState } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type {
  AcceptsChildFunction,
  ReactComponentManifestSchema,
} from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { GlobalContext, createPortal } from "@atrilabs/core/lib/reactUtilities";
import {
  flexRowSort,
  flexColSort,
  flexRowReverseSort,
  flexColReverseSort,
} from "@atrilabs/react-component-manifest-schema/lib/utils";
import { ReactComponent as Icon } from "./icon.svg";

export const Overlay = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    children: React.ReactNode[];
    custom: {
      closeOverlayAfter?: number;
      open: boolean;
    };
    className?: string;
  }
>((props, ref) => {
  const globalContext = useContext(GlobalContext);

  const [open, setOpen] = useState<boolean>(props.custom.open);
  useEffect(() => {
    setOpen(props.custom.open);
  }, [props.custom.open]);

  useEffect(() => {
    if (props.custom.closeOverlayAfter && open) {
      setTimeout(() => {
        setOpen(false);
      }, props.custom.closeOverlayAfter);
    }
  }, [props.custom.closeOverlayAfter, open]);

  return createPortal(
    <div
      ref={ref}
      className={props.className}
      style={{
        display:
          open !== undefined ? (open ? "flex" : "none") : props.styles.display,
        zIndex: 2,
        ...props.styles,
      }}
    >
      {props.children}
    </div>,
    globalContext.window,
    "body",
    globalContext.portals
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
    closeOverlayAfter: { type: "number" },
    open: { type: "boolean" },
  },
};

const acceptsChild: AcceptsChildFunction = (info: any) => {
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

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Overlay", category: "Basics" },
  render: {
    comp: Overlay,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          backgroundColor: "#00000073",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          open: true,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {},
    defaultCallbackHandlers: {},
    acceptsChild,
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Overlay", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Overlay", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
