import React, { forwardRef } from "react";
import { Badge as AntdBadge } from "antd";

const Badge = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    };
    id?: string;
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
  // moved ref to div, as the Antd Badge doesnt provide ref for Badge
  return (
    <div
      ref={ref}
      style={{
        minHeight: props.styles.height ? "" : "100px",
        minWidth: props.styles.width ? "" : "100px",
      }}
      id={props.id}
    >
      {props.custom?.ribbon === true ? (
        <AntdBadge.Ribbon
          className={`${props.className} ${props.attrs?.class}`}
          style={props.styles}
          text={props.custom.ribbonText}
          placement={props.custom.ribbonPlacement}
          color={props.custom.ribbonColor}
        >
          {props.children}
        </AntdBadge.Ribbon>
      ) : (
        <AntdBadge
          className={`${props.className} ${props.attrs?.class}`}
          style={props.styles}
          showZero={props.custom?.showZero}
          overflowCount={props.custom?.overflowCount}
          dot={props.custom?.dot}
          status={props.custom?.status}
          color={props.custom?.color}
          text={props.custom?.text}
          size={props.custom?.size}
          title={props.custom?.title}
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
        >
          {props.children}
        </AntdBadge>
      )}
    </div>
  );
});

export default Badge;
