import React, { forwardRef } from "react";
import { Badge as AntdBadge } from "antd";

const Badge = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    className?: string;
    children: React.ReactNode[];
    custom?: {
      count?: number;
      countIcon?: string;
      showZero?: boolean;
      overflowCount?: number;
      dot?: boolean;
      status?: "success" | "processing" | "default" | "error" | "warning";
      color?: string;
      text?: string;
      size?: "default" | "small";
      title?: string;
      ribbon?: boolean;
      ribbonText?: string;
      ribbonPlacement?: "start" | "end";
      ribbonColor?: string;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
  }
>((props, ref) => {
  const { custom } = props;

  // moved ref to div, as the Antd Badge doesnt provide ref for Badge
  return (
    <div
      ref={ref}
      style={{
        minHeight: props.styles.height ? "" : "100px",
        minWidth: props.styles.width ? "" : "100px",
      }}
    >
      {props.custom?.ribbon === true ? (
        <AntdBadge.Ribbon
          className={props.className}
          style={props.styles}
          text={props.custom.ribbonText}
          placement={props.custom.ribbonPlacement}
          color={props.custom.ribbonColor}
        >
          {props.children}
        </AntdBadge.Ribbon>
      ) : (
        <AntdBadge
          className={props.className}
          style={props.styles}
          {...custom}
          count={
            props.custom?.countIcon !== undefined ? (
              <img
                src={props.custom?.countIcon}
                alt={props.custom?.countIcon}
              />
            ) : (
              props.custom?.count
            )
          }
          status={props.custom?.status}
        >
          {props.children}
        </AntdBadge>
      )}
    </div>
  );
});

export default Badge;
