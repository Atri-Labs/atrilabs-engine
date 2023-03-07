import React, { forwardRef, useCallback, ReactNode } from "react";
import { Card as AntdCard } from "antd";

export type ButtonShape = "default" | "circle" | "round";

export type ButtonType =
  | "primary"
  | "ghost"
  | "dashed"
  | "link"
  | "text"
  | "default";

export type Size = "default" | "small";

export type ButtonhtmlType = "button" | "submit" | "reset";

const Card = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { title: string ; extra: ReactNode;tabBarExtraContent : ReactNode; bordered: boolean; cover: ReactNode; avatar: ReactNode;description: ReactNode; loading: boolean; size?: Size;  };
    onTabChange: any;
    
    className?: string;
  }
>((props, ref) => {
  const onTabChange = {}
  const { custom, ...restProps } = props;
  return (
    <AntdCard
      ref={ref}
      className={props.className}
      style={props.styles}
     // onTabChange={onTabChange}
      title={props.custom.title} 
      bordered={props.custom.bordered}
      size={props.custom.size}
      extra={props.custom.extra}
    >
        {props.custom.description}
    </AntdCard>
  );
});

export default Card;
