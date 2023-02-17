import { gray500 } from "@atrilabs/design-system";
import React, { forwardRef } from "react";
import Repeating from "./Repeating";

const DevRepeating = forwardRef<
  HTMLUListElement,
  {
    styles: React.CSSProperties;
    custom: { start: number; end: number };
    className?: string;
    children: React.ReactNode[];
  }
>((props, ref) => {
  const overrideStyleProps: React.CSSProperties =
    props.children.length === 0
      ? {
          // do not provide minHeight minWidth if user has provided height width
          minHeight: props.styles.height ? "" : "100px",
          minWidth: props.styles.width ? "" : "100px",
          borderWidth: `2px`,
          borderStyle: `dashed`,
          borderColor: `${gray500}`,
          boxSizing: "border-box",
          ...props.styles,
        }
      : { ...props.styles };
  return <Repeating ref={ref} {...props} styles={overrideStyleProps} />;
});

export default DevRepeating;
