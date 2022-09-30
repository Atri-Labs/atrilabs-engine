import React, { useState, forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { ReactComponent as Icon } from "./icon.svg";
import { ReactComponent as StarIcon } from "./star.svg";
import { isPropertySignature } from "typescript";

export const Rating = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      // total number of stars
      total: number;
      // rating provided i.e. number of stars that appear colored
      rating: number;
      // color of the unrated star (default #C4C4C4)
      unratedColor: string;
      // color of rated star (default yellow)
      ratedColor: string;
    };
  }
>((props, ref) => {
  const [currentRating, setCurrentRating] = useState(props.custom.rating);

  const buttonStyle = {
    cursor: "pointer",
    margin: "5px",
  };

  const starSvgStyle = {
    width: "inherit",
    height: "inherit",
  };

  const StarButton = ({ currentStarColor, id }) => {
    return (
      <div
        style={{ height: 20, width: 20, margin: "5px" }}
        onMouseEnter={() => {
          setCurrentRating(id);
        }}
        onMouseLeave={() => {
          setCurrentRating(id - 1 < 0 || id == null ? 0 : id);
        }}
        onClick={() => {
          setCurrentRating(id);
        }}
      >
        <StarIcon
          style={{
            ...starSvgStyle,
            fill: currentStarColor,
            stroke: currentStarColor,
          }}
        />
      </div>
    );
  };

  const ratingStarsArray = new Array(props.custom.total)
    .fill(0)
    .map((_, i) => i + 1)
    .map((idx) => {
      if (idx <= currentRating)
        return (
          <StarButton
            key={idx}
            currentStarColor={props.custom.ratedColor}
            id={idx}
          />
        );
      else
        return (
          <StarButton
            key={idx}
            currentStarColor={props.custom.unratedColor}
            id={idx}
          />
        );
    });
  let starCount = 0;
  return (
    <div ref={ref} style={{ display: "inline-flex", flexWrap: "wrap" }}>
      {ratingStarsArray}
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
    total: "number",
    rating: "number",
    unratedColor: "color",
    ratedColor: "color",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Rating", category: "Basics" },
  render: {
    comp: Rating,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          boxSizing: "border-box",
          fontVariant: "tabular-nums",
          fontFeatureSettings: "tnum",
          paddingTop: "4px",
          paddingLeft: "11px",
          paddingBottom: "4px",
          paddingRight: "11px",
          color: "#000000d9",
          fontSize: "14px",
          backgroundColor: "#fff",
          backgroundImage: "none",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#d9d9d9",
          borderRadius: "2px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          total: 5,
          rating: 3,
          unratedColor: "#C4C4C4",
          ratedColor: "orange",
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
  panel: { comp: CommonIcon, props: { name: "Rating", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Rating", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
