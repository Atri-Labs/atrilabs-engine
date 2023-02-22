import React, { forwardRef, useCallback } from "react";
import { Radio as AntdRadio, Form } from "antd";

const Radio = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: {
      name: string;
      label: string[];
      checked: boolean;
      radius?: string;
      options?: any;
    };
    onChange: (checked: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const onChangeCb: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      props.onChange(e.target.checked);
    },
    [props]
  );
  return (
    <Form.Item
      label={props.custom.label ? props.custom.label : null}
      style={{
        ...props.styles,
        height: props.custom.radius,
        width: props.custom.radius,
      }}
    >
      <AntdRadio.Group
        options={
          props.custom.options || [
            { value: "one", label: "One" },
            { value: "two", label: "Two" },
            { value: "three", label: "Three" },
          ]
        }
        defaultValue={props.custom.checked}
      />
    </Form.Item>
  );
});

export default Radio;
