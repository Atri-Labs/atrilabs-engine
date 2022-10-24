import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import "./Alert.css"

export const Alert = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { title: string, description?: string, statusIcon?: string };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );
  return (
    <div
      ref={ref}
      className={props.className}
      style={{columnGap: "10px", ...props.styles}}
      onClick={onClick}
    >
      { props.custom.statusIcon &&
        <div id="icon">
            <img
             id="icon-logo"
             src={props.custom.statusIcon}
             alt="Icon of the alert" 
            />
        </div> 
      }
      <div id="information">
        <div>{props.custom.title}</div>
        { props.custom.description &&
            <div id="description">
                {props.custom.description}
            </div> 
        }
      </div>
    </div>
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
    title: "text",
    description: "text",
    statusIcon: "static_asset"
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Alert", category: "Basics" },
  render: {
    comp: Alert,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          color: "#fff",
          backgroundColor: "#4bb543",
          paddingTop: "8px",
          paddingLeft: "15px",
          paddingBottom: "8px",
          paddingRight: "15px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          title: "Success",
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
  panel: { comp: CommonIcon, props: { name: "Alert"} },
  drag: {
    comp: CommonIcon,
    props: { name: "Alert", containerStyle: { padding: "1rem"} },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
