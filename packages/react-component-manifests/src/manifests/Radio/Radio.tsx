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
    custom: { name: string; label: string; checked: boolean };
    onChange: (checked: boolean) => void;
  }
>((props, ref) => {
  const onChangeCb: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      props.onChange(e.target.checked);
    },
    [props]
  );
  return (
    <div style={props.styles} ref={ref}>
      <input
        type="radio"
        onChange={onChangeCb}
        name={props.custom.name}
        value={props.custom.label}
        checked={props.custom.checked}
      />
      <label>{props.custom.label}</label>
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
  backgroundOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    name: "text",
    label: "text",
    checked: "boolean",
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
