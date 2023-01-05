import React, { useRef, forwardRef, useMemo } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import Chevron from "./Chevron";
import { ReactComponent as Icon } from "./icon.svg";

export type AccordionComponentTypes = {
  title: string;
  description: string;
  open: boolean;
  onTitleClick: () => void;
  className?: string;
};

export const AccordionComponent: React.FC<AccordionComponentTypes> = ({
  title,
  description,
  open,
  onTitleClick,
  className,
}) => {
  const content = useRef<HTMLDivElement>(null);

  return (
    <>
      <style>
        {`.accordion-section {
            display: flex;
            flex-direction: column;
          }

          .accordion {
            background-color: #eee;
            color: #444;
            cursor: pointer;
            padding: 18px;
            display: flex;
            align-items: center;
            border: none;
            outline: none;
            transition: background-color 0.6s ease;
          }

          .accordion:hover,
          .active {
            background-color: #ccc;
          }
          
          .accordion-title {
            font-weight: 600;
            font-size: 14px;
            text-align: left;
          }
          
          .accordion__icon {
            margin-left: auto;
            transition: transform 0.6s ease;
          }
          
          .rotate {
            transform: rotate(90deg);
          }

          .accordion-content {
            background-color: white;
            overflow: auto;
          }

          .accordion-text {
            font-weight: 400;
            font-size: 14px;
            padding: 18px;
          }
        `}
      </style>
      <div className={`${className ? className : ""} accordion-section`}>
        <button
          className={`accordion ${open ? "active" : ""}`}
          onClick={() => {
            onTitleClick();
          }}
        >
          <Chevron
            className={`${open ? "accordion-icon rotate" : "accordion-icon"}`}
            fill={"#777"}
          />
          <p className="accordion-title" style={{ marginLeft: "1rem" }}>
            {title}
          </p>
        </button>
        <div
          ref={content}
          style={{
            height: `${open ? content.current?.scrollHeight + "px" : "0px"}`,
          }}
          className="accordion-content"
        >
          <div className="accordion-text">{description}</div>
        </div>
      </div>
    </>
  );
};

export const Accordion = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: { title: string; description?: string; open?: boolean }[];
    };
    onTitleClick: (open: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  return (
    <div ref={ref} style={props.styles}>
      {props.custom.items.map((item, index) => (
        <AccordionComponent
          className={props.className}
          key={index}
          title={item.title}
          description={item.description || ""}
          onTitleClick={() => {
            const open = item.open || false;
            item.open = !item.open;
            props.onTitleClick(open);
          }}
          open={item.open || false}
        />
      ))}
    </div>
  );
});

export const DevAccordian = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: { title: string; description?: string; open: boolean }[];
    };
    onTitleClick: (open: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const items = useMemo(() => {
    if (props.custom.items.length === 0)
      return [
        {
          title: "Title",
          description: "Description will appear here.",
          open: false,
        },
      ];
    return props.custom.items;
  }, [props.custom.items]);

  return (
    <Accordion
      {...props}
      custom={{
        items: items,
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
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    items: {
      type: "array_map",
      singleObjectName: "item",
      attributes: [
        { fieldName: "title", type: "text" },
        { fieldName: "description", type: "text" },
        { fieldName: "open", type: "boolean" },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Accordion", category: "Basics" },
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
          items: [],
          title: [],
          description: [],
          open: [],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onTitleClick: [{ type: "controlled", selector: ["custom", "open"] }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Accordion", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: {
      name: "Accordion",
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
