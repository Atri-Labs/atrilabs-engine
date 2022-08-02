import React, { useState, useRef, forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import Chevron from "./Chevron";
import "./Accordion.css";

export type AccordionComponentTypes = {
  title: string;
  description: string;
};

export const AccordionComponent: React.FC<AccordionComponentTypes> = ({
  title,
  description,
}) => {
  const [setActive, setActiveState] = useState<string>("");
  const [setHeight, setHeightState] = useState<string>("0px");
  const [setRotate, setRotateState] = useState<string>("accordion-icon");

  const content = useRef<HTMLDivElement>(null);

  function toggleAccordion() {
    setActiveState(setActive === "" ? "active" : "");
    if (content.current != null) {
      setHeightState(
        setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
      );
    }

    setRotateState(
      setActive === "active" ? "accordion-icon" : "accordion-icon rotate"
    );
  }

  return (
    <div className="accordion-section">
      <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
        <Chevron className={`${setRotate}`} fill={"#777"} />
        <p className="accordion-title" style={{ marginLeft: "1rem" }}>
          {title}
        </p>
      </button>
      <div
        ref={content}
        style={{ height: `${setHeight}` }}
        className="accordion-content"
      >
        <div className="accordion-text">{description}</div>
      </div>
    </div>
  );
};

export const Accordion = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { title: string[]; description: string[] };
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
    <div ref={ref} style={props.styles} onClick={onClick}>
      {props.custom.title.map((title, i) => (
        <AccordionComponent
          key={i}
          title={title}
          description={props.custom.description[i]}
        />
      ))}
    </div>
  );
});

export const DevAccordian = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { title: string[]; description: string[] };
    onClick: (event: { pageX: number; pageY: number }) => void;
  }
>((props, ref) => {
  const modifiedTitleArray =
    props.custom.title.length === 0 ? ["Title"] : props.custom.title;
  const modifiedDescriptionArray =
    props.custom.description.length === 0
      ? ["Description will appear here."]
      : props.custom.description;
  return (
    <Accordion
      {...props}
      custom={{
        title: modifiedTitleArray,
        description: modifiedDescriptionArray,
      }}
      ref={ref}
    />
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
    title: "array",
    description: "array",
    closed: "array_boolean",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Accordion" },
  render: {
    comp: Accordion,
  },
  dev: {
    comp: DevAccordian,
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
  panel: { comp: CommonIcon, props: { name: "Accordion" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Accordion", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
