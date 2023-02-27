import React, { forwardRef, useCallback } from "react";
import { Select as AntdSelect} from "antd";

const Select = forwardRef<
  HTMLSelectElement,
  {
    styles: React.CSSProperties;
    custom: {
      name: string;
      label: string[];
      checked: boolean;
      options?: any;
    };
    onChange: (checked: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  const onChangeCb: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      props.onChange(e.target.checked);
    },
    [props]
  );
  return (
      <AntdSelect 
      ref={(node: any) => {
        console.log("select",node)
        if (typeof ref === "function") {
          ref(node || null);
        } else if (ref) {
          ref.current = node || null;
        }
        debugger
      }}
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
  );
});

export default Select;
