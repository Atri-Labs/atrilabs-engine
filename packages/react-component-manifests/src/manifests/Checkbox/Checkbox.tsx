import React, { forwardRef } from "react";
import { Checkbox as AntdCheckbox, Form, InputRef } from "antd";

const Checkbox = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { checked: boolean; options?: any; text: string[] };
    onChange: (checked: boolean) => void;
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
      >
        {props.custom.text}
      </AntdCheckbox>
    </div>
  );
});

export default Checkbox;
