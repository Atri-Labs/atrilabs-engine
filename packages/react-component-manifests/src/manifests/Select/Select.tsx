import React, { forwardRef } from "react";
import { Select as AntdSelect } from "antd";

const Select = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      name: string;
      label: string[];
      options?: any;
      defaultValue?: any;
    };
    onChange: (checked: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const { custom, ...restProps } = props;

  return (
    <div ref={ref} style={props.styles}>
      <AntdSelect
        defaultValue={props.custom.defaultValue}
        {...restProps}
        {...custom}
        className={props.className}
        style={props.styles}
        onChange={props.onChange}
        options={
          props.custom.options || [
            { value: "one", label: "One" },
            { value: "two", label: "Two" },
            { value: "three", label: "Three" },
          ]
        }
        placeholder="Select"
      >
        {props.custom.label ? props.custom.label : "label"}
      </AntdSelect>
    </div>
  );
});

export default Select;