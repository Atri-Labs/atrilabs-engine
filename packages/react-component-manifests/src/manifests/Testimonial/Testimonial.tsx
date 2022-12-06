import React, { forwardRef, useCallback, useEffect, useState } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";

export const Testimonial = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      startTile: number;
      intervalTime: number;
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
  const [activeIndex, setActiveIndex] = useState(props.custom.startTile - 1);
  const [paused, setPaused] = useState(false);

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = props.custom.testimonials.length - 1;
    } else if (newIndex >= props.custom.testimonials.length) {
      newIndex = 0;
    }
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        updateIndex(activeIndex + 1);
      }
    }, props.custom.intervalTime * 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        columnGap: "1em",
      }}
      onClick={onClick}
      className={props.className}
    >
      <button
        style={{
          backgroundColor: "black",
          borderColor: "black",
          borderRadius: "50%",
          padding: "0.8em",
          height: "4em",
        }}
        onClick={() => {
          updateIndex(activeIndex - 1);
        }}
      >
        <svg viewBox="0 0 477.175 477.175" height={"1.5em"} fill="white">
          <path
            d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
                            c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"
          ></path>
        </svg>
      </button>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          overflow: "hidden",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="wrapper"
          style={{
            width: `${props.custom.testimonials.length * 100}%`,
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            marginLeft: `-${100 * activeIndex}%`,
            transition: `${props.custom.intervalTime}s`,
          }}
        >
          {props.custom.testimonials.map((testimonial, index) => (
            <div
              className="card"
              key={index}
              style={{
                ...props.styles,
                minHeight: "100%",
                width: "100%",
                background: "#fff",
                borderRadius: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1em",
                columnGap: "1em",
              }}
            >
              {testimonial.profile_pic && (
                <div>
                  <img
                    src={testimonial.profile_pic}
                    alt=""
                    width="200"
                    height="300"
                  />
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
                <div>{testimonial.name}</div>
                <div>{testimonial.designation}</div>
                <div>{testimonial.review}</div>
              </div>
            </div>
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
          {props.custom.testimonials.map((_, index) => (
            <button
              className="active"
              key={index}
              style={
                index === activeIndex
                  ? {
                      outline: "none",
                      height: "15px",
                      border: "2px solid #000",
                      cursor: "pointer",
                      marginLeft: "5px",
                      transition: ".5s",
                      width: "40px",
                      borderRadius: "50px",
                      background: "#fff",
                    }
                  : {
                      background: "none",
                      outline: "none",
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      border: "2px solid #000",
                      cursor: "pointer",
                      marginLeft: "5px",
                      transition: ".5s",
                    }
              }
              onClick={() => {
                updateIndex(index);
              }}
            ></button>
          ))}
        </div>
      </div>
      <button
        style={{
          backgroundColor: "black",
          borderColor: "black",
          borderRadius: "50%",
          padding: "0.8em",
          height: "4em",
        }}
        onClick={() => {
          updateIndex(activeIndex + 1);
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
    startTile: { type: "number" },
    intervalTime: { type: "number" },
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
          startTile: 0,
          intervalTime: 2,
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
