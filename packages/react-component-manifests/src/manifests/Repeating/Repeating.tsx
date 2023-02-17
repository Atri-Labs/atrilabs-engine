import React, { forwardRef } from "react";

const Repeating = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { start: number; end: number };
    className?: string;
    children: React.ReactNode[];
  }
>((props, ref) => {
  return (
    <div style={props.styles} ref={ref} className={props.className}>
      {props.children
        .slice(props.custom.start, props.custom.end)
        .map((child) => {
          return child;
        })}
    </div>
  );
});

export default Repeating;
