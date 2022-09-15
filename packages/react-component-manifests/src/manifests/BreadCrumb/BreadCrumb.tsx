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

type BreadCrumbProps = {
    divider: string;
    items: {
      // this will be visible
      name: string;
      // link
      link: string;
    }[];
    onClick: (item: { name: string; link: string }) => {};
  };
  
export  const BreadCrumb: React.FC<BreadCrumbProps> = (props) => {
    return <div></div>;
};

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
    text: "text",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "BreadCrumb", category: "Basics" },
  render: {
    comp: BreadCrumb,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          color: "#fff",
          backgroundColor: "#1890ff",
          paddingTop: "8px",
          paddingLeft: "15px",
          paddingBottom: "8px",
          paddingRight: "15px",
          fontSize: "16px",
          borderRadius: "2px",
          outline: "none",
          fontWeight: 400,
          textAlign: "center",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#1890ff",
          cursor: "pointer",
          userSelect: "none",
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
  panel: { comp: CommonIcon, props: { name: "BreadCrumb", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "BreadCrumb", containerStyle: { padding: "1rem", svg: Icon } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};






