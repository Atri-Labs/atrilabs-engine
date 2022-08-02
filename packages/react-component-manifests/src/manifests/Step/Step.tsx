import React, { useState, forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import "./Step.css";

export const Step = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { color: string; current: number; title: []; description: [] };
    onClick: (event: { pageX: number; pageY: number }) => void;
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );
  return (
    <div ref={ref} style={props.styles} onClick={onClick} className="parent">
      {props.custom.title.map((step, i) => (
        <div className="step-wrapper" key={i}>
          {props.custom.current > i ? (
            <div className="icon-holder">
              <div
                // Need to change the implementation of tick mark.
                className="step-icon-done"
                style={{
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: `${props.custom.color}`,
                }}
              ></div>
            </div>
          ) : props.custom.current === i ? (
            <div className="icon-holder">
              <div
                className="step-icon"
                style={{ backgroundColor: `${props.custom.color}` }}
              >
                {i}
              </div>
            </div>
          ) : (
            <div className="icon-holder">
              <div className="step-icon-notreached">{i}</div>
            </div>
          )}
          {i <= props.custom.current ? (
            <div className="step-details">
              <h5>{step}</h5>
              <p>{props.custom.description[i]}</p>
            </div>
          ) : (
            <div className="step-details-notreached">
              <h5>{step}</h5>
              <p>{props.custom.description[i]}</p>
            </div>
          )}

          {i < props.custom.title.length - 1 && i < props.custom.current ? (
            <div className="progress-holder">
              <div
                className="step-progress"
                style={{ backgroundColor: `${props.custom.color}` }}
              ></div>
            </div>
          ) : i < props.custom.title.length - 1 && i >= props.custom.current ? (
            <div className="progress-holder">
              <div className="step-progress-notreached"></div>
            </div>
          ) : null}
        </div>
      ))}
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
    color: "color",
    current: "number",
    title: "array",
    description: "array",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Step" },
  render: {
    comp: Step,
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
        initialValue: {
          color: "#336699",
          current: 1,
          title: [],
          description: [],
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
  panel: { comp: CommonIcon, props: { name: "Step" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Step", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
