import React, { forwardRef } from "react";
import { Checkbox as AntdCheckbox, Form, InputRef } from "antd";

const Checkbox = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { checked: boolean; options?: any; label: string[] };
    onChange: (checked: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  return (
    <AntdCheckbox
      ref={(node: InputRef) => {
        if (typeof ref === "function") {
          ref(node?.input || null);
        } else if (ref) {
          ref.current = node?.input || null;
        }
      }}
      className={props.className}
      style={props.styles}
      checked={props.custom.checked}
    >
      {props.custom.label ? props.custom.label : "label"}
    </AntdCheckbox>
  );
});

export default Checkbox;
