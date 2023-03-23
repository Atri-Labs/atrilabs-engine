import React, { forwardRef } from "react";
import { DatePicker as AntdDatePicker } from "antd";

export type PickerType = "week" | "month" | "quarter" | "year";

const DatePicker = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    className?: string;
    custom: { picker?: PickerType; showTime?: boolean; disabled?: boolean };
    onOpenChange?: (open: boolean) => void;
  }
>((props, ref) => {
  // moved ref to div, as the Antd DatePicker doesnt provide ref for DatePicker
  return (
    <div ref={ref} style={{ display: "inline-block" }}>
      <AntdDatePicker
        className={props.className}
        style={props.styles}
        picker={props.custom?.picker}
        showTime={props.custom?.showTime}
        disabled={props.custom?.disabled}
        onOpenChange={props.onOpenChange}
      />
    </div>
  );
});

export default DatePicker;
