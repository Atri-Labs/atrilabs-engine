import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { ReactComponent as Icon } from "./icon.svg";

function isStringANumber(value: string) {
  return value.match(/^[0-9]+$/) === null ? false : true;
}

export const Slider = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      value?: number;
      maxValue?: number;
      minValue?: number;
      thickness?: string;
      radius?: string;
      trackColor?: string;
      thumbColor?: string;
      selectColor?: string;
    };
    onChange?: (value: number) => void;
    onFinish?: (value: number) => void;
    className?: string;
  }
>((props, ref) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const maxValue = useMemo(() => {
    if (props.custom.maxValue === undefined) {
      return 100;
    }
    return props.custom.maxValue;
  }, [props.custom]);

  const minValue = useMemo(() => {
    if (props.custom.minValue === undefined) {
      return 0;
    }
    return props.custom.minValue;
  }, [props.custom]);

  const valueRange = useMemo(() => {
    return maxValue - minValue;
  }, [minValue, maxValue]);

  const value = useMemo(() => {
    if (props.custom.value === undefined) {
      return 50;
    }
    return props.custom.value;
  }, [props.custom]);

  const trackColor = useMemo(() => {
    if (props.custom.trackColor === undefined) {
      return "#CCC";
    }
    return props.custom.trackColor;
  }, [props.custom]);

  const thumbColor = useMemo(() => {
    if (props.custom.thumbColor === undefined) {
      return "#91d5ff";
    }
    return props.custom.thumbColor;
  }, [props.custom]);

  const selectColor = useMemo(() => {
    if (props.custom.selectColor === undefined) {
      return "#91d5ff";
    }
    return props.custom.selectColor;
  }, [props.custom]);

  const thickness = useMemo(() => {
    if (props.custom.thickness === undefined) {
      return "4px";
    }
    if (isStringANumber(props.custom.thickness)) {
      return `${parseFloat(props.custom.thickness)}px`;
    }
    return props.custom.thickness;
  }, [props.custom]);

  const radius = useMemo(() => {
    if (props.custom.radius === undefined) {
      return "8px";
    }
    if (isStringANumber(props.custom.radius)) {
      return `${parseFloat(props.custom.radius)}px`;
    }
    return props.custom.radius;
  }, [props.custom]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (trackRef.current) {
        const scale =
          valueRange / trackRef.current.getBoundingClientRect().width;
        const upperLimit =
          trackRef.current.getBoundingClientRect().left +
          trackRef.current.getBoundingClientRect().width;
        const lowerLimit = trackRef.current.getBoundingClientRect().left;
        const initialValue = value;
        const startPostion = { x: e.pageX, y: e.pageY };
        const onMouseMove = (e: MouseEvent) => {
          if (startPostion) {
            if (e.pageX >= upperLimit) {
              props.onChange?.(maxValue);
            } else if (e.pageX <= lowerLimit) {
              props.onChange?.(minValue);
            } else {
              const delta = e.pageX - startPostion.x;
              const finalValue = initialValue + delta * scale;
              if (finalValue <= maxValue && finalValue >= minValue) {
                props.onChange?.(finalValue);
              }
            }
          }
        };
        const onMouseUp = () => {
          // unsubscribe
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
          const delta = e.pageX - startPostion.x;
          const finalValue = initialValue + delta * scale;
          props.onFinish?.(finalValue);
        };
        // subscribe
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }
    },
    [value, props, maxValue, minValue, valueRange]
  );

  const thumbPosition = useMemo(() => {
    const thumbRadius = thumbRef.current?.getBoundingClientRect().width || 0;
    const scale =
      valueRange / (trackRef.current?.getBoundingClientRect().width || 1);
    console.log(
      thumbRadius,
      scale,
      valueRange,
      trackRef.current?.getBoundingClientRect().width || 1
    );
    // stop initial back display of image
    if (value - minValue <= thumbRadius * scale) {
      console.log("setting 0px", minValue, value);
      return `0px`;
    }
    return `calc(${((value - minValue) / valueRange) * 100}% - 2 * ${radius})`;
  }, [value, minValue, valueRange, radius]);

  const onTrackClicked = useCallback(
    (e: React.MouseEvent) => {
      console.log("onTack");
      const scale =
        valueRange / (trackRef.current?.getBoundingClientRect().width || 1);
      const lowerLimit = trackRef.current?.getBoundingClientRect().left || 0;
      const finalValue = minValue + (e.pageX - lowerLimit) * scale;
      props.onChange?.(finalValue);
      props.onFinish?.(finalValue);
    },
    [valueRange, props, minValue]
  );

  return (
    <>
      <style>
        {`.slider-parent {
            width: 400px;
            margin: 20px;
            position: relative;
          }
          
          .slider-rail {
            width: 105%;
            height: 5px;
            border-radius: 8px;
            background: #f5f5f5;
          }
          .slider-progress {
            position: absolute;
            top: 0;
            left: 0;
            width: 70%;
            height: 5px;
            border-radius: 8px;
            background-color: #91d5ff;
          }
          .slider-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background-color: white;
            position: absolute;
            top: -8px;
            border: 2px solid #91d5ff;
            box-shadow: 1px 1px 10px #91d5ff, 0px 0px 20px #91d5ff;
          }
          `}
      </style>
      <div
        className={props.className}
        ref={ref}
        style={{
          ...props.styles,
          position: "relative",
          display: "inline-block",
          height: `calc(2 * ${radius})`,
        }}
      >
        {/** track */}
        <div
          style={{
            height: thickness,
            backgroundColor: trackColor,
            position: "relative",
            top: "50%",
            transform: "translate(0px, -50%)",
            // center of thumb should match the starting point of track
            width: `calc(100% - 2 * ${radius})`,
            left: radius,
          }}
          ref={trackRef}
          onClick={onTrackClicked}
        ></div>
        {/** selected track */}
        <div
          style={{
            height: thickness,
            backgroundColor: selectColor,
            position: "absolute",
            top: "50%",
            transform: "translate(0px, -50%)",
            // center of thumb should match the starting point of track
            width: thumbPosition,
            left: radius,
          }}
          onClick={onTrackClicked}
        ></div>
        {/** thumb */}
        <div
          ref={thumbRef}
          style={{
            position: "absolute",
            left: thumbPosition,
            height: `calc(2 * ${radius})`,
            width: `calc(2 * ${radius})`,
            backgroundColor: thumbColor,
            top: "50%",
            transform: `translate(0px, -50%)`,
            borderRadius: "50%",
          }}
          onMouseDown={onMouseDown}
        ></div>
      </div>
    </>
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
    minValue: { type: "number" },
    maxValue: { type: "number" },
    value: { type: "number" },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Slider", category: "Basics" },
  render: {
    comp: Slider,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          width: "400px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          minValue: 0,
          maxValue: 100,
          value: 50,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "value"] }],
      onFinish: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Slider", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Slider", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
