import React, { forwardRef, useMemo } from "react";
import { Slider as AntdSlider } from "antd";
import type { SliderProps as RcSliderProps } from "rc-slider";

export type SliderMarks = RcSliderProps["marks"];

interface SliderRange {
  draggableTrack?: boolean;
}

export interface SliderBaseProps {
  reverse?: boolean;
  min?: number;
  max?: number;
  step?: null | number;
  marks?: {
    value: number;
    style?: React.CSSProperties;
    label: string;
  }[];
  disabled?: boolean;
  keyboard?: boolean;
  vertical?: boolean;
}

export interface SliderSingleProps extends SliderBaseProps {
  range?: false;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onAfterChange?: (value: number) => void;
  handleColor?: string;
  trackColor?: string;
  railColor?: string;
}

export interface SliderRangeProps extends SliderBaseProps {
  range: true | SliderRange;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  onAfterChange?: (value: [number, number]) => void;
  handleColor?: string;
  trackColor?: string;
  railColor?: string;
}

const Slider = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    };
    id?: string;
    className?: string;
    custom: SliderRangeProps | SliderSingleProps;
  }
>((props, ref) => {
  // Update the key whenever props.custom.range changes to true
  const sliderKey = useMemo(() => {
    if (props.custom.range) {
      return Math.random();
    }
  }, [props.custom.range]);

  const marks: SliderMarks = useMemo(() => {
    if (props.custom?.marks) {
      return props.custom?.marks?.reduce(
        (acc: { [key: number]: string }, { value, label }) => {
          acc[value] = label;
          return acc;
        },
        {}
      );
    }
  }, [props.custom.marks]);
  const { custom } = props;
  const { handleColor, trackColor, railColor, ...restProps } = custom;

  return (
    <>
      <style>
        {`  .${props.className} .ant-slider-handle::after,
            .${props.className} .ant-slider-handle:active::after {
              box-shadow: 0 0 0 2px ${handleColor} !important;
            }
            .${props.className} .ant-slider-handle:focus::after ,
            .${props.className} .ant-slider-handle:hover::after{
              box-shadow: 0 0 0 4px ${handleColor} !important;
            }
        `}
      </style>
      <div ref={ref} style={{ display: "inline-block" }} id={props.id}>
        {restProps.range ? (
          <AntdSlider
            style={props.styles}
            className={`${props.className} ${props.attrs?.class}`}
            {...restProps}
            key={sliderKey}
            marks={marks}
            trackStyle={[
              { backgroundColor: trackColor },
              { backgroundColor: trackColor },
            ]}
            railStyle={{ backgroundColor: railColor }}
          />
        ) : (
          <AntdSlider
            style={props.styles}
            className={`${props.className} ${props.attrs?.class}`}
            value={restProps.value as number}
            defaultValue={restProps.defaultValue as number}
            disabled={restProps.disabled}
            reverse={restProps.reverse}
            min={restProps.min}
            max={restProps.max}
            vertical={restProps.vertical}
            key={sliderKey}
            marks={marks}
            trackStyle={{ backgroundColor: trackColor }}
            railStyle={{ backgroundColor: railColor }}
          />
        )}
      </div>
    </>
  );
});

export default Slider;
