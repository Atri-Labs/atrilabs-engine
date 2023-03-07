import React, { forwardRef, ReactNode } from "react";
import { Timeline as AntdTimeline } from "antd";

export type CollapsibleTypes = "header" | "icon" | "disabled";
export type ExpandIconPosition = "start" | "end";

export type Size = "large" | "middle" | "small";
export type Position = "left" | "right";

const Timeline = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    className?: string;
    custom: {
      items: {
        children?: React.ReactNode;
        time?: React.ReactNode;
        color?: string;
        dot?: React.ReactNode;
        position?: Position;
      }[];
      pending?: React.ReactNode;
      pendingDot?: React.ReactNode;
      reverse?: boolean;
      mode?: "left" | "alternate" | "right";
    };
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  return (
    <div ref={ref} style={{display: 'inline-block'}}>
      <AntdTimeline
        style={props.styles}
        className={props.className}
        mode={props.custom.mode}
        items={props.custom.items}
        pending={props.custom.pending}
        pendingDot={props.custom.pendingDot}
        reverse={props.custom.reverse}
      ></AntdTimeline>
    </div>
  );
});
export default Timeline;
