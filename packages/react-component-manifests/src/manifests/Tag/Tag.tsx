import React, { forwardRef, useCallback } from "react";
import { Tag as AntdTag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

export type ColorVariant =
  | "default"
  | "success"
  | "processing"
  | "error"
  | "warning";
export type IconVariant =
  | "default"
  | "success"
  | "waiting"
  | "error"
  | "warning"
  | "processing";

const Tag = forwardRef<
  HTMLElement,
  {
    styles: React.CSSProperties;
    custom: {
      text: string;
      closable?: boolean;
      link?: string;
      color?: string;
      icon?: string;
      closeIcon?: string;
      variant?: ColorVariant;
      iconVariant?: IconVariant;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );
  const { custom, ...restProps } = props;
  const icon =
    props.custom.icon !== undefined || "" ? (
      <img src={props.custom.icon} alt={props.custom.icon} />
    ) : (
      <IconComponent variant={props.custom.iconVariant!} />
    );
  const closeIcon = props.custom.closeIcon !== undefined && (
    <img src={props.custom.closeIcon} alt={props.custom.closeIcon} />
  );

  return (
    <AntdTag
      {...restProps}
      {...custom}
      ref={ref}
      className={props.className}
      style={props.styles}
      onClick={onClick}
      closable={props.custom?.closable}
      color={
        props.custom.color !== undefined || ""
          ? props.custom.color
          : props.custom?.variant
      }
      icon={icon}
      closeIcon={closeIcon}
    >
      {props.custom.link !== undefined || "" ? (
        <a href={props.custom?.link}>{props.custom?.text}</a>
      ) : (
        props.custom?.text
      )}
    </AntdTag>
  );
});

interface IconProps {
  variant: IconVariant;
}

function IconComponent(props: IconProps) {
  switch (props.variant) {
    case "default":
      return <MinusCircleOutlined />;
    case "success":
      return <CheckCircleOutlined />;
    case "waiting":
      return <ClockCircleOutlined />;
    case "error":
      return <CloseCircleOutlined />;
    case "warning":
      return <ExclamationCircleOutlined />;
    case "processing":
      return <SyncOutlined spin />;
    default:
      return null;
  }
}

export default Tag;
