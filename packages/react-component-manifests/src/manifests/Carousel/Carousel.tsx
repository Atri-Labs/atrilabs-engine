import React, { useState, useEffect, forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import "./Carousel.css";
import { ReactComponent as Icon } from "./icon.svg";

export type CarouselItemTypes = {
  children: string;
  width: string;
  backgroundImage: string;
};

export type CarouseWrapperTypes = {
  children: any;
  startTile: number;
};

export const CarouselItem: React.FC<CarouselItemTypes> = ({
  children,
  width,
  backgroundImage,
}) => {
  return (
    <div
      className="carousel-item"
      style={{
        width: width,
        backgroundImage: `url(
          ${backgroundImage}
        )`,
      }}
    >
      {children}
    </div>
  );
};

export const CarouselWrapper: React.FC<CarouseWrapperTypes> = ({
  children,
  startTile,
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
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="inner"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { width: "100%" });
        })}
      </div>
      <div className="indicators">
        {React.Children.map(children, (child, index) => {
          return (
            <button
              className={`${index === activeIndex ? "active" : ""}`}
              onClick={() => {
                updateIndex(index);
              }}
            ></button>
          );
        })}
      </div>
    </div>
  );
};

export const Carousel = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { items: []; startTile: number; imageItems: [] };
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
      <CarouselWrapper startTile={props.custom.startTile}>
        {props.custom.items.map((item, i) => (
          <CarouselItem
            width="100%"
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
    items: "array",
    startTile: "number",
    imageItems: "array_static_asset",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Carousel", category: "Basics" },
  render: {
    comp: Carousel,
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
          items: [],
          startTile: 0,
          imageItems: [],
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
