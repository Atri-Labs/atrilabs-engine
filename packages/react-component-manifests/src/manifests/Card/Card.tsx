import React, { forwardRef, ReactNode } from "react";
import { Card as AntdCard, Avatar } from "antd";
const { Meta } = AntdCard;

export type type = "card" | "meta";

export type Size = "default" | "small";

const Card = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      type: type;
      text: string;
      tabBarExtraContent: ReactNode;
      bordered: boolean;
      cover: string;
      avatar: string;
      description: ReactNode;
      size?: Size;
      loading?: boolean;
    };
    className?: string;
    onTabChange?: (key: string) => void;
  }
>((props, ref) => {
  return (
    <AntdCard
      ref={ref}
      className={props.custom.type === "card" ? props.className : undefined}
      style={props.styles}
      title={props.custom.type === "card" ? props.custom.text : undefined}
      bordered={props.custom.bordered}
      size={props.custom.size}
      cover={<img src={props.custom.cover} alt={props.custom.cover} />}
      onTabChange={props.onTabChange}
      loading={props.custom.loading}
    >
      {props.custom.type === "card" && <p> {props.custom.description}</p>}
      {props.custom.type === "meta" && (
        <Meta
          className={props.className}
          style={props.styles}
          avatar={
            props.custom.avatar ? (
              <Avatar src={props.custom.avatar} alt={props.custom.avatar} />
            ) : undefined
          }
          title={props.custom.text}
          description={props.custom.description}
        />
      )}
    </AntdCard>
  );
});

export default Card;
