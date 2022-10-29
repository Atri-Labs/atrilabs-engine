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

export const Dropdown = forwardRef<
  HTMLSelectElement,
  {
    styles: React.CSSProperties;
    custom: {
      values: string[];
      selectedValue?: string;
      displayedValues?: string[];
      disabled?: boolean;
    };
    onChange: (selectedValue: string) => void;
    className?: string;
  }
>((props, ref) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      props.onChange(e.target.value);
    },
    [props]
  );
  return (
    <select
      value={props.custom.selectedValue}
      onChange={onChange}
      disabled={props.custom.disabled}
      className={props.className}
      style={props.styles}
      ref={ref}
    >
      {props.custom.values.map((value, index) => {
        const displayedValue =
          props.custom.displayedValues?.[index] !== undefined
            ? props.custom.displayedValues?.[index]
            : value;
        return (
          <option value={value} key={value}>
            {displayedValue}
          </option>
        );
      })}
    </select>
  );
});

const DevDropdown: typeof Dropdown = forwardRef((props, ref) => {
  return <Dropdown {...props} ref={ref} />;
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
    values: { type: "array" },
    selectedValue: { type: "text" },
    displayedValues: { type: "array" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Dropdown", category: "Basics" },
  render: {
    comp: Dropdown,
  },
  dev: {
    comp: DevDropdown,
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
          values: [],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "selectedValue"] }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Dropdown", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Dropdown", containerStyle: { padding: "1rem", svg: Icon } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
