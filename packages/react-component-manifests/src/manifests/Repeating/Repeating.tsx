import React, { forwardRef } from "react";

const Repeating = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { start: number; end: number; data: any[] };
    className?: string;
    ChildFC: React.FC<{ data: any }>;
  }
>((props, ref) => {
  return (
    <div style={props.styles} ref={ref} className={props.className}>
      {props.custom.data
        .slice(props.custom.start, props.custom.end)
        .map((dataI) => {
          return <props.ChildFC data={dataI} />;
        })}
    </div>
  );
});

export default Repeating;
