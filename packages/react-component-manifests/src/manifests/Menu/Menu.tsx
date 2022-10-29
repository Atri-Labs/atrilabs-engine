import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type {
  AcceptsChildFunction,
  ReactComponentManifestSchema,
} from "@atrilabs/react-component-manifest-schema/lib/types";
import { flexColSort } from "@atrilabs/react-component-manifest-schema/lib/utils";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import { ReactComponent as MenuIcon } from "./menu.svg";
import { ReactComponent as Icon } from "./icon.svg";

export const Menu = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    children: React.ReactNode[];
    custom: {
      open: boolean;
      iconHeight: number;
      iconWidth: number;
      src?: string;
      strokeColor?: string;
      gap?: number;
      alignRight?: boolean;
    };
    onClick: (open: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(() => {
    props.onClick(!props.custom.open);
  }, [props]);
  const gap = typeof props.custom.gap === "number" ? props.custom.gap : 0;
  return (
    <div
      ref={ref}
      style={{ ...props.styles, position: "relative" }}
      className={props.className}
    >
      <div
        style={{
          height: `${props.custom.iconHeight}px`,
          width: `${props.custom.iconWidth}px`,
        }}
        onClick={onClick}
      >
        {props.custom.src ? (
          <img src={props.custom.src} alt="menu icon" />
        ) : (
          <MenuIcon
            style={{
              stroke: props.custom.strokeColor
                ? props.custom.strokeColor
                : "black",
            }}
          />
        )}
      </div>
      <div
        style={{
          display: props.custom.open ? "flex" : "none",
          flexDirection: "column",
          position: "absolute",
          top: "100%",
          right: props.custom.alignRight ? gap : "",
          left: !props.custom.alignRight ? gap : "",
        }}
      >
        {props.children}
      </div>
    </div>
  );
});

const acceptsChild: AcceptsChildFunction = (info: any) => {
  if (info.childCoordinates.length === 0) {
    return 0;
  }
  return flexColSort(info.loc, info.childCoordinates) || 0;
};

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
    open: { type: "boolean" },
    src: { type: "static_asset" },
    iconHeight: { type: "number" },
    iconWidth: { type: "number" },
    strokeColor: { type: "color" },
    gap: { type: "number" },
    alignRight: { type: "boolean" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Menu", category: "Basics" },
  render: {
    comp: Menu,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: { display: "inline-block" },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          open: true,
          iconHeight: 24,
          iconWidth: 24,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "controlled", selector: ["custom", "open"] }],
    },
    defaultCallbackHandlers: {},
    acceptsChild,
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Menu", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Menu", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
