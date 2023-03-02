import React, { forwardRef} from "react";
import { Radio as AntdRadio } from "antd";

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
  const { custom, ...restProps } = props;

  // moved ref to div, as the Antd Radio doesnt provide ref for Radio 
  return (
    <div ref={ref} style={{display: 'inline-block'}}>
      <AntdRadio
        name={props.custom.name || "Name"}
        style={{
          ...props.styles,
          height: props.custom.radius,
          width: props.custom.radius,
        }}
        className={props.className}
        checked={props.custom.checked}
        value={props.custom.label ? props.custom.label : "label"}
      >
        {props.custom.label ? props.custom.label : "label"}
      </AntdRadio>
    </div>
  );
});

export default Radio;
