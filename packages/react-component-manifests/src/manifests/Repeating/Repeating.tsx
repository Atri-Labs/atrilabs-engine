import React, { forwardRef } from "react";

const Repeating = forwardRef<
  HTMLUListElement,
  {
    styles: React.CSSProperties;
    custom: { start: number; end: number };
    className?: string;
    children: React.ReactNode[];
  }
>((props, ref) => {
  return (
    <ul style={{ ...props.styles }} ref={ref} className={props.className}>
      {props.children
        .slice(props.custom.start, props.custom.end)
        .map((child, index) => {
          return <li key={index - props.custom.start}>{child}</li>;
        })}
    </ul>
  );
});

export default Repeating;
