import React, { forwardRef } from "react";
import { Radio as AntdRadio, RadioChangeEvent } from "antd";

const Radio = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
      "aria-labelledby": string;
    }
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
    id?: string;
    className?: string;
  }
>((props, ref) => {
  const { custom } = props;
  // moved ref to div, as the Antd Radio doesn't provide ref for Radio
  return (
    <div ref={ref} style={{ display: "inline-block" }} id={props.id}>
      <AntdRadio.Group
        style={props.styles}
        className={props.className}
        onChange={props.onChange}
        aria-labelledby ={props.attrs["aria-labelledby"]}
        {...custom}
      />
    </div>
  );
});

export default Radio;
