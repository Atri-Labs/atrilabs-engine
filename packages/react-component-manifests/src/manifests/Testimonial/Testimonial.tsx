import React, { useState, useEffect, forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import "./testimonial.css";

type TestimonialItemTypes = {
  profile_pic: string;
  name: string;
  designation: string;
  review: string;
};

const TestimonialItem: React.FC<TestimonialItemTypes> = ({
  profile_pic,
  name,
  designation,
  review,
}) => {
  return (
    <div
      className="card"
      style={{
        minHeight: "100%",
        background: "#fff",
        borderRadius: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1em",
        columnGap: "1em",
      }}
    >
      {profile_pic && (
        <div>
          <img src={profile_pic} alt="" width="200" height="300" />
        </div>
      )}
      <div
        className="card-details"
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "1em",
          paddingLeft: "1em",
        }}
      >
        <div>{name}</div>
        <div>{designation}</div>
        <div>
          This project setup uses webpack for handling all assets. webpack
          offers a custom way of “extending” the concept of import beyond
          JavaScript. To express that a JavaScript file depends on a CSS file,
          you need to import the CSS from the JavaScript file:
        </div>
      </div>
    </div>
  );
};

export const Testimonial = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      startTile: number;
      testimonials: {
        profile_pic: string;
        name: string;
        designation: string;
        review: string;
      }[];
    };
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
      style={{
        ...props.styles,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
      className={props.className}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          className="wrapper"
          style={{
            width: `${props.custom.testimonials.length * 100}%`,
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            transition: "1s",
          }}
        >
          {props.custom.testimonials.map((testimonial, index) => (
            <TestimonialItem
              key={index}
              profile_pic={testimonial.profile_pic}
              name={testimonial.name}
              designation={testimonial.designation}
              review={testimonial.review}
            />
          ))}
        </div>
        <div
          className="indicators"
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "1em",
            paddingBottom: "1em",
          }}
        >
          {props.custom.testimonials.map((testimonial, index) => (
            <button
              className="active"
              style={{
                // background: "none",
                outline: "none",
                // width: "15px",
                height: "15px",
                // borderRadius: "50%",
                border: "2px solid #000",
                cursor: "pointer",
                marginLeft: "5px",
                transition: ".5s",
                width: "40px",
                borderRadius: "50px",
                background: "#fff",
              }}
            ></button>
          ))}
        </div>
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
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    startTile: { type: "number" },
    testimonials: {
      type: "array_map",
      singleObjectName: "testimonial",
      attributes: [
        { fieldName: "name", type: "text" },
        { fieldName: "designation", type: "text" },
        { fieldName: "review", type: "large_text" },
        { fieldName: "profile_pic", type: "static_asset" },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Testimonial", category: "Basics" },
  render: {
    comp: Testimonial,
  },
  dev: {
    comp: Testimonial,
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
          startTile: 0,
          imageItems: [],
          isIndicatorCircle: false,
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
  panel: { comp: CommonIcon, props: { name: "Testimonial" } },
  drag: {
    comp: CommonIcon,
    props: {
      name: "Testimonial",
      containerStyle: { padding: "1rem" },
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
