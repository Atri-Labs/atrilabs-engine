import React, { forwardRef, ReactNode } from "react";
import { InputNumber as AntdInputNumber } from "antd";

export enum InputSize {
  LARGE = "large",
  MIDDLE = "middle",
  SMALL = "small",
}

export enum InputStatus {
  ERROR = "error",
  WARNING = "warning",
}

const Input = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    };
    id?: string;
    className?: string;
    custom: {
      value: string;
      placeholder: string;
      size?: InputSize; //The size of the input box. Note: in the context of a form, the middle size is used	large | middle | small
      addonAfter?: ReactNode; //The label text displayed after (on the right side of) the input field
      addonBefore?: ReactNode; //The label text displayed before (on the left side of) the input field
      allowClear?: boolean | { clearIcon: ReactNode }; //	If allow to remove input content with clear icon
      bordered?: boolean; //Whether has border style
      defaultValue?: string; //The initial input content
      disabled?: boolean; //Whether the input is disabled
      id?: string; //The ID for input
      status?: InputStatus; //Set validation status	'error' | 'warning'
      prefix?: ReactNode; //The prefix icon for the Input
      suffix?: ReactNode; //The suffix icon for the Input
      readOnly?: boolean;
      onChange?: (value: string | number | null) => void;
      onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
      onStep?: (
        value: string | number,
        info: {
          offset: string | number;
          type: "up" | "down";
        }
      ) => void;
      /** Parse display value to validate number */
      parser?: (displayValue: string | undefined) => string | number;
      /** Transform `value` to display value show in input */
      formatter?: (
        value: string | number | undefined,
        info: {
          userTyping: boolean;
          input: string;
        }
      ) => string;
    };
  }
>((props, ref) => {
  const { custom } = props;

  return (
    <div ref={ref} style={{ display: "inline-block" }} id={props.id}>
      <AntdInputNumber
        {...custom}
        className={`${props.className} ${props.attrs?.class}`}
        style={{
          ...props.styles,
          animationDuration: "0s",
          animationTimingFunction: "unset",
          transitionDuration: "0s",
          transitionTimingFunction: "unset",
        }}
      />
    </div>
  );
});

export default Input;
