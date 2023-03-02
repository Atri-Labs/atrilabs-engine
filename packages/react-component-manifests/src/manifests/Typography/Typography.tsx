import React, { forwardRef } from "react";
import { Typography as AntdTypography } from "antd";
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
      content?: string;
      style: TextStyle;
      type?: TextType;
      disabled: boolean;
      ellipsis?: boolean;
      editable: boolean;
      copyable?: boolean;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
  }
>((props, ref) => {
  const { custom, ...restProps } = props;

  return (
    <div ref={ref} style={{ width: 200 }}>
      <AntdTypography>
        <Paragraph
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
          ellipsis={props.custom?.ellipsis}
          editable={props.custom?.editable}
          copyable={props.custom?.copyable}
        >
          {props.custom?.content}
        </Paragraph>
      </AntdTypography>
    </div>
  );
});

export default Typography;
