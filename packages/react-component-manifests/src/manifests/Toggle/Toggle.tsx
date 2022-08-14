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
import { ReactComponent as Icon } from "./icon.svg";

export type ToggleComponentTypes = {
  isOn: boolean;
  onColor: string;
  offColor: string;
  handleToggle: any;
};

export const ToggleHelper: React.FC<ToggleComponentTypes> = ({
  isOn,
  onColor,
  offColor,
  handleToggle,
}) => {
  return (
    <div className="toggle-holder">
      <input
        checked={isOn}
        onChange={handleToggle}
        className="toggle-switch-checkbox"
        id="toggle-switch-new"
        type="checkbox"
      />
      <label
        style={
          isOn ? { background: `${onColor}` } : { background: `${offColor}` }
        }
        className="toggle-switch-label"
        htmlFor="toggle-switch-new"
      >
        <span className="toggle-switch-button" />
      </label>
    </div>
  );
};

export const Toggle = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { active: boolean; activeColor: string; inactiveColor: string };
    onChange: (checked: boolean) => void;
  }
>((props, ref) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      console.log("changed");
      props.onChange(e.target.checked);
    },
    [props]
  );
  return (
    <div ref={ref} style={{ ...props.styles, display: "inline-flex" }}>
      <ToggleHelper
        isOn={props.custom.active}
        onColor={props.custom.activeColor}
        offColor={props.custom.inactiveColor}
        handleToggle={onChange}
      />
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
    activeColor: "color",
    inactiveColor: "color",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Toggle", category: "Basics" },
  render: {
    comp: Toggle,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          width: "100px",
          height: "50px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          activeColor: "#2196f3",
          active: false,
          inactiveColor: "#CCCCCC",
        },
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
  panel: { comp: CommonIcon, props: { name: "Toggle", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Toggle", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
