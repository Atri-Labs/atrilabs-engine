import React, { forwardRef } from "react";
import { Radio as AntdRadio, RadioChangeEvent } from "antd";

const Radio = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: {
      disabled: boolean;
      options?:
        | string[]
        | number[]
        | Array<{ label: React.ReactNode; value: string; disabled?: boolean }>;
      defaultValue?:
        | string
        | number
        | Array<{ label: React.ReactNode; value: string; disabled?: boolean }>;
      value?: string | number;
      optionType?: "default" | "button";
      size?: "large" | "middle" | "small";
      name?: string;
      buttonStyle?: "outline" | "solid";
    };
    onChange: (event: RadioChangeEvent) => void;
    className?: string;
  }
>((props, ref) => {
  const { custom } = props;
  // moved ref to div, as the Antd Radio doesn't provide ref for Radio
  return (
    <div ref={ref} style={{ display: "inline-block" }}>
      <AntdRadio.Group
        style={props.styles}
        className={props.className}
        onChange={props.onChange}
        {...custom}
      />
    </div>
  );
});

export default Radio;
