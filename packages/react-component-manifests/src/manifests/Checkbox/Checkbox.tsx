import React, { forwardRef } from "react";
import { Checkbox as AntdCheckbox } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

const Checkbox = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
      "aria-labelledby": string;
    };
    custom: {
      defaultValue: (string | number)[];
      disabled?: boolean;
      options: Option[];
      name?: string;
      value?: (string | number | boolean)[];
    };
    onChange?: (checkedValue: Array<CheckboxValueType>) => void;
    id?: string;
    className?: string;
  }
>((props, ref) => {
  const { custom } = props;
  // moved ref to div, as the Antd Checkbox doesnt provide ref for Checkbox
  return (
    <div ref={ref} style={{ display: "inline-block" }} id={props.id}>
      <AntdCheckbox.Group
        aria-labelledby={props.attrs["aria-labelledby"]}
        className={`${props.className} ${props.attrs?.class}`}
        style={props.styles}
        {...custom}
        onChange={props.onChange}
      />
    </div>
  );
});

export default Checkbox;
