import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { ReactComponent as Icon } from "./icon.svg";

export const Breadcrumb = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      divider: string;
      items: {
        // this will be visible
        name: string;
        // link
        link: string;
      }[];
    };
    className?: string;
    onClick: (item: { name: string; link: string }) => {};
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      console.log(props);
    },
    [props]
  );
  const { divider, items } = props.custom;
  const contnet = items.map((element, index) => {
    return (
      <span key={element.name + index}>
        <span>{element.name}</span>
        {/* skip divider on the last element */}
        <span style={{ margin: "0 0.25rem" }}>
          {index !== items.length - 1 ? divider : ""}
        </span>
      </span>
    );
  });
  return (
    <div
      ref={ref}
      className={props.className}
      style={props.styles}
      onClick={onClick}
    >
      {contnet}
    </div>
  );
});

const cssTreeOptions: CSSTreeOptions = {
  boxShadowOptions: true,
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
    divider: {
      type: "text",
    },
    items: {
      type: "array_map",
      singleObjectName: "item",
      attributes: [
        {
          fieldName: "name",
          type: "text",
        },
        {
          fieldName: "link",
          type: "text",
        },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Breadcrumb", category: "Basics" },
  render: {
    comp: Breadcrumb,
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
        initialValue: {
          divider: ">",
          items: [
            {
              name: "Home",
              link: "",
            },
            {
              name: "Application Center",
              link: "",
            },
            {
              name: "Application List",
              link: "",
            },
            {
              name: "Application One",
              link: "",
            },
          ],
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
  panel: { comp: CommonIcon, props: { name: "Breadcrumb", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: {
      name: "Breadcrumb",
      containerStyle: { padding: "1rem", svg: Icon },
    },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
