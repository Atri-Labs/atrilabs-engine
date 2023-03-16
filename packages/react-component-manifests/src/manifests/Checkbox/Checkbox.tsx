import React, { forwardRef } from "react";
import { Checkbox as AntdCheckbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const Checkbox = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { checked: boolean; text: string[] };
    onChange: (event: CheckboxChangeEvent) => void
    className?: string;
  }
>((props, ref) => {
  // moved ref to div, as the Antd Checkbox doesnt provide ref for Checkbox
  return (
    <div ref={ref} style={{ display: "inline-block" }}>
      <AntdCheckbox
        className={props.className}
        style={props.styles}
        checked={props.custom.checked}
        onChange={props.onChange}
      >
        {props.custom.text}
      </AntdCheckbox>
    </div>
  );
});

export default Checkbox;
