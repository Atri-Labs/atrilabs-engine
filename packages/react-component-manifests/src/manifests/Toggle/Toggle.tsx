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
    <>
      <style>
        {`.toggle-holder {
            width: 100%;
            height: 100%;
          }
          .toggle-switch-checkbox {
            height: 0;
            width: 0;
            visibility: hidden;
          }
          
          .toggle-switch-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            width: 100%;
            height: 100%;
            background: grey;
            border-radius: 100px;
            position: relative;
            transition: background-color 0.2s;
          }
          
          .toggle-switch-label .toggle-switch-button {
            position: absolute;
            top: 5%;
            left: 4px;
            width: 45%;
            height: 90%;
            border-radius: 50%;
            transition: 0.2s;
            background: #fff;
          }
          
          .toggle-switch-checkbox:checked + .toggle-switch-label .toggle-switch-button {
            left: calc(100% - 4px);
            transform: translateX(-100%);
          }
          
          .toggle-switch-label:active .toggle-switch-button {
            width: 40%;
          }

          `}
      </style>
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
    </>
  );
};

export const Toggle = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { active: boolean; activeColor: string; inactiveColor: string };
    onChange: (checked: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      props.onChange(e.target.checked);
    },
    [props]
  );
  return (
    <div
      ref={ref}
      style={{ ...props.styles, display: "inline-flex" }}
      className={props.className}
    >
      <ToggleHelper
        isOn={props.custom.active}
        onColor={props.custom.activeColor}
        offColor={props.custom.inactiveColor}
        handleToggle={handleChange}
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
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    active: { type: "boolean" },
    activeColor: { type: "color" },
    inactiveColor: { type: "color" },
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
