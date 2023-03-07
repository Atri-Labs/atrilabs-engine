import React, { forwardRef, useState } from "react";
import { Typography as AntdTypography } from "antd";
import { width } from "@mui/system";
const { Paragraph } = AntdTypography;

export type TextStyle =
  | "code"
  | "keyboard"
  | "mark"
  | "strong"
  | "italic"
  | "underline"
  | "delete";

export type TextType = "secondary" | "success" | "warning" | "danger";

const Typography = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    className?: string;
    custom?: {
      isTitle: boolean;
      text?: string;
      style: TextStyle;
      type?: TextType;
      disabled: boolean;
      ellipsis?: boolean;
      editable: boolean;
      copyable?: boolean;
      rows?:number;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
 
  return (
    <div ref={ref} >
      <AntdTypography>
        <Paragraph 
          style={props.styles}
          ellipsis={props.custom?.ellipsis ? { rows: props.custom?.rows, expandable: true, symbol: 'more' } : false}
          type={props.custom?.type}
          code={props.custom?.style === "code"}
          keyboard={props.custom?.style === "keyboard"}
          mark={props.custom?.style === "mark"}
          strong={props.custom?.style === "strong"}
          italic={props.custom?.style === "italic"}
          underline={props.custom?.style === "underline"}
          delete={props.custom?.style === "delete"}
          onClick={props.onClick}
          disabled={props.custom?.disabled}
          editable={props.custom?.editable}
          copyable={props.custom?.copyable}
        >
         {props.custom?.text} 
        </Paragraph>
      </AntdTypography>
    </div>
  );
});

export default Typography;
