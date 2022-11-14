import React, { forwardRef } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import "./Countup.css";
import { ReactComponent as Icon } from "./icon.svg";
export type DateTimeDisplayComponentTypes = {
  value: number;
  type: string;
};
export type ShowCounterComponentTypes = {
  className?: string;
};
export const ShowCounter: React.FC<ShowCounterComponentTypes> = ({
  className,
}) => {
  return (
    <div
      className={`show-counter ${className ? className : ""}`}
      style={{ display: "inline-flex", padding: "1rem" }}
    ></div>
  );
};
export type CountupProps = {
  styles: React.CSSProperties;
  custom: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    frozen: boolean;
    showDays: boolean;
    showHours: boolean;
    showMinutes: boolean;
    showSeconds: boolean;
  };
  className?: string;
};

export const Countup = forwardRef<HTMLDivElement, CountupProps>(
  (props, ref) => {
    return (
      <div ref={ref} style={{ display: "inline-flex", ...props.styles }}>
        111
      </div>
    );
  }
);

export const DevCountup = forwardRef<HTMLDivElement, CountupProps>(
  (props, ref) => {
    props.custom.frozen = true;
    return <Countup ref={ref} {...props} />;
  }
);

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
    days: { type: "number" },
    hours: { type: "number" },
    // minutes: { type: "number" },
    // seconds: { type: "number" },
    // frozen: { type: "boolean" },
    // showDays: { type: "boolean" },
    // showHours: { type: "boolean" },
    // showMinutes: { type: "boolean" },
    // showSeconds: { type: "boolean" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Countup", category: "Basics" },
  render: {
    comp: Countup,
  },
  dev: {
    comp: DevCountup,
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
          days: 1,
          hours: 1,
          minutes: 1,
          seconds: 1,
          frozen: true,
          showDays: true,
          showHours: true,
          showMinutes: true,
          showSeconds: true,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {},
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Countup", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: {
      name: "Countup",
      containerStyle: { padding: "1rem" },
      svg: Icon,
    },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
// https://www.cssscript.com/number-countup-animation-counter/
