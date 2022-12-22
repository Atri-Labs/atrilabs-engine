import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";

type Item = {
  title: string;
  description?: string;
  icon?: string;
};

export const UnorderedList = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      //The list-style-type for the list
      type: string;
      titleColor: string;
      descriptionColor?: string;
      //Title of the list
      items: Item[];
    };
    onClick: (event: { item: Item; index: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(
    (item: Item, index: number) => {
      props.onClick({ item, index });
    },
    [props]
  );
  return (
    <div ref={ref} className={props.className} style={{ ...props.styles }}>
      <ul style={{ listStyle: props.custom.type }}>
        {props.custom.items.map((item, index) => {
          return (
            <li
              style={{
                padding: "0.5em 0",
                borderBottom: "1px solid rgba(0,0,0,.06)",
              }}
              onClick={() => {
                onClick(item, index);
              }}
              key={index}
            >
              <div style={{ display: "flex", columnGap: "0.5em" }}>
                <div>
                  {item.icon && (
                    <img src={item.icon} alt="Element icon" height="32em" />
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "0.5em",
                  }}
                >
                  <h4
                    style={{
                      color: props.custom.titleColor,
                      fontSize: "1em",
                    }}
                  >
                    {item.title}
                  </h4>
                  {item.description && (
                    <p
                      style={{
                        color: props.custom.descriptionColor,
                        fontSize: "1em",
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

const cssTreeOptions: CSSTreeOptions = {
  css2DisplayOptions: true,
  flexContainerOptions: true,
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
    type: { type: "enum", options: ["disc", "circle", "square", "none"] },
    titleColor: { type: "color" },
    descriptionColor: { type: "color" },
    items: {
      type: "array_map",
      singleObjectName: "item",
      attributes: [
        {
          fieldName: "title",
          type: "text",
        },
        {
          fieldName: "description",
          type: "text",
        },
        {
          fieldName: "icon",
          type: "static_asset",
        },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "UnorderedList", category: "Basics" },
  render: {
    comp: UnorderedList,
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
          type: "none",
          titleColor: "#000000d9",
          descriptionColor: "#00000073",
          items: [{ title: "Atri Labs" }],
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
  panel: { comp: CommonIcon, props: { name: "UnorderedList" } },
  drag: {
    comp: CommonIcon,
    props: { name: "UnorderedList", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
