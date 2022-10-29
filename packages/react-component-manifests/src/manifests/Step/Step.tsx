import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import "./Step.css";
import { ReactComponent as Icon } from "./icon.svg";

export const Step = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { color: string; current: number; title: []; description: [] };
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
      style={props.styles}
      onClick={onClick}
      className={`step-parent ${props.className}`}
    >
      {props.custom.title.map((step, i) => (
        <div
          className="step-wrapper"
          key={i}
          style={{ width: `${100 / props.custom.title.length}%` }}
        >
          {props.custom.current > i + 1 ? (
            <div className="icon-holder">
              <span className="step-icon-done">
                <div
                  style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: `${props.custom.color}`,
                  }}
                  className="step-icon-done-circle"
                ></div>
                <div
                  style={{
                    backgroundColor: `${props.custom.color}`,
                  }}
                  className="step-icon-done-stem"
                ></div>
                <div
                  style={{
                    backgroundColor: `${props.custom.color}`,
                  }}
                  className="step-icon-done-kick "
                ></div>
              </span>
            </div>
          ) : props.custom.current === i + 1 ? (
            <div className="icon-holder">
              <div
                className="step-icon"
                style={{ backgroundColor: `${props.custom.color}` }}
              >
                {i + 1}
              </div>
            </div>
          ) : (
            <div className="icon-holder">
              <div className="step-icon-notreached">{i + 1}</div>
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

          {i + 1 < props.custom.title.length && i + 1 < props.custom.current ? (
            <div className="progress-holder">
              <div
                className="step-progress"
                style={{ backgroundColor: `${props.custom.color}` }}
              ></div>
            </div>
          ) : i + 1 < props.custom.title.length &&
            i + 1 >= props.custom.current ? (
            <div className="progress-holder">
              <div className="step-progress-notreached"></div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
});

export const DevStep = forwardRef<
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

  const modifiedTitleArray =
    props.custom.title.length === 0 ? ["Title 1"] : props.custom.title;
  const modifiedDescriptionArray =
    props.custom.description.length === 0
      ? ["Description"]
      : props.custom.description;

  return (
    <div
      ref={ref}
      style={props.styles}
      onClick={onClick}
      className="step-parent"
    >
      {modifiedTitleArray.map((step, i) => (
        <div
          className="step-wrapper"
          key={i}
          style={{ width: `${100 / modifiedTitleArray.length}%` }}
        >
          {props.custom.current > i + 1 ? (
            <div className="icon-holder">
              <span className="step-icon-done">
                <div
                  style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: `${props.custom.color}`,
                  }}
                  className="step-icon-done-circle"
                ></div>
                <div
                  style={{
                    backgroundColor: `${props.custom.color}`,
                  }}
                  className="step-icon-done-stem"
                ></div>
                <div
                  style={{
                    backgroundColor: `${props.custom.color}`,
                  }}
                  className="step-icon-done-kick "
                ></div>
              </span>
            </div>
          ) : props.custom.current === i + 1 ? (
            <div className="icon-holder">
              <div
                className="step-icon"
                style={{ backgroundColor: `${props.custom.color}` }}
              >
                {i + 1}
              </div>
            </div>
          ) : (
            <div className="icon-holder">
              <div className="step-icon-notreached">{i + 1}</div>
            </div>
          )}
          {i <= props.custom.current ? (
            <div className="step-details">
              <h5>{step}</h5>
              <p>{modifiedDescriptionArray[i]}</p>
            </div>
          ) : (
            <div className="step-details-notreached">
              <h5>{step}</h5>
              <p>{modifiedDescriptionArray[i]}</p>
            </div>
          )}

          {i + 1 < modifiedTitleArray.length && i + 1 < props.custom.current ? (
            <div className="progress-holder">
              <div
                className="step-progress"
                style={{ backgroundColor: `${props.custom.color}` }}
              ></div>
            </div>
          ) : i + 1 < modifiedTitleArray.length &&
            i + 1 >= props.custom.current ? (
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
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    color: { type: "color" },
    current: { type: "number" },
    title: { type: "array" },
    description: { type: "array" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Step", category: "Basics" },
  render: {
    comp: Step,
  },
  dev: {
    comp: DevStep,
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
  panel: { comp: CommonIcon, props: { name: "Step", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Step", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
