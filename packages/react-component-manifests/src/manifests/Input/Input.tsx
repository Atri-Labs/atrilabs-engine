import React, { forwardRef, ReactNode, ChangeEventHandler } from "react";
import { Input as AntdInput } from "antd";


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
    }
    id?: string;
    className?: string;
    custom: {
      value: string;
      placeholder: string;
      isPasswordField?: boolean;
      onChange: ChangeEventHandler<HTMLElement>;
      onPressEnter?: () => void;
      size?: InputSize; //The size of the input box. Note: in the context of a form, the middle size is used	large | middle | small
      addonAfter?: ReactNode; //The label text displayed after (on the right side of) the input field
      addonBefore?: ReactNode; //The label text displayed before (on the left side of) the input field
      allowClear?: boolean | { clearIcon: ReactNode }; //	If allow to remove input content with clear icon
      bordered?: boolean; //Whether has border style
      defaultValue?: string; //The initial input content
      disabled?: boolean; //Whether the input is disabled
      id?: string; //The ID for input
      maxLength?: number; //The max length
      showCount?:
        | boolean
        | {
            formatter: (info: {
              value: string;
              count: number;
              maxLength?: number;
            }) => ReactNode;
          }; //Whether show text count
      status?: InputStatus; //Set validation status	'error' | 'warning'
      prefix?: ReactNode; //The prefix icon for the Input
      suffix?: ReactNode; //The suffix icon for the Input
      type?: string; //The type of input, see: MDN( use Input.TextArea instead of type="textarea")
    };
  }
>((props, ref) => {
  const { custom } = props;
  const { isPasswordField, ...restCustomProps } = custom;

  return (
    // moved ref to div, while changing isPasswordField props ref was not able assign twice to another input and the selection was not working without refreshing the editor
    <div ref={ref} style={{ display: "inline-block" }} id={props.id}>
      {isPasswordField === true ? (
        <AntdInput.Password
          {...restCustomProps}
          className={props.className}
          style={{
            ...props.styles,
            animationDuration: "0s",
            animationTimingFunction: "unset",
            transitionDuration: "0s",
            transitionTimingFunction: "unset",
          }}
        />
      ) : (
        <AntdInput
          {...restCustomProps}
          className={props.className}
          style={{
            ...props.styles,
            animationDuration: "0s",
            animationTimingFunction: "unset",
            transitionDuration: "0s",
            transitionTimingFunction: "unset",
          }}
        />
      )}
    </div>
  );
});

export default Input;
