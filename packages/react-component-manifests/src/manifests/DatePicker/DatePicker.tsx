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
  // moved ref to div, as the Antd DatePicker doesnt provide ref for DatePicker
  return (
    <div ref={ref} style={{ display: "inline-block" }}>
      <AntdDatePicker
        picker={props.custom?.picker}
        showTime={props.custom?.showTime}
        style={props.styles}
      />
    </div>
  );
});

export default DatePicker;
