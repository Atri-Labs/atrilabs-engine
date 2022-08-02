import React, { forwardRef, useCallback, useState, useEffect } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import "./Slider.css";

export const Range = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {};
    onChange: (value: string) => void;
  }
>((props, ref) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange(e.target.value);
    },
    [props]
  );
  const [width, setWidth] = useState("0px");
  function changeProgress(event: React.ChangeEvent<HTMLInputElement>) {
    setWidth(`${Number(event.target.value) * 4}px`);
  }
  useEffect(() => {
    console.log(width);
  }, [width]);
  return (
    <div ref={ref} style={props.styles} onChange={onChange}>
      <div className="input-holder">
        <input
          className="input-slider"
          style={{ width: `200px` }}
          value="42"
          type="range"
          min="0"
          max="50"
          onChange={(e) => changeProgress(e)}
        ></input>

        <div
          style={{
            backgroundColor: "#91d5ff",
            height: "6px",
            borderRadius: "8px",
            width: `${width}`,
            marginTop: "-11px",
            zIndex: "2",
            position: "relative",
          }}
        ></div>
      </div>
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
    startValue: "number",
    endValue: "number",
    value: "number",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Range" },
  render: {
    comp: Range,
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
      onChange: [{ type: "controlled", selector: ["custom", "value"] }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Range" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Range", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
