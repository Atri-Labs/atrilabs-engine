import React, { forwardRef, useCallback } from "react";
import { Checkbox as AntdCheckbox, Form } from "antd";

const Checkbox = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { checked: boolean; options?: any; label: string[] };
    onChange: (checked: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange(e.target.checked);
    },
    [props]
  );
  return (
    <Form.Item
      label={props.custom.label ? props.custom.label : null}
      style={props.styles}
    >
      <AntdCheckbox.Group
        options={
          props.custom.options || [
            { value: "one", label: "One" },
            { value: "two", label: "Two" },
            { value: "three", label: "Three" },
          ]
        }
      />
    </Form.Item>
  );
});

export default Checkbox;
