import React, { forwardRef } from "react";

const Repeating = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { start: number; end: number; data: any[] };
    className?: string;
    children: React.FC<{ data: any }>;
  }
>((props, ref) => {
  return (
    <div style={props.styles} ref={ref} className={props.className}>
      {props.custom.data
        .slice(props.custom.start, props.custom.end)
        .map((dataI) => {
          return <props.children data={dataI} />;
        })}
    </div>
  );
});

export default Repeating;
