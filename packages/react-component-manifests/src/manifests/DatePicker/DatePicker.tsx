import React, { forwardRef, useMemo } from "react";
import { DatePicker as AntdDatePicker } from "antd";
const { RangePicker } = AntdDatePicker;

export type PickerType = "week" | "month" | "quarter" | "year";

export interface BasePickerProps {
  allowClear?: boolean;
  picker?: PickerType;
  showTime?: boolean;
  disabled?: boolean;
  format?: "YYYY-MM-DD" | "MM-DD-YYYY" | "DD-MM-YYYY";
  bordered?: boolean;
  status?: "error" | "warning";
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
  range?: boolean;
}
export interface RangePickerProps extends BasePickerProps {
  placeholder?: [string, string];
}
export interface DatePickerProps extends BasePickerProps {
  placeholder?: string;
}

const DatePicker = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      id: string;
      class: string;
    }
    className?: string;
    custom: RangePickerProps | DatePickerProps;
    onOpenChange?: (open: boolean) => void;
  }
>((props, ref) => {
  const { custom } = props;
  const { range, ...restprops } = custom;
  const key = useMemo(() => {
    if (range) {
      return Math.random();
    }
  }, [range]);

  return (
    // moved ref to div, as the Antd DatePicker doesnt provide ref for DatePicker
    <div ref={ref} style={{ display: "inline-block" }} id={props.attrs.id}>
      {range ? (
        <RangePicker
          className={`${props.className} ${props.attrs.class}`}
          style={props.styles}
          {...restprops}
          placeholder={props.custom.placeholder as [string, string]}
          onOpenChange={props.onOpenChange}
        />
      ) : (
        <AntdDatePicker
          className={`${props.className} ${props.attrs.class}`}
          style={props.styles}
          {...restprops}
          placeholder={props.custom.placeholder as string}
          key={key}
          onOpenChange={props.onOpenChange}
        />
      )}
    </div>
  );
});

export default DatePicker;
