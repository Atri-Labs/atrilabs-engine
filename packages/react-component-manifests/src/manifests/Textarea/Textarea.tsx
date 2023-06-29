import React, { forwardRef, ReactNode, ChangeEventHandler } from "react";
import { Input as AntdInput } from "antd";

const TextArea = AntdInput.TextArea;

export enum InputStatus {
  ERROR = "error",
  WARNING = "warning",
}

const Textarea = forwardRef<
  HTMLDivElement,
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
      onChange: ChangeEventHandler<HTMLElement>;
      onPressEnter?: () => void;
      onResize?: () => { width: number; height: number }; //The callback function that is triggered when resize
      autoSize?: boolean | object; //Height autosize feature, can be set to true | false or an object { minRows: 2, maxRows: 6 }
      allowClear?: boolean | { clearIcon: ReactNode }; //	If allow to remove textarea content with clear icon
      bordered?: boolean; //Whether has border style
      defaultValue?: string; //The initial textarea content
      disabled?: boolean; //Whether the textarea is disabled
      id?: string; //The ID for textarea
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
      outerDivStyle?: React.CSSProperties;
    };
  }
>((props, ref) => {
  const { custom } = props;
  const { outerDivStyle, ...restProps } = custom;
  // moved ref to div, as the Antd TextArea doesn't provide ref for TextArea
  return (
    <div
      ref={ref}
      style={{
        ...outerDivStyle,
        width: "-webkit-fill-available",
      }}
      id={props.id}
    >
      <TextArea
        className={`${props.className} ${props.attrs?.class}`}
        style={{
          ...props.styles,
          animationDuration: "0s",
          animationTimingFunction: "unset",
          transitionDuration: "0s",
          transitionTimingFunction: "unset",
        }}
        {...restProps}
        value={props.custom.value}
      />
    </div>
  );
});

export default Textarea;
