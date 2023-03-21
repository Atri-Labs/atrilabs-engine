import React, { forwardRef, ReactNode } from "react";
import { Cascader as AntdCascader } from "antd";
import { CascaderProps } from "antd/lib/cascader";
const { SHOW_CHILD, SHOW_PARENT } = AntdCascader;
interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
  code?: number;
  children?: Option[];
}

const Cascader = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      placeholder?: string;
      allowClear?: boolean;
      multiple: boolean;
      size?: "large" | "middle" | "small";
      disabled?: boolean;
      bordered?: boolean;
      placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
      showCheckedStrategy?: "SHOW_PARENT" | "SHOW_CHILD";
      suffixIcon?: string;
      clearIcon?: string;
      expandIcon?: string;
      removeIcon?: string;
      expandTrigger?: "click" | "hover";
      showSearch?: boolean;
      status?: "error" | "warning";
      maxTagCount?: number;
      maxTagTextLength?: number;
      notFoundContent?: string;
      open?: boolean;
      options: Option[];
      onChange?: (
        value: CascaderProps["value"],
        selectedOptions: CascaderProps["options"] | CascaderProps["options"][]
      ) => void;
      onDropdownVisibleChange?: (value: boolean) => void;
      onSearch?: (search: string) => void;
      displayRender?: (
        label: string[],
        selectedOptions: CascaderProps["options"] | CascaderProps["options"][]
      ) => ReactNode; //The render function of displaying selected options
    };
    className?: string;
  }
>((props, ref) => {
  const { custom } = props;

  return (
    <div ref={ref}>
      <AntdCascader
        {...custom}
        className={props.className}
        style={props.styles}
        expandIcon={
          props.custom.expandIcon && (
            <img src={props.custom.expandIcon} alt={props.custom.expandIcon} />
          )
        }
        suffixIcon={
          props.custom.expandIcon && (
            <img src={props.custom.suffixIcon} alt={props.custom.suffixIcon} />
          )
        }
        clearIcon={
          props.custom.expandIcon && (
            <img src={props.custom.clearIcon} alt={props.custom.clearIcon} />
          )
        }
        removeIcon={
          props.custom.expandIcon && (
            <img src={props.custom.removeIcon} alt={props.custom.removeIcon} />
          )
        }
        showCheckedStrategy={
          props.custom.showCheckedStrategy === "SHOW_CHILD"
            ? SHOW_CHILD
            : props.custom.showCheckedStrategy === "SHOW_PARENT"
            ? SHOW_PARENT
            : undefined
        }
      />
    </div>
  );
});

export default Cascader;
