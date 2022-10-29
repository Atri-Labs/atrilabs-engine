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

export const Radio = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { name: string; label: string; checked: boolean; radius?: string };
    onChange: (checked: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const onChangeCb: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      props.onChange(e.target.checked);
    },
    [props]
  );
  return (
    <div style={props.styles} ref={ref} className={props.className}>
      <input
        type="radio"
        onChange={onChangeCb}
        name={props.custom.name}
        value={props.custom.label}
        checked={props.custom.checked}
        style={{
          ...props.styles,
          height: props.custom.radius,
          width: props.custom.radius,
        }}
      />
      {props.custom.label ? <label>{props.custom.label}</label> : null}
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
    name: { type: "text" },
    label: { type: "text" },
    checked: { type: "boolean" },
    radius: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Radio", category: "Basics" },
  render: {
    comp: Radio,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          cursor: "pointer",
          display: "inline-flex",
          columnGap: "10px",
          alignItems: "center",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          name: "",
          label: "Radio",
          checked: false,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "checked"] }],
    },
    defaultCallbackHandlers: {
      onChange: [{ sendEventData: true }],
    },
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Radio", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Radio", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
