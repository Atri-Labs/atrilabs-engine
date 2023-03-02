import React, { forwardRef } from "react";
import { DatePicker as AntdDatePicker } from "antd";

export type PickerType = "week" | "month" | "quarter" | "year";

const DatePicker = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    className?: string;
    custom?: { picker?: PickerType; showTime?: boolean };
    onClick: (event: { pageX: number; pageY: number }) => void;
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  return (
    <div ref={ref} style={props.styles}>
      <AntdDatePicker
        picker={props.custom?.picker}
        showTime={props.custom?.showTime}
      />
    </div>
  );
});

export default DatePicker;
