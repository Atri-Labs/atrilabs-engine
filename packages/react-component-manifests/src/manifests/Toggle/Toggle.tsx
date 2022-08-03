import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import "./Toggle.css";

export const Toggle = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { active: boolean };
    onChange: (checked: boolean) => void;
  }
>((props, ref) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      props.onChange(e.target.checked);
    },
    []
  );
  return (
    <div ref={ref} style={{ ...props.styles, display: "inline-flex" }}>
      <label className="switch">
        <input
          type="checkbox"
          onChange={onChange}
          checked={props.custom.active}
        />
        <span className="slider round"></span>
      </label>
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
  backgroundOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    active: "boolean",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Toggle" },
  render: {
    comp: Toggle,
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
        initialValue: {},
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "active"] }],
    },
    defaultCallbackHandlers: {
      onChange: [{ sendEventData: true }],
    },
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Toggle" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Toggle", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
