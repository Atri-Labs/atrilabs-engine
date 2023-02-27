import React, {
  forwardRef,
  ChangeEventHandler,
  ReactNode,
  useState,
} from "react";
import { Typography } from "antd";
const { Paragraph, Text, Link } = Typography;

export type TextStyle =
  | "code"
  | "keyboard"
  | "mark"
  | "strong"
  | "italic"
  | "underline"
  | "delete";

export type TextType = "secondary" | "success" | "warning" | "danger";
export type TitleLevel = 1 | 2 | 3 | 4 | 5;

const Title = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    className?: string;
    custom?: {
      level: TitleLevel;
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
  //debugger
  const { custom, ...restProps } = props;
  console.log("props.custom?.level", typeof props.custom?.level);
  const [editableStr, setEditableStr] = useState("This is an editable text.");
  // const [ellipsis, setEllipsis] = useState(true);
  return (
    <div ref={ref} style={{ width: 200 }}>
      <Typography>
        <Typography.Title
          level={props.custom?.level}
          type={props.custom?.type}
          code={props.custom?.style === "code"}
          keyboard={props.custom?.style === "keyboard"}
          mark={props.custom?.style === "mark"}
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
        </Typography.Title>
      </Typography>
    </div>
  );
});

export default Title;
