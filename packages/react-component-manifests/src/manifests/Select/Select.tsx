import React, { forwardRef } from "react";
import { Select as AntdSelect } from "antd";

const Select = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
      "aria-labelledby": string;
    };
    custom: {
      options?: any;
      placeholder?: string;
      defaultValue?: any;
      disabled: boolean;
      dropdownStyle?: React.CSSProperties;
    };
    onChange: (checked: boolean) => void;
    id?: string;
    className?: string;
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  // moved ref to div, as the Antd select doesn't provide ref for select
  return (
    <div ref={ref} style={props.styles} id={props.id}>
      <AntdSelect
        aria-labelledby={props.attrs["aria-labelledby"]}
        defaultValue={props.custom.defaultValue}
        {...restProps}
        {...custom}
        className={`${props.className} ${props.attrs?.class}`}
        style={props.styles}
        onChange={props.onChange}
        options={props.custom.options}
        placeholder={props.custom.placeholder}
      />
    </div>
  );
});

export default Select;
