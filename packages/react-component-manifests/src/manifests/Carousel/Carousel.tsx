import React, { useState, useEffect, forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { ReactComponent as Icon } from "./icon.svg";

export type CarouselItemTypes = {
  children: string;
  width: string;
  height: string;
  backgroundImage: string;
};

export type CarouseWrapperTypes = {
  children: any;
  startTile: number;
  isCircle: boolean;
  indicatorPosition: string;
};

export const CarouselItem: React.FC<CarouselItemTypes> = ({
  children,
  width,
  height,
  backgroundImage,
}) => {
  return (
    <div
      style={{
        width: width,
        backgroundImage: `url(
          ${backgroundImage}
        )`,
        backgroundSize: "cover",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: height,
        backgroundColor: "#364d79",
        color: "#fff",
      }}
    >
      {children}
    </div>
  );
};

export const CarouselWrapper: React.FC<CarouseWrapperTypes> = ({
  children,
  startTile,
  isCircle,
  indicatorPosition,
}) => {
  const [activeIndex, setActiveIndex] = useState(startTile - 1);
  const [paused, setPaused] = useState(false);

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = React.Children.count(children) - 1;
    } else if (newIndex >= React.Children.count(children)) {
      newIndex = 0;
    }
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        updateIndex(activeIndex + 1);
      }
    }, 3000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  return (
    <div
      style={{ overflow: "hidden", height: "100%" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          whiteSpace: "nowrap",
          transition: "transform 0.3s",
        }}
      >
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { width: "100%", height: "100%" });
        })}
      </div>
      {!isCircle && (
        <div
          style={
            indicatorPosition === "Top"
              ? {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  position: "relative",
                  bottom: "95%",
                }
              : indicatorPosition === "Left"
              ? {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  position: "relative",
                  bottom: "50%",
                  left: "-45%",
                  transform: "rotate(90deg)",
                }
              : indicatorPosition === "Right"
              ? {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  position: "relative",
                  bottom: "50%",
                  left: "45%",
                  transform: "rotate(270deg)",
                }
              : {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  position: "relative",
                  bottom: "10%",
                }
          }
        >
          {React.Children.map(children, (child, index) => {
            return (
              <button
                style={
                  index === activeIndex
                    ? {
                        margin: "5px",
                        border: "none",
                        width: "30px",
                        position: "relative",
                        zIndex: "1",
                        height: "1px",
                        transition: "width 0.3s ease-in",
                      }
                    : {
                        margin: "5px",
                        border: "none",
                        width: "40px",
                        position: "relative",
                        zIndex: "1",
                        height: "1px",
                        transition: "width 0.3s ease-in",
                        color: "#fff",
                      }
                }
                onClick={() => {
                  updateIndex(index);
                }}
              ></button>
            );
          })}
        </div>
      )}
      {isCircle && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {React.Children.map(children, (child, index) => {
            return (
              <button
                style={
                  index === activeIndex
                    ? {
                        margin: "5px",
                        border: "none",
                        width: "12px",
                        marginTop: "-15px",
                        position: "relative",
                        zIndex: "1",
                        height: "12px",
                        transition: "width 0.3s ease-in",
                        borderRadius: "50%",
                        backgroundColor: "#222",
                      }
                    : {
                        margin: "5px",
                        border: "none",
                        width: "12px",
                        marginTop: "-15px",
                        position: "relative",
                        zIndex: "1",
                        height: "12px",
                        transition: "width 0.3s ease-in",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                      }
                }
                onClick={() => {
                  updateIndex(index);
                }}
              ></button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Carousel = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: [];
      startTile: number;
      imageItems: [];
      isIndicatorCircle: boolean;
      indicatorPosition: string;
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
      style={props.styles}
      onClick={onClick}
      className={props.className}
    >
      <CarouselWrapper
        startTile={props.custom.startTile}
        isCircle={props.custom.isIndicatorCircle}
        indicatorPosition={props.custom.indicatorPosition}
      >
        {props.custom.items.map((item, i) => (
          <CarouselItem
            width="100%"
            height="100%"
            key={i}
            backgroundImage={props.custom.imageItems[i]}
          >
            {item ? item : "Sample Text"}
          </CarouselItem>
        ))}
      </CarouselWrapper>
    </div>
  );
});

export const DevCarousel = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: [];
      startTile: number;
      imageItems: [];
      isIndicatorCircle: boolean;
      indicatorPosition: string;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const modifiedItemsArray =
    props.custom.items.length === 0 ? ["Sample Text"] : props.custom.items;

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
      className={props.className}
    >
      <CarouselWrapper
        startTile={props.custom.startTile}
        isCircle={props.custom.isIndicatorCircle}
        indicatorPosition={props.custom.indicatorPosition}
      >
        {modifiedItemsArray.map((item, i) => (
          <CarouselItem
            width="100%"
            height="100%"
            key={i}
            backgroundImage={props.custom.imageItems[i]}
          >
            {item ? item : "Sample Text"}
          </CarouselItem>
        ))}
      </CarouselWrapper>
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
    items: { type: "array" },
    startTile: { type: "number" },
    imageItems: { type: "array_static_asset" },
    isIndicatorCircle: { type: "boolean" },
    indicatorPosition: {
      type: "enum",
      options: ["", "Top", "Bottom", "Left", "Right"],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Carousel", category: "Basics" },
  render: {
    comp: Carousel,
  },
  dev: {
    comp: DevCarousel,
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          height: "300px",
          width: "400px",
        },
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
  panel: { comp: CommonIcon, props: { name: "Carousel", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Carousel", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
