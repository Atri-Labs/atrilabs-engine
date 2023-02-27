import React, { forwardRef, ReactNode, ChangeEventHandler } from "react";
import { Input as AntdInput, InputRef } from "antd";
const  TextArea  = AntdInput.TextArea;

const Textarea = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { value: string; placeholder: string };
    onChange: ChangeEventHandler<HTMLElement>;
    onPressEnter?: () => void;
    onResize?: () => { width: number; height: number }; //The callback function that is triggered when resize
    className?: string;
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
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  return (
    <TextArea
    ref={(node: InputRef) => {
      if (typeof ref === "function") {
        ref(node?.input || null);
      } else if (ref) {
        ref.current = node?.input || null;
      }
    }}
    {...restProps}
    {...custom}
    value={props.custom.value}
    />
  );
});

export default Textarea;
