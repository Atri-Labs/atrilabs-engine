import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as Icon } from "./icon.svg";

export const Link = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { text: string; url: string };
    onClick: () => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(() => {
    props.onClick();
  }, [props]);
  return (
    <div
      className={props.className}
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      onClick={onClick}
    >
      <RouterLink to={props.custom.url}>{props.custom.text}</RouterLink>
    </div>
  );
});

export const DevLink = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { text: string; url: string };
    onClick: () => void;
  }
>((props, ref) => {
  const onClick = useCallback(() => {
    props.onClick();
  }, [props]);
  return (
    <div
      ref={ref}
      style={{ display: "inline-block", ...props.styles }}
      onClick={onClick}
    >
      {props.custom.text}
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
    url: { type: "internal_link" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Link", category: "Basics" },
  render: {
    comp: Link,
  },
  dev: {
    comp: DevLink,
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
        initialValue: {
          text: "Link",
          url: "/",
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
  panel: { comp: CommonIcon, props: { name: "Link", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Link", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
