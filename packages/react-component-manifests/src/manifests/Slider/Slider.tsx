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
  handleStyle?: React.CSSProperties;
  trackStyle?: React.CSSProperties;
  railStyle?: React.CSSProperties;
}

export interface SliderRangeProps extends SliderBaseProps {
  range: true | SliderRange;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  onAfterChange?: (value: [number, number]) => void;
  handleStyle?: React.CSSProperties[];
  trackStyle?: React.CSSProperties[];
  railStyle?: React.CSSProperties;
}

const Slider = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      id: string;
      class: string;
    }
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

  return (
    <div ref={ref} style={{ display: "inline-block" }} id={props.attrs.id}>
      <AntdSlider
        style={props.styles}
        className={`${props.className} ${props.attrs.class}`}
        {...props.custom}
        key={sliderKey}
        marks={marks}
      />
    </div>
  );
});

export default Slider;
