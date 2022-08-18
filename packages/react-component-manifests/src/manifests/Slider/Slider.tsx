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
import { ReactComponent as Icon } from "./icon.svg";

export const Slider = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      value: number;
      maxValue: number;
      minValue: number;
    };
    onChange: (value: number) => void;
  }
>((props, ref) => {
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const startPostion = { x: e.pageX, y: e.pageY };
      const onMouseMove = (e: MouseEvent) => {
        if (startPostion) {
          const delta = e.pageX - startPostion.x;
          const offset = (props.custom.maxValue - props.custom.minValue) / 400;
          let change = delta * offset;
          if (change + props.custom.value < 0) {
            change = -props.custom.value;
          }
          if (change + props.custom.value > props.custom.maxValue) {
            change = props.custom.maxValue - props.custom.value;
          }
          props.onChange(props.custom.value + change);
        }
      };
      const onMouseUp = () => {
        // unsubscribe
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      // subscribe
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [props]
  );

  return (
    <div ref={ref} style={props.styles} className="slider-parent">
      <div className="slider-rail"></div>
      <div
        className="slider-progress"
        style={{ width: props.custom.value + "%" }}
      ></div>
      <div
        className="slider-thumb"
        style={{ left: props.custom.value + "%" }}
        onMouseDown={onMouseDown}
      ></div>
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
    minValue: "number",
    maxValue: "number",
    value: "number",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Slider", category: "Basics" },
  render: {
    comp: Slider,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          width: "400px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          minValue: 0,
          maxValue: 100,
          value: 50,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "value"] }],
      onFinish: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Slider", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Slider", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
