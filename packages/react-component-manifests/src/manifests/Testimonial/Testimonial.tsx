import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";

type TestimonialItemTypes = {
  index: number;
  profile_pic: string;
  name: string;
  designation: string;
  review: string;
};

const TestimonialItem: React.FC<TestimonialItemTypes> = ({
  index,
  profile_pic,
  name,
  designation,
  review,
}) => {
  return (
    <div
      key={index}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "50%",
        rowGap: "0.5em",
        columnGap: "0.5em",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.1em 0.1em 0",
          columnGap: "0.5em",
        }}
      >
        {profile_pic && (
          <div>
            <img src={profile_pic} alt="Profile of reviewer" width="32em" />
          </div>
        )}
        <div>
          <h3 style={{ color: "#000000d9", fontSize: "1em" }}>{name}</h3>
          <p style={{ color: "#00000073", fontSize: "1em" }}>{designation}</p>
        </div>
      </div>
      <div
        style={{
          padding: "0.1em 0.1em 0",
          color: "#00000073",
          fontSize: "1em",
        }}
      >
        {review}
      </div>
    </div>
  );
};

export const Testimonial = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      isPaginated: boolean;
      testimonials: {
        name: string;
        designation: string;
        review: string;
        profile_pic: string;
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
  if (props.custom.isPaginated) {
    return (
      <div
        ref={ref}
        className={props.className}
        style={{
          ...props.styles,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
        onClick={onClick}
      >
        <button
          style={{
            backgroundColor: "black",
            borderColor: "black",
            borderRadius: "50%",
            padding: "0.8em",
            height: "4em",
          }}
        >
          <svg viewBox="0 0 477.175 477.175" height={"1.5em"} fill="white">
            <path
              d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
                    c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"
            ></path>
          </svg>
        </button>
        <div style={{ width: "80%", height: "500px" }}></div>
        <button
          style={{
            backgroundColor: "black",
            borderColor: "black",
            borderRadius: "50%",
            padding: "0.8em",
            height: "4em",
          }}
        >
          <svg viewBox="0 0 477.175 477.175" height={"1.5em"} fill="white">
            <path
              d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5
                    c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"
            ></path>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={props.className}
      style={props.styles}
      onClick={onClick}
    >
      {props.custom.testimonials.map((testimonial, index) => {
        return (
          <TestimonialItem
            index={index}
            profile_pic={testimonial.profile_pic}
            name={testimonial.name}
            designation={testimonial.designation}
            review={testimonial.review}
          />
        );
      })}
    </div>
  );
});

const cssTreeOptions: CSSTreeOptions = {
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
    isPaginated: { type: "boolean" },
    testimonials: {
      type: "array_map",
      singleObjectName: "testimonial",
      attributes: [
        { type: "text", fieldName: "name" },
        { type: "text", fieldName: "designation" },
        { type: "large_text", fieldName: "review" },
        { type: "static_asset", fieldName: "profile_pic" },
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
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          display: "flex",
          justifyContent: "center",
          rowGap: "10px",
          flexWrap: "wrap",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          isPaginated: true,
          testimonials: [],
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
